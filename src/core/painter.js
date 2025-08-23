import { CONFIG } from '../config';
import { state } from './state';
import { Utils } from '../utils';
import { WPlaceService } from './api';
import { updateUI, updateStats } from '../components/ui';
import { handleCaptcha } from './turnstile';
import { overlayManager } from './overlay';

// COLOR MATCHING FUNCTION - Optimized with caching
const colorCache = new Map()

function findClosestColor(targetRgb, availableColors) {
    if (!availableColors || availableColors.length === 0) return 1;
    const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}|${state.colorMatchingAlgorithm}|${state.enableChromaPenalty ? 'c' : 'nc'}|${state.chromaPenaltyWeight}`;
    if (colorCache.has(cacheKey)) return colorCache.get(cacheKey);

    const whiteThreshold = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
    if (targetRgb[0] >= whiteThreshold && targetRgb[1] >= whiteThreshold && targetRgb[2] >= whiteThreshold) {
        const whiteEntry = availableColors.find(c => c.rgb[0] >= whiteThreshold && c.rgb[1] >= whiteThreshold && c.rgb[2] >= whiteThreshold);
        if (whiteEntry) {
            colorCache.set(cacheKey, whiteEntry.id);
            return whiteEntry.id;
        }
    }

    let bestId = availableColors[0].id;
    let bestScore = Infinity;

    if (state.colorMatchingAlgorithm === 'legacy') {
        for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i];
            const [r, g, b] = c.rgb;
            const rmean = (r + targetRgb[0]) / 2;
            const rdiff = r - targetRgb[0];
            const gdiff = g - targetRgb[1];
            const bdiff = b - targetRgb[2];
            const dist = Math.sqrt(((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8));
            if (dist < bestScore) {
                bestScore = dist;
                bestId = c.id;
                if (dist === 0) break;
            }
        }
    } else { // lab
        const [Lt, at, bt] = Utils._lab(targetRgb[0], targetRgb[1], targetRgb[2]);
        const targetChroma = Math.sqrt(at * at + bt * bt);
        const penaltyWeight = state.enableChromaPenalty ? (state.chromaPenaltyWeight || 0.15) : 0;
        for (let i = 0; i < availableColors.length; i++) {
            const c = availableColors[i];
            const [r, g, b] = c.rgb;
            const [L2, a2, b2] = Utils._lab(r, g, b);
            const dL = Lt - L2, da = at - a2, db = bt - b2;
            let dist = dL * dL + da * da + db * db;
            if (penaltyWeight > 0 && targetChroma > 20) {
                const candChroma = Math.sqrt(a2 * a2 + b2 * b2);
                if (candChroma < targetChroma) {
                    const cd = targetChroma - candChroma;
                    dist += cd * cd * penaltyWeight;
                }
            }
            if (dist < bestScore) {
                bestScore = dist;
                bestId = c.id;
                if (dist === 0) break;
            }
        }
    }

    colorCache.set(cacheKey, bestId);
    if (colorCache.size > 15000) {
        const firstKey = colorCache.keys().next().value;
        colorCache.delete(firstKey);
    }
    return bestId;
}

async function sendPixelBatch(pixelBatch, regionX, regionY) {
    const coords = new Array(pixelBatch.length * 2);
    const colors = new Array(pixelBatch.length);
    for (let i = 0; i < pixelBatch.length; i++) {
        const pixel = pixelBatch[i];
        coords[i * 2] = pixel.x;
        coords[i * 2 + 1] = pixel.y;
        colors[i] = pixel.color;
    }

    const result = await WPlaceService.paintPixelInRegion(regionX, regionY, coords, colors);
    return result;
}

async function sendBatchWithRetry(pixels, regionX, regionY, maxRetries = 10) {
    let attempt = 0;
    while (attempt < maxRetries && !state.stopFlag) {
        attempt++;
        const result = await sendPixelBatch(pixels, regionX, regionY);
        if (result === true) {
            return true;
        } else if (result === "token_error") {
            updateUI("captchaSolving", "warning");
            await handleCaptcha();
            attempt--; // Do not count token regeneration as a failed attempt
        } else {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000) + (Math.random() * 1000);
            await Utils.sleep(delay);
        }
    }
    return false;
}

export async function processImage() {
    const { width, height, pixels } = state.imageData;
    const { x: startX, y: startY } = state.startPosition;
    const { x: regionX, y: regionY } = state.region;

    const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
    const isEligibleAt = (x, y) => {
        const idx = (y * width + x) * 4;
        const a = pixels[idx + 3];
        if (a < tThresh2) return false;
        if (!state.paintWhitePixels && Utils.isWhitePixel(pixels[idx], pixels[idx + 1], pixels[idx + 2])) return false;
        return true;
    };

    let startRow = 0, startCol = 0, foundStart = false, seen = 0;
    const target = Math.max(0, Math.min(state.paintedPixels || 0, width * height));
    for (let y = 0; y < height && !foundStart; y++) {
        for (let x = 0; x < width; x++) {
            if (!isEligibleAt(x, y)) continue;
            if (seen === target) {
                startRow = y;
                startCol = x;
                foundStart = true;
                break;
            }
            seen++;
        }
    }
    if (!foundStart) { startRow = height; startCol = 0; }

    let pixelBatch = null;

    try {
        outerLoop: for (let y = startRow; y < height; y++) {
            for (let x = y === startRow ? startCol : 0; x < width; x++) {
                if (state.stopFlag) {
                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
                    }
                    state.lastPosition = { x, y };
                    updateUI("paintingPaused", "warning", { x, y });
                    break outerLoop;
                }

                if (!isEligibleAt(x, y)) continue;

                const idx = (y * width + x) * 4;
                const colorId = findClosestColor([pixels[idx], pixels[idx + 1], pixels[idx + 2]], state.availableColors);

                let absX = startX + x;
                let absY = startY + y;
                let currentRegionX = regionX + Math.floor(absX / 1000);
                let currentRegionY = regionY + Math.floor(absY / 1000);
                let pixelX = absX % 1000;
                let pixelY = absY % 1000;

                if (!pixelBatch || pixelBatch.regionX !== currentRegionX || pixelBatch.regionY !== currentRegionY) {
                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
                        if (success) {
                            state.paintedPixels += pixelBatch.pixels.length;
                            state.currentCharges -= pixelBatch.pixels.length;
                        }
                    }
                    pixelBatch = { regionX: currentRegionX, regionY: currentRegionY, pixels: [] };
                }

                pixelBatch.pixels.push({ x: pixelX, y: pixelY, color: colorId });

                if (pixelBatch.pixels.length >= Math.floor(state.currentCharges)) {
                    const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
                    if (success) {
                        state.paintedPixels += pixelBatch.pixels.length;
                        state.currentCharges -= pixelBatch.pixels.length;
                        pixelBatch.pixels = [];
                    } else {
                        state.stopFlag = true;
                        break outerLoop;
                    }
                }

                updateUI("paintingProgress", "default", { painted: state.paintedPixels, total: state.totalPixels });
                if (state.paintedPixels % 50 === 0) Utils.saveProgress();
                updateStats();

                while (state.currentCharges < state.cooldownChargeThreshold && !state.stopFlag) {
                    const { charges, cooldown } = await WPlaceService.getCharges();
                    state.currentCharges = Math.floor(charges);
                    state.cooldown = cooldown;
                    if (state.currentCharges >= state.cooldownChargeThreshold) break;
                    updateUI("noChargesThreshold", "warning", { time: Utils.formatTime(state.cooldown), threshold: state.cooldownChargeThreshold, current: state.currentCharges });
                    await Utils.sleep(state.cooldown);
                }
            }
        }
    } finally {
        if (state.stopFlag) {
            updateUI("paintingStopped", "warning");
            Utils.saveProgress();
        } else {
            updateUI("paintingComplete", "success", { count: state.paintedPixels });
            Utils.clearProgress();
            overlayManager.clear();
        }
        updateStats();
    }
}
