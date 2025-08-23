import { CONFIG, TEXT } from '../config';
import { state } from '../core/state';
import { ImageProcessor } from '../lib/imageProcessor';

// UTILITY FUNCTIONS
export const Utils = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

    waitForSelector: async (selector, interval = 200, timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await Utils.sleep(interval);
        }
        return null;
    },

    // Turnstile Generator Integration - Optimized with widget reuse and proper cleanup
    turnstileLoaded: false,
    _turnstileContainer: null,
    _turnstileWidgetId: null,
    _lastSitekey: null,

    async loadTurnstile() {
        // If Turnstile is already present, just resolve.
        if (window.turnstile) {
            this.turnstileLoaded = true;
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Avoid adding the script twice
            if (document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
                const checkReady = () => {
                    if (window.turnstile) {
                        this.turnstileLoaded = true;
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
                this.turnstileLoaded = true;
                console.log("✅ Turnstile script loaded successfully");
                resolve();
            };
            script.onerror = () => {
                console.error("❌ Failed to load Turnstile script");
                reject(new Error('Failed to load Turnstile'));
            };
            document.head.appendChild(script);
        });
    },

    // Create or reuse the turnstile container
    ensureTurnstileContainer() {
        if (!this._turnstileContainer || !document.body.contains(this._turnstileContainer)) {
            // Clean up old container if it exists
            if (this._turnstileContainer) {
                this._turnstileContainer.remove();
            }

            this._turnstileContainer = document.createElement('div');
            this._turnstileContainer.style.cssText = `
          position: fixed !important;
          left: -9999px !important; /* keep off-screen for invisible mode */
          top: -9999px !important;
          width: 300px !important;
          height: 65px !important;
          pointer-events: none !important;
          opacity: 0 !important; /* do not use visibility:hidden to avoid engine quirks */
          z-index: -1 !important;
        `;
            this._turnstileContainer.setAttribute('aria-hidden', 'true');
            this._turnstileContainer.id = 'turnstile-widget-container';
            document.body.appendChild(this._turnstileContainer);
        }
        return this._turnstileContainer;
    },

    ensureTurnstileOverlayContainer() {
        if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
            return this._turnstileOverlay;
        }
        const overlay = document.createElement('div');
        overlay.id = 'turnstile-overlay-container';
        overlay.style.cssText = `
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: 320px;
        min-height: 80px;
        background: rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px;
        padding: 12px;
        z-index: 100000;
        backdrop-filter: blur(6px);
        color: #fff;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      `;
        const title = document.createElement('div');
        title.textContent = 'Cloudflare Turnstile — please complete the check if shown';
        title.style.cssText = 'font: 600 12px/1.3 \"Segoe UI\",sans-serif; margin-bottom: 8px; opacity: 0.9;';
        const widgetHost = document.createElement('div');
        widgetHost.id = 'turnstile-overlay-host';
        widgetHost.style.cssText = 'width: 100%; min-height: 70px;';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Hide';
        closeBtn.style.cssText = 'position:absolute; top:6px; right:6px; font-size:11px; background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:2px 6px; cursor:pointer;';
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.appendChild(title);
        overlay.appendChild(widgetHost);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        this._turnstileOverlay = overlay;
        return overlay;
    },

    async executeTurnstile(sitekey, action = 'paint') {
        await this.loadTurnstile();

        if (this._turnstileWidgetId && this._lastSitekey === sitekey && window.turnstile?.execute) {
            try {
                console.log("🔄 Reusing existing Turnstile widget...");
                const token = await Promise.race([
                    window.turnstile.execute(this._turnstileWidgetId, { action }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Execute timeout')), 15000))
                ]);
                if (token && token.length > 20) {
                    console.log("✅ Token generated via widget reuse");
                    return token;
                }
            } catch (err) {
                console.warn('🔄 Widget reuse failed, will create a fresh widget:', err.message);
            }
        }

        const invisible = await this.createNewTurnstileWidgetInvisible(sitekey, action);
        if (invisible && invisible.length > 20) return invisible;

        console.log('👀 Falling back to interactive Turnstile (visible).');
        return await this.createNewTurnstileWidgetInteractive(sitekey, action);
    },

    async createNewTurnstileWidgetInvisible(sitekey, action) {
        return new Promise((resolve) => {
            try {
                if (this._turnstileWidgetId && window.turnstile?.remove) {
                    try { window.turnstile.remove(this._turnstileWidgetId); } catch { }
                }
                const container = this.ensureTurnstileContainer();
                container.innerHTML = '';
                const widgetId = window.turnstile.render(container, {
                    sitekey,
                    action,
                    size: 'invisible',
                    retry: 'auto',
                    'retry-interval': 8000,
                    callback: (token) => {
                        console.log('✅ Invisible Turnstile callback');
                        resolve(token);
                    },
                    'error-callback': () => resolve(null),
                    'timeout-callback': () => resolve(null),
                });
                this._turnstileWidgetId = widgetId;
                this._lastSitekey = sitekey;
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
    },

    async createNewTurnstileWidgetInteractive(sitekey, action) {
        return new Promise((resolve, reject) => {
            try {
                if (this._turnstileWidgetId && window.turnstile?.remove) {
                    try { window.turnstile.remove(this._turnstileWidgetId); } catch { }
                }

                const overlay = this.ensureTurnstileOverlayContainer();
                const host = overlay.querySelector('#turnstile-overlay-host');
                host.innerHTML = '';

                const timeoutId = setTimeout(() => {
                    console.warn('⏰ Interactive Turnstile timed out');
                    resolve(null);
                }, 120000); // give users up to 2 minutes

                const widgetId = window.turnstile.render(host, {
                    sitekey,
                    action,
                    size: 'normal',
                    retry: 'auto',
                    'retry-interval': 8000,
                    callback: (token) => {
                        clearTimeout(timeoutId);
                        // Hide overlay after success
                        try { overlay.remove(); } catch { }
                        console.log('✅ Interactive Turnstile solved');
                        resolve(token);
                    },
                    'error-callback': (error) => {
                        console.warn('🚨 Interactive Turnstile error:', error);
                    },
                    'timeout-callback': () => {
                        console.warn('⏰ Turnstile timeout callback (interactive)');
                    },
                    'expired-callback': () => {
                        console.warn('⚠️ Interactive Turnstile token expired');
                    }
                });

                this._turnstileWidgetId = widgetId;
                this._lastSitekey = sitekey;
                if (!widgetId) {
                    clearTimeout(timeoutId);
                    resolve(null);
                    return;
                }
            } catch (error) {
                console.error('❌ Error creating interactive Turnstile widget:', error);
                reject(error);
            }
        });
    },

    async generatePaintToken(sitekey) {
        return this.executeTurnstile(sitekey, 'paint');
    },

    // Cleanup method for when the script is disabled/reloaded
    cleanupTurnstile() {
        if (this._turnstileWidgetId && window.turnstile?.remove) {
            try {
                window.turnstile.remove(this._turnstileWidgetId);
            } catch (e) {
                console.warn('Failed to cleanup Turnstile widget:', e);
            }
        }

        if (this._turnstileContainer && document.body.contains(this._turnstileContainer)) {
            this._turnstileContainer.remove();
        }
        if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
            this._turnstileOverlay.remove();
        }

        this._turnstileWidgetId = null;
        this._turnstileContainer = null;
        this._turnstileOverlay = null;
        this._lastSitekey = null;
    },

    detectSitekey(fallback = '0x4AAAAAABpqJe8FO0N84q0F') {
        // Cache sitekey to avoid repeated DOM queries
        if (this._cachedSitekey) {
            return this._cachedSitekey;
        }

        try {
            // Try to find sitekey in data attributes
            const sitekeySel = document.querySelector('[data-sitekey]');
            if (sitekeySel) {
                const sitekey = sitekeySel.getAttribute('data-sitekey');
                if (sitekey && sitekey.length > 10) {
                    this._cachedSitekey = sitekey;
                    console.log("🔍 Sitekey detected from data attribute:", sitekey);
                    return sitekey;
                }
            }

            // Try turnstile element
            const turnstileEl = document.querySelector('.cf-turnstile');
            if (turnstileEl?.dataset?.sitekey && turnstileEl.dataset.sitekey.length > 10) {
                this._cachedSitekey = turnstileEl.dataset.sitekey;
                console.log("🔍 Sitekey detected from turnstile element:", this._cachedSitekey);
                return this._cachedSitekey;
            }

            // Try global variable
            if (typeof window !== 'undefined' && window.__TURNSTILE_SITEKEY && window.__TURNSTILE_SITEKEY.length > 10) {
                this._cachedSitekey = window.__TURNSTILE_SITEKEY;
                console.log("🔍 Sitekey detected from global variable:", this._cachedSitekey);
                return this._cachedSitekey;
            }

            // Try script tags for inline sitekey
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const content = script.textContent || script.innerHTML;
                const sitekeyMatch = content.match(/sitekey['":\s]+(['"0-9a-zA-Z_-]{20,})/i);
                if (sitekeyMatch && sitekeyMatch[1] && sitekeyMatch[1].length > 10) {
                    this._cachedSitekey = sitekeyMatch[1].replace(/['"]/g, '');
                    console.log("🔍 Sitekey detected from script content:", this._cachedSitekey);
                    return this._cachedSitekey;
                }
            }
        } catch (error) {
            console.warn('Error detecting sitekey:', error);
        }

        console.log("🔍 Using fallback sitekey:", fallback);
        this._cachedSitekey = fallback;
        return fallback;
    },

    createElement: (tag, props = {}, children = []) => {
        const element = document.createElement(tag)

        Object.entries(props).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value)
            } else if (key === 'className') {
                element.className = value
            } else if (key === 'innerHTML') {
                element.innerHTML = value
            } else {
                element.setAttribute(key, value)
            }
        })

        if (typeof children === 'string') {
            element.textContent = children
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child))
                } else {
                    element.appendChild(child)
                }
            })
        }

        return element
    },

    createButton: (id, text, icon, onClick, style = CONFIG.CSS_CLASSES.BUTTON_PRIMARY) => {
        const button = Utils.createElement('button', {
            id: id,
            style: style,
            innerHTML: `${icon ? `<i class="${icon}"></i>` : ''}<span>${text}</span>`
        })
        if (onClick) button.addEventListener('click', onClick)
        return button
    },

    t: (key, params = {}) => {
        let text = TEXT[state.language]?.[key] || TEXT.en[key] || key
        Object.keys(params).forEach((param) => {
            text = text.replace(`{${param}}`, params[param])
        })
        return text
    },

    showAlert: (message, type = "info") => {
        const alertDiv = document.createElement("div")
        alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
        font-family: 'Segoe UI', sans-serif;
      `

        const colors = {
            info: "background: linear-gradient(135deg, #3498db, #2980b9);",
            success: "background: linear-gradient(135deg, #27ae60, #229954);",
            warning: "background: linear-gradient(135deg, #f39c12, #e67e22);",
            error: "background: linear-gradient(135deg, #e74c3c, #c0392b);",
        }

        alertDiv.style.cssText += colors[type] || colors.info

        const style = document.createElement("style")
        style.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `
        document.head.appendChild(style)

        alertDiv.textContent = message
        document.body.appendChild(alertDiv)

        setTimeout(() => {
            alertDiv.style.animation = "slideDown 0.3s ease-out reverse"
            setTimeout(() => {
                document.body.removeChild(alertDiv)
                document.head.removeChild(style)
            }, 300)
        }, 4000)
    },

    colorDistance: (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)),
    _labCache: new Map(), // key: (r<<16)|(g<<8)|b  value: [L,a,b]
    _rgbToLab: (r, g, b) => {
        // sRGB -> linear
        const srgbToLinear = (v) => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const rl = srgbToLinear(r);
        const gl = srgbToLinear(g);
        const bl = srgbToLinear(b);
        let X = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
        let Y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
        let Z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
        X /= 0.95047;
        Y /= 1.00000;
        Z /= 1.08883;
        const f = (t) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116);
        const fX = f(X), fY = f(Y), fZ = f(Z);
        const L = 116 * fY - 16;
        const a = 500 * (fX - fY);
        const b2 = 200 * (fY - fZ);
        return [L, a, b2];
    },
    _lab: (r, g, b) => {
        const key = (r << 16) | (g << 8) | b;
        let v = Utils._labCache.get(key);
        if (!v) {
            v = Utils._rgbToLab(r, g, b);
            Utils._labCache.set(key, v);
        }
        return v;
    },
    findClosestPaletteColor: (r, g, b, palette) => {
        // Use provided palette or derive from COLOR_MAP
        if (!palette || palette.length === 0) {
            palette = Object.values(CONFIG.COLOR_MAP)
                .filter(c => c.rgb)
                .map(c => [c.rgb.r, c.rgb.g, c.rgb.b]);
        }
        if (state.colorMatchingAlgorithm === 'legacy') {
            let menorDist = Infinity;
            let cor = [0, 0, 0];
            for (let i = 0; i < palette.length; i++) {
                const [pr, pg, pb] = palette[i];
                const rmean = (pr + r) / 2;
                const rdiff = pr - r;
                const gdiff = pg - g;
                const bdiff = pb - b;
                const dist = Math.sqrt(((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8));
                if (dist < menorDist) {
                    menorDist = dist;
                    cor = [pr, pg, pb];
                }
            }
            return cor;
        }
        // LAB algorithm
        const [Lt, at, bt] = Utils._lab(r, g, b);
        const targetChroma = Math.sqrt(at * at + bt * bt);
        let best = null;
        let bestDist = Infinity;
        for (let i = 0; i < palette.length; i++) {
            const [pr, pg, pb] = palette[i];
            const [Lp, ap, bp] = Utils._lab(pr, pg, pb);
            const dL = Lt - Lp;
            const da = at - ap;
            const db = bt - bp;
            let dist = dL * dL + da * da + db * db;
            if (state.enableChromaPenalty && targetChroma > 20) {
                const candChroma = Math.sqrt(ap * ap + bp * bp);
                if (candChroma < targetChroma) {
                    const chromaDiff = targetChroma - candChroma;
                    dist += chromaDiff * chromaDiff * state.chromaPenaltyWeight;
                }
            }
            if (dist < bestDist) {
                bestDist = dist;
                best = palette[i];
                if (bestDist === 0) break;
            }
        }
        return best || [0, 0, 0];
    },

    isWhitePixel: (r, g, b) => {
        const wt = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
        return r >= wt && g >= wt && b >= wt;
    },

    createImageUploader: () =>
        new Promise((resolve) => {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = "image/png,image/jpeg"
            input.onchange = () => {
                const fr = new FileReader()
                fr.onload = () => resolve(fr.result)
                fr.readAsDataURL(input.files[0])
            }
            input.click()
        }),

    createFileDownloader: (data, filename) => {
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    },

    createFileUploader: () =>
        new Promise((resolve, reject) => {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".json"
            input.onchange = (e) => {
                const file = e.target.files[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = () => {
                        try {
                            const data = JSON.parse(reader.result)
                            resolve(data)
                        } catch (error) {
                            reject(new Error("Invalid JSON file"))
                        }
                    }
                    reader.onerror = () => reject(new Error("File reading error"))
                    reader.readAsText(file)
                } else {
                    reject(new Error("No file selected"))
                }
            }
            input.click()
        }),

    extractAvailableColors: () => {
        const colorElements = document.querySelectorAll('[id^="color-"]')

        // Separate available and unavailable colors
        const availableColors = []
        const unavailableColors = []

        Array.from(colorElements).forEach((el) => {
            const id = Number.parseInt(el.id.replace("color-", ""))
            if (id === 0) return // Skip transparent color

            const rgbStr = el.style.backgroundColor.match(/\d+/g)
            const rgb = rgbStr ? rgbStr.map(Number) : [0, 0, 0]

            // Find color name from COLOR_MAP
            const colorInfo = Object.values(CONFIG.COLOR_MAP).find(color => color.id === id)
            const name = colorInfo ? colorInfo.name : `Unknown Color ${id}`

            const colorData = { id, name, rgb }

            // Check if color is available (no SVG overlay means available)
            if (!el.querySelector("svg")) {
                availableColors.push(colorData)
            } else {
                unavailableColors.push(colorData)
            }
        })

        // Console log detailed color information
        console.log("=== CAPTURED COLORS STATUS ===")
        console.log(`Total available colors: ${availableColors.length}`)
        console.log(`Total unavailable colors: ${unavailableColors.length}`)
        console.log(`Total colors scanned: ${availableColors.length + unavailableColors.length}`)

        if (availableColors.length > 0) {
            console.log("\n--- AVAILABLE COLORS ---")
            availableColors.forEach((color, index) => {
                console.log(`${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`)
            })
        }

        if (unavailableColors.length > 0) {
            console.log("\n--- UNAVAILABLE COLORS ---")
            unavailableColors.forEach((color, index) => {
                console.log(`${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}) [LOCKED]`)
            })
        }

        console.log("=== END COLOR STATUS ===")

        return availableColors
    },

    formatTime: (ms) => {
        const seconds = Math.floor((ms / 1000) % 60)
        const minutes = Math.floor((ms / (1000 * 60)) % 60)
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
        const days = Math.floor(ms / (1000 * 60 * 60 * 24))

        let result = ""
        if (days > 0) result += `${days}d `
        if (hours > 0 || days > 0) result += `${hours}h `
        if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `
        result += `${seconds}s`

        return result
    },

    calculateEstimatedTime: (remainingPixels, charges, cooldown) => {
        if (remainingPixels <= 0) return 0

        const paintingSpeedDelay = state.paintingSpeed > 0 ? (1000 / state.paintingSpeed) : 1000
        const timeFromSpeed = remainingPixels * paintingSpeedDelay

        const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1))
        const timeFromCharges = cyclesNeeded * cooldown

        return Math.max(timeFromSpeed, timeFromCharges)
    },

    // --- Painted map packing helpers (compact, efficient storage) ---
    packPaintedMapToBase64: (paintedMap, width, height) => {
        if (!paintedMap || !width || !height) return null;
        const totalBits = width * height;
        const byteLen = Math.ceil(totalBits / 8);
        const bytes = new Uint8Array(byteLen);
        let bitIndex = 0;
        for (let y = 0; y < height; y++) {
            const row = paintedMap[y];
            for (let x = 0; x < width; x++) {
                const bit = row && row[x] ? 1 : 0;
                const b = bitIndex >> 3; // byte index
                const o = bitIndex & 7;  // bit offset
                if (bit) bytes[b] |= (1 << o);
                bitIndex++;
            }
        }
        let binary = "";
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
        }
        return btoa(binary);
    },

    unpackPaintedMapFromBase64: (base64, width, height) => {
        if (!base64 || !width || !height) return null;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const map = Array(height).fill().map(() => Array(width).fill(false));
        let bitIndex = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const b = bitIndex >> 3;
                const o = bitIndex & 7;
                map[y][x] = ((bytes[b] >> o) & 1) === 1;
                bitIndex++;
            }
        }
        return map;
    },

    migrateProgressToV2: (saved) => {
        if (!saved) return saved;
        const isV1 = !saved.version || saved.version === '1' || saved.version === '1.0' || saved.version === '1.1';
        if (!isV1) return saved;

        try {
            const migrated = { ...saved };
            const width = migrated.imageData?.width;
            const height = migrated.imageData?.height;
            if (migrated.paintedMap && width && height) {
                const data = Utils.packPaintedMapToBase64(migrated.paintedMap, width, height);
                migrated.paintedMapPacked = { width, height, data };
            }
            delete migrated.paintedMap;
            migrated.version = '2';
            return migrated;
        } catch (e) {
            console.warn('Migration to v2 failed, using original data:', e);
            return saved;
        }
    },

    migrateProgressToV21: (saved) => {
        if (!saved) return saved;
        if (saved.version === '2.1') return saved;
        const isV2 = saved.version === '2' || saved.version === '2.0';
        const isV1 = !saved.version || saved.version === '1' || saved.version === '1.0' || saved.version === '1.1';
        if (!isV2 && !isV1) return saved; // save this for future
        try {
            const migrated = { ...saved };
            delete migrated.paintedMapPacked;
            delete migrated.paintedMap;
            migrated.version = '2.1';
            return migrated;
        } catch (e) {
            console.warn('Migration to v2.1 failed, using original data:', e);
            return saved;
        }
    },

    saveProgress: () => {
        try {
            const progressData = {
                timestamp: Date.now(),
                version: "2.1",
                state: {
                    totalPixels: state.totalPixels,
                    paintedPixels: state.paintedPixels,
                    lastPosition: state.lastPosition,
                    startPosition: state.startPosition,
                    region: state.region,
                    imageLoaded: state.imageLoaded,
                    colorsChecked: state.colorsChecked,
                    availableColors: state.availableColors,
                },
                imageData: state.imageData
                    ? {
                        width: state.imageData.width,
                        height: state.imageData.height,
                        pixels: Array.from(state.imageData.pixels),
                        totalPixels: state.imageData.totalPixels,
                    }
                    : null,
                paintedMapPacked: null,
            }

            localStorage.setItem("wplace-bot-progress", JSON.stringify(progressData))
            return true
        } catch (error) {
            console.error("Error saving progress:", error)
            return false
        }
    },

    loadProgress: () => {
        try {
            const saved = localStorage.getItem("wplace-bot-progress")
            if (!saved) return null;
            let data = JSON.parse(saved);
            const ver = data.version;
            let migrated = data;
            if (ver === '2.1') {
                // already latest
            } else if (ver === '2' || ver === '2.0') {
                migrated = Utils.migrateProgressToV21(data);
            } else {
                migrated = Utils.migrateProgressToV21(data);
            }
            if (migrated && migrated !== data) {
                try { localStorage.setItem("wplace-bot-progress", JSON.stringify(migrated)); } catch { }
                data = migrated;
            }
            return data;
        } catch (error) {
            console.error("Error loading progress:", error)
            return null
        }
    },

    clearProgress: () => {
        try {
            localStorage.removeItem("wplace-bot-progress")
            return true
        } catch (error) {
            console.error("Error clearing progress:", error)
            return false
        }
    },

    restoreProgress: (savedData) => {
        try {
            Object.assign(state, savedData.state)

            if (savedData.imageData) {
                state.imageData = {
                    ...savedData.imageData,
                    pixels: new Uint8ClampedArray(savedData.imageData.pixels),
                }

                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = state.imageData.width;
                    canvas.height = state.imageData.height;
                    const ctx = canvas.getContext('2d');
                    const imageData = new ImageData(state.imageData.pixels, state.imageData.width, state.imageData.height);
                    ctx.putImageData(imageData, 0, 0);
                    const proc = new ImageProcessor('');
                    proc.img = canvas;
                    proc.canvas = canvas;
                    proc.ctx = ctx;
                    state.imageData.processor = proc;
                } catch (e) {
                    console.warn('Could not rebuild processor from saved image data:', e);
                }
            }

            // Prefer packed form if available; fallback to legacy paintedMap array for backward compatibility
            if (savedData.paintedMapPacked && savedData.paintedMapPacked.data) {
                const { width, height, data } = savedData.paintedMapPacked;
                state.paintedMap = Utils.unpackPaintedMapFromBase64(data, width, height);
            } else if (savedData.paintedMap) {
                state.paintedMap = savedData.paintedMap.map((row) => Array.from(row))
            }

            return true
        } catch (error) {
            console.error("Error restoring progress:", error)
            return false
        }
    },

    saveProgressToFile: () => {
        try {
            const progressData = {
                timestamp: Date.now(),
                version: "2.1",
                state: {
                    totalPixels: state.totalPixels,
                    paintedPixels: state.paintedPixels,
                    lastPosition: state.lastPosition,
                    startPosition: state.startPosition,
                    region: state.region,
                    imageLoaded: state.imageLoaded,
                    colorsChecked: state.colorsChecked,
                    availableColors: state.availableColors,
                },
                imageData: state.imageData
                    ? {
                        width: state.imageData.width,
                        height: state.imageData.height,
                        pixels: Array.from(state.imageData.pixels),
                        totalPixels: state.imageData.totalPixels,
                    }
                    : null,
                paintedMapPacked: null,
            }

            const filename = `wplace-bot-progress-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
            Utils.createFileDownloader(JSON.stringify(progressData, null, 2), filename)
            return true
        } catch (error) {
            console.error("Error saving to file:", error)
            return false
        }
    },

    loadProgressFromFile: async () => {
        try {
            const data = await Utils.createFileUploader()
            if (!data || !data.state) {
                throw new Error("Invalid file format")
            }
            const ver = data.version;
            let migrated = data;
            if (ver === '2.1') {
            } else if (ver === '2' || ver === '2.0') {
                migrated = Utils.migrateProgressToV21(data) || data;
            } else {
                migrated = Utils.migrateProgressToV21(data) || data;
            }
            const success = Utils.restoreProgress(migrated)
            return success
        } catch (error) {
            console.error("Error loading from file:", error)
            throw error
        }
    },

    // Helper function to restore overlay from loaded data
    restoreOverlayFromData: async () => {
        if (!state.imageLoaded || !state.imageData || !state.startPosition || !state.region) {
            return false;
        }

        try {
            // Recreate ImageBitmap from loaded pixel data
            const imageData = new ImageData(
                state.imageData.pixels,
                state.imageData.width,
                state.imageData.height
            );

            const canvas = new OffscreenCanvas(state.imageData.width, state.imageData.height);
            const ctx = canvas.getContext('2d');
            ctx.putImageData(imageData, 0, 0);
            const imageBitmap = await canvas.transferToImageBitmap();

            // Set up overlay with restored data
            await overlayManager.setImage(imageBitmap);
            await overlayManager.setPosition(state.startPosition, state.region);
            overlayManager.enable();

            // Update overlay button state
            const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
            if (toggleOverlayBtn) {
                toggleOverlayBtn.disabled = false;
                toggleOverlayBtn.classList.add('active');
            }

            console.log('Overlay restored from data');
            return true;
        } catch (error) {
            console.error('Failed to restore overlay from data:', error);
            return false;
        }
    },
}
