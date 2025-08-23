import { CONFIG } from '../config';

export const state = {
    running: false,
    imageLoaded: false,
    processing: false,
    totalPixels: 0,
    paintedPixels: 0,
    availableColors: [],
    activeColorPalette: [], // User-selected colors for conversion
    paintWhitePixels: true, // Default to ON
    currentCharges: 0,
    maxCharges: 1, // Default max charges
    cooldown: CONFIG.COOLDOWN_DEFAULT,
    imageData: null,
    stopFlag: false,
    colorsChecked: false,
    startPosition: null,
    selectingPosition: false,
    region: null,
    minimized: false,
    lastPosition: { x: 0, y: 0 },
    estimatedTime: 0,
    language: "en",
    paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT, // pixels per second
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    overlayOpacity: CONFIG.OVERLAY.OPACITY_DEFAULT,
    blueMarbleEnabled: CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT,
    ditheringEnabled: false,
    // Advanced color matching settings
    colorMatchingAlgorithm: 'lab', // 'lab' | 'legacy'
    enableChromaPenalty: true,
    chromaPenaltyWeight: 0.15,
    customTransparencyThreshold: CONFIG.TRANSPARENCY_THRESHOLD,
    customWhiteThreshold: CONFIG.WHITE_THRESHOLD,
    resizeSettings: null,
    originalImage: null,
    resizeIgnoreMask: null,
};
