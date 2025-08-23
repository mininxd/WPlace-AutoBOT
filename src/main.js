import { createUI } from './components/ui';
import { setTurnstileToken, initializeTokenGenerator } from './core/turnstile';
import { overlayManager } from './core/overlay';
import { Utils } from './utils';
import { state } from './core/state';

function inject(callback) {
    const script = document.createElement('script');
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
}

inject(() => {
    const fetchedBlobQueue = new Map();

    window.addEventListener('message', (event) => {
        const { source, blobID, blobData } = event.data;
        if (source === 'auto-image-overlay' && blobID && blobData) {
            const callback = fetchedBlobQueue.get(blobID);
            if (typeof callback === 'function') {
                callback(blobData);
            }
            fetchedBlobQueue.delete(blobID);
        }
    });

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = (args[0] instanceof Request) ? args[0].url : args[0];

        if (typeof url === "string") {
            if (url.includes("https://backend.wplace.live/s0/pixel/")) {
                try {
                    const payload = JSON.parse(args[1].body);
                    if (payload.t) {
                        console.log("✅ Turnstile Token Captured:", payload.t);
                        window.postMessage({ source: 'turnstile-capture', token: payload.t }, '*');
                    }
                } catch (_) { /* ignore */ }
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('image/png') && url.includes('.png')) {
                const cloned = response.clone();
                return new Promise(async (resolve) => {
                    const blobUUID = crypto.randomUUID();
                    const originalBlob = await cloned.blob();

                    fetchedBlobQueue.set(blobUUID, (processedBlob) => {
                        resolve(new Response(processedBlob, {
                            headers: cloned.headers,
                            status: cloned.status,
                            statusText: cloned.statusText
                        }));
                    });

                    window.postMessage({
                        source: 'auto-image-tile',
                        endpoint: url,
                        blobID: blobUUID,
                        blobData: originalBlob,
                    }, '*');
                });
            }
        }

        return response;
    };
});

window.addEventListener('message', (event) => {
    const { source, endpoint, blobID, blobData, token } = event.data;

    if (source === 'auto-image-tile' && endpoint && blobID && blobData) {
        overlayManager.processAndRespondToTileRequest(event.data);
    }

    if (source === 'turnstile-capture' && token) {
        setTurnstileToken(token);
        if (document.querySelector("#statusText")?.textContent.includes("CAPTCHA")) {
            Utils.showAlert("Token captured successfully! You can start the bot now.", "success");
            updateUI("colorsFound", "success", { count: state.availableColors.length });
        }
    }
});

async function main() {
    console.log("🚀 WPlace Auto-Image with Turnstile Generator loaded");
    console.log("🔑 Turnstile generator: ALWAYS ENABLED");
    console.log("🎯 Manual pixel captcha solving: DISABLED - fully automated!");
    createUI().then(() => {
        // Generate token automatically after UI is ready
        setTimeout(initializeTokenGenerator, 1000);

        // Attach advanced color matching listeners (resize dialog)
        const advancedInit = () => {
            const chromaSlider = document.getElementById('chromaPenaltyWeightSlider');
            const chromaValue = document.getElementById('chromaWeightValue');
            const resetBtn = document.getElementById('resetAdvancedColorBtn');
            const algoSelect = document.getElementById('colorAlgorithmSelect');
            const chromaToggle = document.getElementById('enableChromaPenaltyToggle');
            const transInput = document.getElementById('transparencyThresholdInput');
            const whiteInput = document.getElementById('whiteThresholdInput');
            const ditherToggle = document.getElementById('enableDitheringToggle');
            if (algoSelect) algoSelect.addEventListener('change', e => { state.colorMatchingAlgorithm = e.target.value; saveBotSettings(); _updateResizePreview(); });
            if (chromaToggle) chromaToggle.addEventListener('change', e => { state.enableChromaPenalty = e.target.checked; saveBotSettings(); _updateResizePreview(); });
            if (chromaSlider && chromaValue) chromaSlider.addEventListener('input', e => { state.chromaPenaltyWeight = parseFloat(e.target.value) || 0.15; chromaValue.textContent = state.chromaPenaltyWeight.toFixed(2); saveBotSettings(); _updateResizePreview(); });
            if (transInput) transInput.addEventListener('change', e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 0 && v <= 255) { state.customTransparencyThreshold = v; CONFIG.TRANSPARENCY_THRESHOLD = v; saveBotSettings(); _updateResizePreview(); } });
            if (whiteInput) whiteInput.addEventListener('change', e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 200 && v <= 255) { state.customWhiteThreshold = v; CONFIG.WHITE_THRESHOLD = v; saveBotSettings(); _updateResizePreview(); } });
            if (ditherToggle) ditherToggle.addEventListener('change', e => { state.ditheringEnabled = e.target.checked; saveBotSettings(); _updateResizePreview(); });
            if (resetBtn) resetBtn.addEventListener('click', () => {
                state.colorMatchingAlgorithm = 'lab'; state.enableChromaPenalty = true; state.chromaPenaltyWeight = 0.15; state.customTransparencyThreshold = CONFIG.TRANSPARENCY_THRESHOLD = 100; state.customWhiteThreshold = CONFIG.WHITE_THRESHOLD = 250; saveBotSettings(); const a = document.getElementById('colorAlgorithmSelect'); if (a) a.value = 'lab'; const ct = document.getElementById('enableChromaPenaltyToggle'); if (ct) ct.checked = true; if (chromaSlider) chromaSlider.value = 0.15; if (chromaValue) chromaValue.textContent = '0.15'; if (transInput) transInput.value = 100; if (whiteInput) whiteInput.value = 250; _updateResizePreview(); Utils.showAlert('Advanced color settings reset.', 'success');
            });
        };
        // Delay to ensure resize UI built
        setTimeout(advancedInit, 500);

        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            Utils.cleanupTurnstile();
        });
    })
}

main();
