import { Utils } from '../utils';
import { updateUI } from '../components/ui';

export let turnstileToken = null
let tokenExpiryTime = 0
let tokenGenerationInProgress = false
let _resolveToken = null
let tokenPromise = new Promise((resolve) => { _resolveToken = resolve })
let retryCount = 0
const MAX_RETRIES = 10
const MAX_BATCH_RETRIES = 10 // Maximum attempts for batch sending
const TOKEN_LIFETIME = 240000 // 4 minutes (tokens typically last 5 min, use 4 for safety)

export function setTurnstileToken(t) {
    if (_resolveToken) {
        _resolveToken(t)
        _resolveToken = null
    }
    turnstileToken = t
    tokenExpiryTime = Date.now() + TOKEN_LIFETIME
    retryCount = 0 // Reset retry count on successful token
}

export function isTokenValid() {
    return turnstileToken && Date.now() < tokenExpiryTime
}

export async function ensureToken() {
    // Return cached token if still valid
    if (isTokenValid()) {
        return turnstileToken;
    }

    // Avoid multiple simultaneous token generations
    if (tokenGenerationInProgress) {
        console.log("🔄 Token generation already in progress, waiting...");
        await Utils.sleep(2000);
        return isTokenValid() ? turnstileToken : null;
    }

    tokenGenerationInProgress = true;

    try {
        console.log("🔄 Token expired or missing, generating new one...");
        const token = await handleCaptchaWithRetry();
        if (token) {
            setTurnstileToken(token);
            console.log("✅ Token generated successfully");
            return token;
        }
    } catch (error) {
        console.error("❌ Token generation failed after retries:", error);
        updateUI("captchaNeeded", "error");
        Utils.showAlert(Utils.t("captchaNeeded"), "error");
    } finally {
        tokenGenerationInProgress = false;
    }

    return null;
}

async function handleCaptchaWithRetry() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const token = await handleCaptcha();
            if (token && token.length > 20) {
                return token;
            }
            throw new Error("Invalid token received");
        } catch (error) {
            console.warn(`❌ Token generation attempt ${attempt}/${MAX_RETRIES} failed:`, error);

            if (attempt < MAX_RETRIES) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // Exponential backoff, max 8s
                console.log(`⏳ Retrying in ${delay}ms...`);
                await Utils.sleep(delay);
            } else {
                throw error;
            }
        }
    }
}

async function handleCaptcha() {
    const startTime = performance.now();
    try {
        // Use optimized token generation with automatic sitekey detection
        const sitekey = Utils.detectSitekey();
        console.log("🔑 Generating Turnstile token for sitekey:", sitekey);
        console.log('🧭 UA:', navigator.userAgent, 'Platform:', navigator.platform);

        const token = await Utils.generatePaintToken(sitekey);

        if (token && token.length > 20) {
            const duration = Math.round(performance.now() - startTime);
            console.log(`✅ Turnstile token generated successfully in ${duration}ms`);
            return token;
        } else {
            throw new Error("Invalid or empty token received");
        }
    } catch (error) {
        const duration = Math.round(performance.now() - startTime);
        console.error(`❌ Turnstile token generation failed after ${duration}ms:`, error);

        // Fallback to original browser automation if Turnstile fails
        console.log("🔄 Falling back to browser automation...");
        const fbToken = await handleCaptchaFallback();
        return fbToken;
    }
}

// Keep original method as fallback
async function handleCaptchaFallback() {
    return new Promise(async (resolve, reject) => {
        try {
            // Ensure we have a fresh promise to await for a new token capture
            if (!_resolveToken) {
                tokenPromise = new Promise((res) => { _resolveToken = res; });
            }
            const timeoutPromise = Utils.sleep(20000).then(() => reject(new Error("Auto-CAPTCHA timed out.")));

            const solvePromise = (async () => {
                const mainPaintBtn = await Utils.waitForSelector('button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl', 200, 10000);
                if (!mainPaintBtn) throw new Error("Could not find the main paint button.");
                mainPaintBtn.click();
                await Utils.sleep(500);

                const transBtn = await Utils.waitForSelector('button#color-0', 200, 5000);
                if (!transBtn) throw new Error("Could not find the transparent color button.");
                transBtn.click();
                await Utils.sleep(500);

                const canvas = await Utils.waitForSelector('canvas', 200, 5000);
                if (!canvas) throw new Error("Could not find the canvas element.");

                canvas.setAttribute('tabindex', '0');
                canvas.focus();
                const rect = canvas.getBoundingClientRect();
                const centerX = Math.round(rect.left + rect.width / 2);
                const centerY = Math.round(rect.top + rect.height / 2);

                canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: centerX, clientY: centerY, bubbles: true }));
                canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
                await Utils.sleep(50);
                canvas.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));
                await Utils.sleep(500);

                // 800ms delay before sending confirmation
                await Utils.sleep(800);

                // Keep confirming until token is captured
                const confirmLoop = async () => {
                    while (!turnstileToken) {
                        let confirmBtn = await Utils.waitForSelector('button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl');
                        if (!confirmBtn) {
                            const allPrimary = Array.from(document.querySelectorAll('button.btn-primary'));
                            confirmBtn = allPrimary.length ? allPrimary[allPrimary.length - 1] : null;
                        }
                        if (confirmBtn) {
                            confirmBtn.click();
                        }
                        await Utils.sleep(500); // 500ms delay between confirmation attempts
                    }
                };

                // Start confirmation loop and wait for token
                confirmLoop();
                const token = await tokenPromise;
                await Utils.sleep(300); // small delay after token is captured
                resolve(token);
            })();

            await Promise.race([solvePromise, timeoutPromise]);

        } catch (error) {
            console.error("Auto-CAPTCHA process failed:", error);
            reject(error);
        }
    });
}
