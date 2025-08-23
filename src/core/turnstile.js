import { Utils } from '../utils';
import { updateUI } from '../components/ui';

let turnstileToken = null;
let tokenExpiryTime = 0;
let tokenGenerationInProgress = false;
let _resolveToken = null;
let tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
let retryCount = 0;
const MAX_RETRIES = 10;
const TOKEN_LIFETIME = 240000; // 4 minutes

// --- Start of functions moved from utils.js ---

let turnstileLoaded = false;
let _turnstileContainer = null;
let _turnstileWidgetId = null;
let _lastSitekey = null;
let _turnstileOverlay = null;

async function loadTurnstile() {
    if (window.turnstile) {
        turnstileLoaded = true;
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
            const checkReady = () => {
                if (window.turnstile) {
                    turnstileLoaded = true;
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            return checkReady();
        }
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            turnstileLoaded = true;
            console.log("✅ Turnstile script loaded successfully");
            resolve();
        };
        script.onerror = () => {
            console.error("❌ Failed to load Turnstile script");
            reject(new Error('Failed to load Turnstile'));
        };
        document.head.appendChild(script);
    });
}

function ensureTurnstileContainer() {
    if (!_turnstileContainer || !document.body.contains(_turnstileContainer)) {
        if (_turnstileContainer) {
            _turnstileContainer.remove();
        }
        _turnstileContainer = document.createElement('div');
        _turnstileContainer.style.cssText = `
      position: fixed !important; left: -9999px !important; top: -9999px !important;
      width: 300px !important; height: 65px !important; pointer-events: none !important;
      opacity: 0 !important; z-index: -1 !important;`;
        _turnstileContainer.setAttribute('aria-hidden', 'true');
        _turnstileContainer.id = 'turnstile-widget-container';
        document.body.appendChild(_turnstileContainer);
    }
    return _turnstileContainer;
}

function ensureTurnstileOverlayContainer() {
    if (_turnstileOverlay && document.body.contains(_turnstileOverlay)) {
        return _turnstileOverlay;
    }
    _turnstileOverlay = Utils.createElement('div', { id: 'turnstile-overlay-container' }, [
        Utils.createElement('div', {}, 'Cloudflare Turnstile — please complete the check if shown'),
        Utils.createElement('div', { id: 'turnstile-overlay-host' }),
        Utils.createElement('button', { id: 'close-ts-overlay' }, 'Hide')
    ]);
    _turnstileOverlay.style.cssText = `
        position: fixed; right: 16px; bottom: 16px; width: 320px; min-height: 80px;
        background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px; padding: 12px; z-index: 100000; backdrop-filter: blur(6px);
        color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.4);`;
    _turnstileOverlay.querySelector('#close-ts-overlay').addEventListener('click', () => _turnstileOverlay.remove());
    document.body.appendChild(_turnstileOverlay);
    return _turnstileOverlay;
}

