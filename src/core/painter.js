import { CONFIG } from '../config';
import { state } from './state';
import { Utils } from '../utils';
import { WPlaceService } from './api';
import { updateUI } from '../components/ui';
import { handleCaptcha } from './turnstile';

// COLOR MATCHING FUNCTION - Optimized with caching
const colorCache = new Map()

function findClosestColor(targetRgb, availableColors) {
    if (!availableColors || availableColors.length === 0) return 1
    const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}|${state.colorMatchingAlgorithm}|${state.enableChromaPenalty ? 'c' : 'nc'}|${state.chromaPenaltyWeight}`
    if (colorCache.has(cacheKey)) return colorCache.get(cacheKey)

    const whiteThreshold = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD
    if (targetRgb[0] >= whiteThreshold && targetRgb[1] >= whiteThreshold && targetRgb[2] >= whiteThreshold) {
        const whiteEntry = availableColors.find(c => c.rgb[0] >= whiteThreshold && c.rgb[1] >= whiteThreshold && c.rgb[2] >= whiteThreshold)
        if (whiteEntry) { colorCache.set(cacheKey, whiteEntry.id); return whiteEntry.id }
    }

    let bestId = availableColors[0].id
    let bestScore = Infinity

    if (state.colorMatchingAlgorithm === 'legacy') {
        for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i]
            const [r, g, b] = c.rgb
            const rmean = (r + targetRgb[0]) / 2
            const rdiff = r - targetRgb[0]
            const gdiff = g - targetRgb[1]
            const bdiff = b - targetRgb[2]
            const dist = Math.sqrt(((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8))
            if (dist < bestScore) { bestScore = dist; bestId = c.id; if (dist === 0) break }
        }
    } else { // lab
        const [Lt, at, bt] = Utils._lab(targetRgb[0], targetRgb[1], targetRgb[2])
        const targetChroma = Math.sqrt(at * at + bt * bt)
        const penaltyWeight = state.enableChromaPenalty ? (state.chromaPenaltyWeight || 0.15) : 0
        for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i]
            const [r, g, b] = c.rgb
            const [L2, a2, b2] = Utils._lab(r, g, b)
            const dL = Lt - L2, da = at - a2, db = bt - b2
            let dist = dL * dL + da * da + db * db
            if (penaltyWeight > 0 && targetChroma > 20) {
                const candChroma = Math.sqrt(a2 * a2 + b2 * b2)
                if (candChroma < targetChroma) {
                    const cd = targetChroma - candChroma
                    dist += cd * cd * penaltyWeight
                }
            }
            if (dist < bestScore) { bestScore = dist; bestId = c.id; if (dist === 0) break }
        }
    }

    colorCache.set(cacheKey, bestId)
    if (colorCache.size > 15000) { const firstKey = colorCache.keys().next().value; colorCache.delete(firstKey) }
    return bestId
}

export async function processImage() {
    const { width, height, pixels } = state.imageData
    const { x: startX, y: startY } = state.startPosition
    const { x: regionX, y: regionY } = state.region

    const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
    const isEligibleAt = (x, y) => {
        const idx = (y * width + x) * 4;
        const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2], a = pixels[idx + 3];
        if (a < tThresh2) return false;
        if (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b)) return false;
        return true;
    };

    let startRow = 0;
    let startCol = 0;
    let foundStart = false;
    let seen = 0;
    const target = Math.max(0, Math.min(state.paintedPixels || 0, width * height));
    for (let y = 0; y < height && !foundStart; y++) {
        for (let x = 0; x < width; x++) {
            if (!isEligibleAt(x, y)) continue;
            if (seen === target) { startRow = y; startCol = x; foundStart = true; break; }
            seen++;
        }
    }
    if (!foundStart) { startRow = height; startCol = 0; }

    let pixelBatch = null;
    let skippedPixels = { transparent: 0, white: 0, alreadyPainted: 0 };

    try {
        outerLoop: for (let y = startRow; y < height; y++) {
            for (let x = y === startRow ? startCol : 0; x < width; x++) {
                if (state.stopFlag) {
                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        console.log(`🎯 Sending final batch before stop with ${pixelBatch.pixels.length} pixels`);
                        const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
                        if (success) {
                            pixelBatch.pixels.forEach(() => { state.paintedPixels++; });
                            state.currentCharges -= pixelBatch.pixels.length;
                            updateStats();
                        }
                    }
                    state.lastPosition = { x, y }
                    updateUI("paintingPaused", "warning", { x, y })
                    break outerLoop
                }


                const idx = (y * width + x) * 4
                const r = pixels[idx]
                const g = pixels[idx + 1]
                const b = pixels[idx + 2]
                const alpha = pixels[idx + 3]

                const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
                if (alpha < tThresh2 || (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))) {
                    if (alpha < tThresh2) {
                        skippedPixels.transparent++;
                    } else {
                        skippedPixels.white++;
                    }
                    continue;
                }

                let targetRgb;
                if (Utils.isWhitePixel(r, g, b)) {
                    targetRgb = [255, 255, 255];
                } else {
                    targetRgb = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
                }

                const colorId = findClosestColor([r, g, b], state.availableColors);

                let absX = startX + x;
                let absY = startY + y;

                let adderX = Math.floor(absX / 1000);
                let adderY = Math.floor(absY / 1000);
                let pixelX = absX % 1000;
                let pixelY = absY % 1000;

                if (!pixelBatch ||
                    pixelBatch.regionX !== regionX + adderX ||
                    pixelBatch.regionY !== regionY + adderY) {

                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);

                        if (success) {
                            pixelBatch.pixels.forEach((p) => { state.paintedPixels++; });
                            state.currentCharges -= pixelBatch.pixels.length;
                            updateUI("paintingProgress", "default", {
                                painted: state.paintedPixels,
                                total: state.totalPixels,
                            })

                            if (state.paintedPixels % 50 === 0) {
                                Utils.saveProgress()
                            }

                            if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                                const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
                                const totalDelay = Math.max(100, delayPerPixel * pixelBatch.pixels.length) // minimum 100ms
                                await Utils.sleep(totalDelay)
                            }
                            updateStats();
                        } else {
                            // If batch failed after all retries, stop painting to prevent infinite loops
                            console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
                            state.stopFlag = true;
                            break outerLoop;
                        }
                    }

                    pixelBatch = {
                        regionX: regionX + adderX,
                        regionY: regionY + adderY,
                        pixels: []
                    };
                }

                pixelBatch.pixels.push({
                    x: pixelX,
                    y: pixelY,
                    color: colorId,
                    localX: x,
                    localY: y,
                });

                if (pixelBatch.pixels.length >= Math.floor(state.currentCharges)) {
                    const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);

                    if (success) {
                        pixelBatch.pixels.forEach((pixel) => {
                            state.paintedPixels++;
                        })

                        state.currentCharges -= pixelBatch.pixels.length;
                        updateStats()
                        updateUI("paintingProgress", "default", {
                            painted: state.paintedPixels,
                            total: state.totalPixels,
                        })

                        if (state.paintedPixels % 50 === 0) {
                            Utils.saveProgress()
                        }

                        if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                            const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
                            const totalDelay = Math.max(100, delayPerPixel * pixelBatch.pixels.length) // minimum 100ms
                            await Utils.sleep(totalDelay)
                        }
                    } else {
                        // If batch failed after all retries, stop painting to prevent infinite loops
                        console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
                        state.stopFlag = true;
                        break outerLoop;
                    }

                    pixelBatch.pixels = [];
                }

                while (state.currentCharges < state.cooldownChargeThreshold && !state.stopFlag) {
                    const { charges, cooldown } = await WPlaceService.getCharges();
                    state.currentCharges = Math.floor(charges);
                    state.cooldown = cooldown;

                    if (state.currentCharges >= state.cooldownChargeThreshold) {
                        updateStats();
                        break;
                    }

                    updateUI("noChargesThreshold", "warning", {
                        time: Utils.formatTime(state.cooldown),
                        threshold: state.cooldownChargeThreshold,
                        current: state.currentCharges
                    });
                    await updateStats();
                    await Utils.sleep(state.cooldown);
                }
                if (state.stopFlag) break outerLoop;

            }
        }

        if (pixelBatch && pixelBatch.pixels.length > 0 && !state.stopFlag) {
            const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
            if (success) {
                pixelBatch.pixels.forEach((pixel) => {
                    state.paintedPixels++
                })
                state.currentCharges -= pixelBatch.pixels.length;
                if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                    const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
                    const totalDelay = Math.max(100, delayPerPixel * pixelBatch.pixels.length) // minimum 100ms
                    await Utils.sleep(totalDelay)
                }
            } else {
                // If final batch failed after retries, log it
                console.warn(`⚠️ Final batch failed with ${pixelBatch.pixels.length} pixels after all retries.`);
            }
        }
    } finally {
        if (window._chargesInterval) clearInterval(window._chargesInterval)
        window._chargesInterval = null
    }

    if (state.stopFlag) {
        updateUI("paintingStopped", "warning")
        Utils.saveProgress()
    } else {
        updateUI("paintingComplete", "success", { count: state.paintedPixels })
        state.lastPosition = { x: 0, y: 0 }
        state.paintedMap = null
        Utils.clearProgress()
        overlayManager.clear();
        const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
        if (toggleOverlayBtn) {
            toggleOverlayBtn.classList.remove('active');
            toggleOverlayBtn.disabled = true;
        }
    }

    // Log skip statistics
    console.log(`📊 Pixel Statistics:`);
    console.log(`   Painted: ${state.paintedPixels}`);
    console.log(`   Skipped - Transparent: ${skippedPixels.transparent}`);
    console.log(`   Skipped - White (disabled): ${skippedPixels.white}`);
    console.log(`   Skipped - Already painted: ${skippedPixels.alreadyPainted}`);
    console.log(`   Total processed: ${state.paintedPixels + skippedPixels.transparent + skippedPixels.white + skippedPixels.alreadyPainted}`);

    updateStats()
}

// Helper function to retry batch until success with exponential backoff
async function sendBatchWithRetry(pixels, regionX, regionY, maxRetries = 10) {
    let attempt = 0;
    while (attempt < maxRetries && !state.stopFlag) {
        attempt++;
        console.log(`🔄 Attempting to send batch (attempt ${attempt}/${maxRetries}) for region ${regionX},${regionY} with ${pixels.length} pixels`);

        const result = await sendPixelBatch(pixels, regionX, regionY);

        if (result === true) {
            console.log(`✅ Batch succeeded on attempt ${attempt}`);
            return true;
        } else if (result === "token_error") {
            console.log(`🔑 Token error on attempt ${attempt}, regenerating...`);
            updateUI("captchaSolving", "warning");
            try {
                await handleCaptcha();
                // Don't count token regeneration as a failed attempt
                attempt--;
                continue;
            } catch (e) {
                console.error(`❌ Token regeneration failed on attempt ${attempt}:`, e);
                updateUI("captchaFailed", "error");
                // Wait longer before retrying after token failure
                await Utils.sleep(5000);
            }
        } else {
            console.warn(`⚠️ Batch failed on attempt ${attempt}, retrying...`);
            // Exponential backoff with jitter
            const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30s
            const jitter = Math.random() * 1000; // Add up to 1s random delay
            await Utils.sleep(baseDelay + jitter);
        }
    }

    if (attempt >= maxRetries) {
        console.error(`❌ Batch failed after ${maxRetries} attempts (MAX_BATCH_RETRIES=${maxRetries}). This will stop painting to prevent infinite loops.`);
        updateUI("paintingError", "error");
        return false;
    }

    return false;
}

async function sendPixelBatch(pixelBatch, regionX, regionY) {
    let token = turnstileToken;

    // Generate new token if we don't have one
    if (!token) {
        try {
            console.log("🔑 Generating Turnstile token for pixel batch...");
            token = await handleCaptcha();
            turnstileToken = token; // Store for potential reuse
        } catch (error) {
            console.error("❌ Failed to generate Turnstile token:", error);
            tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
            return "token_error";
        }
    }

    const coords = new Array(pixelBatch.length * 2)
    const colors = new Array(pixelBatch.length)
    for (let i = 0; i < pixelBatch.length; i++) {
        const pixel = pixelBatch[i]
        coords[i * 2] = pixel.x
        coords[i * 2 + 1] = pixel.y
        colors[i] = pixel.color
    }

    try {
        const payload = { coords, colors, t: token }

        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            credentials: "include",
            body: JSON.stringify(payload),
        })

        if (res.status === 403) {
            let data = null
            try { data = await res.json() } catch (_) { }
            console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired.")

            // Try to generate a new token and retry once
            try {
                console.log("🔄 Regenerating Turnstile token after 403...");
                token = await handleCaptcha();
                turnstileToken = token;

                // Retry the request with new token
                const retryPayload = { coords, colors, t: token };
                const retryRes = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=UTF-8" },
                    credentials: "include",
                    body: JSON.stringify(retryPayload),
                });

                if (retryRes.status === 403) {
                    turnstileToken = null;
                    tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
                    return "token_error";
                }

                const retryData = await retryRes.json();
                return retryData?.painted === pixelBatch.length;

            } catch (retryError) {
                console.error("❌ Token regeneration failed:", retryError);
                turnstileToken = null;
                tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
                return "token_error";
            }
        }

        const data = await res.json()
        return data?.painted === pixelBatch.length
    } catch (e) {
        console.error("Batch paint request failed:", e)
        return false
    }
}