async function executeTurnstile(sitekey, action = 'paint') {
    await loadTurnstile();
    if (_turnstileWidgetId && _lastSitekey === sitekey && window.turnstile?.execute) {
        try {
            console.log("🔄 Reusing existing Turnstile widget...");
            const token = await Promise.race([
                window.turnstile.execute(_turnstileWidgetId, { action }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Execute timeout')), 15000))
            ]);
            if (token && token.length > 20) return token;
        } catch (err) {
            console.warn('🔄 Widget reuse failed, will create a fresh widget:', err.message);
        }
    }
    const invisible = await createNewTurnstileWidgetInvisible(sitekey, action);
    if (invisible && invisible.length > 20) return invisible;
    console.log('👀 Falling back to interactive Turnstile (visible).');
    return await createNewTurnstileWidgetInteractive(sitekey, action);
}

function createNewTurnstileWidgetInvisible(sitekey, action) {
    return new Promise((resolve) => {
        try {
            if (_turnstileWidgetId && window.turnstile?.remove) {
                try { window.turnstile.remove(_turnstileWidgetId); } catch { }
            }
            const container = ensureTurnstileContainer();
            container.innerHTML = '';
            const widgetId = window.turnstile.render(container, {
                sitekey, action, size: 'invisible', retry: 'auto', 'retry-interval': 8000,
                callback: (token) => resolve(token),
                'error-callback': () => resolve(null),
                'timeout-callback': () => resolve(null),
            });
            _turnstileWidgetId = widgetId;
            _lastSitekey = sitekey;
            if (!widgetId) return resolve(null);
            Promise.race([
                window.turnstile.execute(widgetId, { action }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Invisible execute timeout')), 12000))
            ]).then(resolve).catch(() => resolve(null));
        } catch (e) {
            console.warn('Invisible Turnstile failed:', e);
            resolve(null);
        }
    });
}

function createNewTurnstileWidgetInteractive(sitekey, action) {
    return new Promise((resolve, reject) => {
        try {
            if (_turnstileWidgetId && window.turnstile?.remove) {
                try { window.turnstile.remove(_turnstileWidgetId); } catch { }
            }
            const overlay = ensureTurnstileOverlayContainer();
            const host = overlay.querySelector('#turnstile-overlay-host');
            host.innerHTML = '';
            const timeoutId = setTimeout(() => {
                console.warn('⏰ Interactive Turnstile timed out');
                resolve(null);
            }, 120000);
            const widgetId = window.turnstile.render(host, {
                sitekey, action, size: 'normal', retry: 'auto', 'retry-interval': 8000,
                callback: (token) => {
                    clearTimeout(timeoutId);
                    try { overlay.remove(); } catch { }
                    resolve(token);
                },
                'error-callback': (error) => console.warn('🚨 Interactive Turnstile error:', error),
                'timeout-callback': () => console.warn('⏰ Turnstile timeout callback (interactive)'),
                'expired-callback': () => console.warn('⚠️ Interactive Turnstile token expired'),
            });
            _turnstileWidgetId = widgetId;
            _lastSitekey = sitekey;
            if (!widgetId) {
                clearTimeout(timeoutId);
                resolve(null);
            }
        } catch (error) {
            console.error('❌ Error creating interactive Turnstile widget:', error);
            reject(error);
        }
    });
}

function generatePaintToken(sitekey) {
    return executeTurnstile(sitekey, 'paint');
}

export function cleanupTurnstile() {
    if (_turnstileWidgetId && window.turnstile?.remove) {
        try { window.turnstile.remove(_turnstileWidgetId); } catch (e) { console.warn('Failed to cleanup Turnstile widget:', e); }
    }
    if (_turnstileContainer) _turnstileContainer.remove();
    if (_turnstileOverlay) _turnstileOverlay.remove();
    _turnstileWidgetId = null;
    _turnstileContainer = null;
    _turnstileOverlay = null;
    _lastSitekey = null;
}

// --- End of functions moved from utils.js ---

export function setTurnstileToken(t) {
    if (_resolveToken) {
        _resolveToken(t);
        _resolveToken = null;
    }
    turnstileToken = t;
    tokenExpiryTime = Date.now() + TOKEN_LIFETIME;
    retryCount = 0;
}

function isTokenValid() {
    return turnstileToken && Date.now() < tokenExpiryTime;
}

export async function ensureToken() {
    if (isTokenValid()) return turnstileToken;
    if (tokenGenerationInProgress) {
        await Utils.sleep(2000);
        return isTokenValid() ? turnstileToken : null;
    }
    tokenGenerationInProgress = true;
    try {
        const token = await handleCaptchaWithRetry();
        if (token) {
            setTurnstileToken(token);
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
            if (token && token.length > 20) return token;
            throw new Error("Invalid token received");
        } catch (error) {
            console.warn(`❌ Token generation attempt ${attempt}/${MAX_RETRIES} failed:`, error);
            if (attempt < MAX_RETRIES) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                await Utils.sleep(delay);
            } else {
                throw error;
            }
        }
    }
}

export async function handleCaptcha() {
    const startTime = performance.now();
    try {
        const sitekey = Utils.detectSitekey();
        const token = await generatePaintToken(sitekey);
        if (token && token.length > 20) {
            const duration = Math.round(performance.now() - startTime);
            console.log(`✅ Turnstile token generated successfully in ${duration}ms`);
            return token;
        } else {
            throw new Error("Invalid or empty token received");
        }
    } catch (error) {
        console.error(`❌ Turnstile token generation failed:`, error);
        return await handleCaptchaFallback();
    }
}

async function handleCaptchaFallback() {
    return new Promise(async (resolve, reject) => {
        try {
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
                await Utils.sleep(800);
                const confirmLoop = async () => {
                    while (!turnstileToken) {
                        let confirmBtn = await Utils.waitForSelector('button.btn.btn-primary.btn-lg, button.btn.primary.sm\\:btn-xl');
                        if (confirmBtn) confirmBtn.click();
                        await Utils.sleep(500);
                    }
                };
                confirmLoop();
                const token = await tokenPromise;
                await Utils.sleep(300);
                resolve(token);
            })();
            await Promise.race([solvePromise, timeoutPromise]);
        } catch (error) {
            console.error("Auto-CAPTCHA process failed:", error);
            reject(error);
        }
    });
}

export async function initializeTokenGenerator() {
    if (isTokenValid()) {
        updateUI("tokenReady", "success");
        return;
    }
    try {
        updateUI("initializingToken", "default");
        await loadTurnstile();
        const token = await handleCaptchaWithRetry();
        if (token) {
            setTurnstileToken(token);
            updateUI("tokenReady", "success");
            Utils.showAlert("🔑 Token generator ready!", "success");
        } else {
            updateUI("tokenRetryLater", "warning");
        }
    } catch (error) {
        console.warn("⚠️ Startup token generation failed:", error);
        updateUI("tokenRetryLater", "warning");
    }
}
