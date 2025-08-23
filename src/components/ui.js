import { CONFIG, TEXT, getCurrentTheme, switchTheme, loadThemePreference, loadLanguagePreference, saveThemePreference } from '../config';
import { state } from '../core/state';
import { Utils } from '../utils';
import { WPlaceService } from '../core/api';
import { ImageProcessor } from '../lib/imageProcessor';
import { processImage } from '../core/painter';
import { ensureToken } from '../core/turnstile';
import { overlayManager } from '../core/overlay';

let _updateResizePreview = () => { };

export let updateUI = () => { }
export let updateStats = () => { }
export let updateDataButtons = () => { }

export async function createUI() {
    await Utils.detectLanguage()

    const existingContainer = document.getElementById("wplace-image-bot-container")
    const existingStats = document.getElementById("wplace-stats-container")
    const existingSettings = document.getElementById("wplace-settings-container")
    const existingResizeContainer = document.querySelector(".resize-container")
    const existingResizeOverlay = document.querySelector(".resize-overlay")

    if (existingContainer) existingContainer.remove()
    if (existingStats) existingStats.remove()
    if (existingSettings) existingSettings.remove()
    if (existingResizeContainer) existingResizeContainer.remove()
    if (existingResizeOverlay) existingResizeOverlay.remove()

    loadThemePreference()
    loadLanguagePreference()

    const theme = getCurrentTheme()

    const fontAwesome = document.createElement("link")
    fontAwesome.rel = "stylesheet"
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    document.head.appendChild(fontAwesome)

    if (theme.fontFamily.includes("Press Start 2P")) {
        const googleFonts = document.createElement("link")
        googleFonts.rel = "stylesheet"
        googleFonts.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        document.head.appendChild(googleFonts)
    }

    const style = document.createElement("style")
    style.setAttribute("data-wplace-theme", "true")

    style.textContent = `
      ${theme.animations.glow
            ? `
      @keyframes neonGlow {
        0%, 100% {
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
        }
        50% {
          text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor;
        }
      }`
            : ""
        }

      ${theme.animations.pixelBlink
            ? `
      @keyframes pixelBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.7; }
      }`
            : ""
        }

      ${theme.animations.scanline
            ? `
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400px); }
      }`
            : ""
        }

      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
      }
      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      #wplace-image-bot-container {
        position: fixed;
        top: 20px;
        left: 20px;
        width: ${CONFIG.currentTheme === "Neon Retro" ? "280px" : "280px"};
        max-height: calc(100vh - 40px);
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)`
            : theme.primary
        };
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius};
        padding: 0;
        box-shadow: ${theme.boxShadow};
        z-index: 9998;
        font-family: ${theme.fontFamily};
        color: ${theme.text};
        animation: slideIn 0.4s ease-out;
        overflow-y: auto; /* Allow scrolling for main panel */
        overflow-x: hidden;
        ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }

      ${theme.animations.scanline
            ? `
      #wplace-image-bot-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${theme.neon}, transparent);
        animation: scanline 3s linear infinite;
        z-index: 1;
        pointer-events: none;
      }`
            : ""
        }

      ${CONFIG.currentTheme === "Neon Retro"
            ? `
      #wplace-image-bot-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.03) 2px,
            rgba(0, 255, 65, 0.03) 4px
          );
        pointer-events: none;
        z-index: 1;
      }`
            : ""
        }

      #wplace-image-bot-container.wplace-dragging {
        transition: none;
        box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.2);
        transform: scale(1.02);
        z-index: 9999;
      }
      #wplace-image-bot-container.wplace-minimized {
        width: 200px;
        height: auto;
        overflow: hidden;
      }
      #wplace-image-bot-container.wplace-compact {
        width: 240px;
      }

      /* Stats Container */
      #wplace-stats-container {
        position: fixed;
        top: 20px;
        left: 330px;
        width: ${CONFIG.currentTheme === "Neon Retro" ? "280px" : "280px"};
        max-height: calc(100vh - 40px);
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)`
            : theme.primary
        };
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius};
        padding: 0;
        box-shadow: ${theme.boxShadow};
        z-index: 9997;
        font-family: ${theme.fontFamily};
        color: ${theme.text};
        animation: slideIn 0.4s ease-out;
        overflow-y: auto; /* Make stats panel scrollable */
        ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }

      /* FIX: Disable transition during drag to prevent lag */
      #wplace-stats-container.wplace-dragging {
        transition: none;
      }

      .wplace-header {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "8px 12px" : "8px 12px"};
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.secondary} 0%, #2a2a2a 100%)`
            : theme.secondary
        };
        color: ${theme.highlight};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "11px" : "13px"};
        font-weight: ${CONFIG.currentTheme === "Neon Retro" ? "normal" : "700"};
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        border-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "2px" : "1px"} solid ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.text};
        ${CONFIG.currentTheme === "Classic Autobot" ? "text-shadow: 0 1px 2px rgba(0,0,0,0.5);" : "text-transform: uppercase; letter-spacing: 1px;"}
        transition: background 0.2s ease;
        position: relative;
        z-index: 2;
        ${theme.animations.glow ? "animation: neonGlow 2s ease-in-out infinite alternate;" : ""}
      }

      .wplace-header-title {
        display: flex;
        align-items: center;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "6px" : "6px"};
      }

      .wplace-header-controls {
        display: flex;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "6px" : "6px"};
      }

      .wplace-header-btn {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.accent};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "none"};
        color: ${theme.text};
        cursor: pointer;
        border-radius: ${CONFIG.currentTheme === "Classic Autobot" ? "4px" : "0"};
        width: ${CONFIG.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        height: ${CONFIG.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "4px 6px" : "0"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "10px"};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-family: ${theme.fontFamily};
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      .wplace-header-btn:hover {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.text : theme.primary};
        transform: ${CONFIG.currentTheme === "Classic Autobot" ? "scale(1.1)" : "none"};
        ${CONFIG.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${theme.text};` : ""}
      }

      .wplace-content {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "12px"};
        display: block;
        position: relative;
        z-index: 2;
      }
      .wplace-content.wplace-hidden {
        display: none;
      }

      .wplace-status-section {
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(255,255,255,0.03);
        border-radius: ${theme.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }

      .wplace-section {
        margin-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "12px"};
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: ${theme.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }

      .wplace-section-title {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${theme.highlight};
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .wplace-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wplace-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .wplace-row.single {
        grid-template-columns: 1fr;
      }

      .wplace-btn {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px 8px" : "8px 12px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? "2px solid" : "none"};
        border-radius: ${theme.borderRadius};
        font-weight: ${CONFIG.currentTheme === "Neon Retro" ? "normal" : "500"};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "6px"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-family: ${theme.fontFamily};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px; image-rendering: pixelated;" : ""}
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.accent} 0%, #4a4a4a 100%)`
            : theme.accent
        };
        ${CONFIG.currentTheme === "Classic Autobot" ? "border: 1px solid rgba(255,255,255,0.1);" : ""}
      }

      ${CONFIG.currentTheme === "Classic Autobot"
            ? `
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.5s ease;
      }
      .wplace-btn:hover:not(:disabled)::before {
        left: 100%;
      }`
            : `
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      .wplace-btn:hover::before {
        left: 100%;
      }`
        }

      .wplace-btn:hover:not(:disabled) {
        transform: ${CONFIG.currentTheme === "Classic Autobot" ? "translateY(-1px)" : "none"};
        box-shadow: ${CONFIG.currentTheme === "Classic Autobot" ? "0 4px 12px rgba(0,0,0,0.4)" : "0 0 15px currentColor"
        };
        ${theme.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .wplace-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .wplace-btn-primary {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.accent} 0%, #6a5acd 100%)`
            : theme.accent
        };
        color: ${theme.text};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.text};` : ""}
      }
      .wplace-btn-upload {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.secondary} 0%, #4a4a4a 100%)`
            : theme.purple
        };
        color: ${theme.text};
        ${CONFIG.currentTheme === "Classic Autobot"
            ? `border: 1px dashed ${theme.highlight};`
            : `border-color: ${theme.text}; border-style: dashed;`
        }
      }
      .wplace-btn-start {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.success} 0%, #228b22 100%)`
            : theme.success
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.success};` : ""}
      }
      .wplace-btn-stop {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.error} 0%, #dc143c 100%)`
            : theme.error
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.text};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.error};` : ""}
      }
      .wplace-btn-select {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%)`
            : theme.highlight
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.highlight};` : ""}
      }
      .wplace-btn-file {
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? "linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%)"
            : theme.warning
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.warning};` : ""}
      }
      .wplace-btn:disabled {
        opacity: ${CONFIG.currentTheme === "Classic Autobot" ? "0.5" : "0.3"};
        cursor: not-allowed;
        transform: none !important;
        ${theme.animations.pixelBlink ? "animation: none !important;" : ""}
        box-shadow: none !important;
      }
      .wplace-btn:disabled::before {
        display: none;
      }

      .wplace-btn-overlay.active {
        background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%);
        box-shadow: 0 0 15px #8e2de2;
      }

      .wplace-stats {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.03)" : theme.secondary};
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "8px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${theme.borderRadius};
        margin-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "15px" : "8px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.1);" : ""}
      }

      .wplace-stat-item {
        display: flex;
        justify-content: space-between;
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "6px 0" : "4px 0"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        border-bottom: 1px solid rgba(255,255,255,0.05);
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
      }
      .wplace-stat-item:last-child {
        border-bottom: none;
      }
      .wplace-stat-label {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.9;
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "10px"};
      }
      .wplace-stat-value {
        font-weight: 600;
        color: ${theme.highlight};
      }

      .wplace-colors-section {
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .wplace-stat-colors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16px, 1fr));
        gap: 4px;
        margin-top: 8px;
        padding: 4px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
        max-height: 80px; /* Limit height and allow scrolling */
        overflow-y: auto;
      }

      .wplace-stat-color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
      }

      .wplace-progress {
        width: 100%;
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(0,0,0,0.3)" : theme.secondary};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${theme.borderRadius};
        margin: ${CONFIG.currentTheme === "Neon Retro" ? "10px 0" : "8px 0"};
        overflow: hidden;
        height: ${CONFIG.currentTheme === "Neon Retro" ? "16px" : "6px"};
        position: relative;
      }

      ${CONFIG.currentTheme === "Neon Retro"
            ? `
      .wplace-progress::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.1) 2px,
            rgba(0, 255, 65, 0.1) 4px
          );
        pointer-events: none;
      }`
            : ""
        }

      .wplace-progress-bar {
        height: ${CONFIG.currentTheme === "Neon Retro" ? "100%" : "6px"};
        background: ${CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%)`
            : `linear-gradient(90deg, ${theme.success}, ${theme.neon})`
        };
        transition: width ${CONFIG.currentTheme === "Neon Retro" ? "0.3s" : "0.5s"} ease;
        position: relative;
        ${CONFIG.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${theme.success};` : ""}
      }

      ${CONFIG.currentTheme === "Classic Autobot"
            ? `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }`
            : `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background: ${theme.text};
        animation: pixelBlink 1s infinite;
      }`
        }

      .wplace-status {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "10px" : "6px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? "2px solid" : "1px solid"};
        border-radius: ${theme.borderRadius};
        text-align: center;
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        position: relative;
        overflow: hidden;
      }

      .status-default {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.accent};
        border-color: ${theme.text};
        color: ${theme.text};
      }
      .status-success {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(0, 255, 0, 0.1)" : theme.success};
        border-color: ${theme.success};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.success : theme.primary};
        box-shadow: 0 0 15px ${theme.success};
      }
      .status-error {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255, 0, 0, 0.1)" : theme.error};
        border-color: ${theme.error};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.error : theme.text};
        box-shadow: 0 0 15px ${theme.error};
        ${theme.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .status-warning {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255, 165, 0, 0.1)" : theme.warning};
        border-color: ${theme.warning};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "orange" : theme.primary};
        box-shadow: 0 0 15px ${theme.warning};
      }

      .resize-container {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${theme.primary};
        padding: 20px;
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.text};
        border-radius: ${theme.borderRadius};
        z-index: 10000;
        box-shadow: ${CONFIG.currentTheme === "Classic Autobot" ? "0 0 20px rgba(0,0,0,0.5)" : "0 0 30px rgba(0, 255, 65, 0.5)"
        };
        width: 90%;
        max-width: 700px;
        max-height: 90%;
        overflow: auto;
        font-family: ${theme.fontFamily};
      }

      .resize-preview-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid ${theme.accent};
        background: rgba(0,0,0,0.2);
        margin: 15px 0;
        height: 300px;
        overflow: hidden;
      }

  .resize-canvas-stack { position: relative; transform-origin: center center; display: inline-block; }
      .resize-base-canvas, .resize-mask-canvas {
        position: absolute; left: 0; top: 0;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
      .resize-mask-canvas { pointer-events: auto; }
      .resize-tools { display:flex; gap:8px; align-items:center; margin-top:8px; font-size:12px; }
      .resize-tools button { padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color:#fff; cursor:pointer; }
      .wplace-btn.active,
      .wplace-btn[aria-pressed="true"] {
        background: ${theme.highlight} !important;
        color: ${theme.primary} !important;
        border-color: ${theme.text} !important;
        box-shadow: 0 0 8px rgba(0,0,0,0.25) inset, 0 0 6px rgba(0,0,0,0.2) !important;
      }
      .wplace-btn.active i,
      .wplace-btn[aria-pressed="true"] i { filter: drop-shadow(0 0 3px ${theme.primary}); }
      .mask-mode-group .wplace-btn.active,
      .mask-mode-group .wplace-btn[aria-pressed="true"] {
        background: ${theme.highlight};
        color: ${theme.primary};
        border-color: ${theme.text};
        box-shadow: 0 0 8px rgba(0,0,0,0.25) inset, 0 0 6px rgba(0,0,0,0.2);
      }

      .resize-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        align-items: center;
      }

      .resize-controls label {
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "12px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        color: ${theme.text};
      }

      .resize-slider {
        width: 100%;
        height: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "4px"};
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "#ccc" : theme.secondary};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "none"};
        border-radius: ${theme.borderRadius};
        outline: none;
        -webkit-appearance: none;
      }

      ${CONFIG.currentTheme === "Neon Retro"
            ? `
      .resize-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: ${theme.highlight};
        border: 2px solid ${theme.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${theme.highlight};
      }

      .resize-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: ${theme.highlight};
        border: 2px solid ${theme.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${theme.highlight};
      }`
            : ""
        }

      .resize-zoom-controls {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
      }

      .resize-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
      }

      .resize-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: none;
      }
      .wplace-color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
        padding-top: 8px;
        max-height: 300px;
        overflow-y: auto;
      }
      .wplace-color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .wplace-color-item-name {
        font-size: 9px;
        color: #ccc;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .wplace-color-swatch {
        width: 22px;
        height: 22px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        position: relative;
        margin: 0 auto;
      }
      .wplace-color-swatch.unavailable {
        border-color: #666;
        border-style: dashed;
        cursor: not-allowed;
      }
      .wplace-color-swatch:hover {
        transform: scale(1.1);
        z-index: 1;
      }
      .wplace-color-swatch:not(.active) {
        opacity: 0.3;
        filter: grayscale(80%);
      }
      .wplace-color-swatch.unavailable:not(.active) {
        opacity: 0.2;
        filter: grayscale(90%);
      }
      .wplace-color-swatch.active::after {
        content: '✔';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 0 0 3px black;
      }
      .wplace-color-divider {
        border: none;
        height: 1px;
        background: rgba(255,255,255,0.1);
        margin: 8px 0;
      }

        .wplace-cooldown-control {
            margin-top: 8px;
        }
        .wplace-cooldown-control label {
            font-size: 11px;
            margin-bottom: 4px;
            display: block;
        }
        .wplace-slider-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wplace-slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: #444;
            border-radius: 2px;
            outline: none;
        }
        .wplace-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: ${theme.highlight};
            border-radius: 50%;
            cursor: pointer;
        }


      ${CONFIG.currentTheme === "Neon Retro"
            ? `
      input[type="checkbox"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid ${theme.text};
        background: ${theme.secondary};
        margin-right: 8px;
        position: relative;
        cursor: pointer;
      }

      input[type="checkbox"]:checked {
        background: ${theme.success};
      }

      input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 1px;
        color: ${theme.primary};
        font-size: 12px;
        font-weight: bold;
      }

      .fas, .fa {
        filter: drop-shadow(0 0 3px currentColor);
      }

      .wplace-speed-control {
        margin-top: 12px;
        padding: 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        backdrop-filter: ${theme.backdropFilter};
      }

      .wplace-speed-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${theme.text};
        font-size: 13px;
        font-weight: 600;
      }

      .wplace-speed-label i {
        margin-right: 6px;
        color: ${theme.highlight};
      }

      .wplace-speed-slider-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .wplace-speed-slider {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: ${theme.primary};
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }

      .wplace-speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${theme.highlight};
        cursor: pointer;
        border: 2px solid ${theme.text};
        box-shadow: ${theme.boxShadow};
      }

      .wplace-speed-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${theme.highlight};
        cursor: pointer;
        border: 2px solid ${theme.text};
        box-shadow: ${theme.boxShadow};
      }

      .wplace-speed-display {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 90px;
        justify-content: flex-end;
      }

      #speedValue {
        color: ${theme.highlight};
        font-weight: 600;
        font-size: 14px;
      }

      .wplace-speed-unit {
        color: ${theme.text};
        font-size: 11px;
        opacity: 0.8;
      }

      #wplace-settings-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        min-width: 400px;
        max-width: 500px;
        background: ${theme.primary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        box-shadow: ${theme.boxShadow};
        backdrop-filter: ${theme.backdropFilter};
      }

      .wplace-settings {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      .wplace-setting-section {
        margin-bottom: 20px;
        padding: 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
      }

      .wplace-setting-title {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        color: ${theme.text};
        font-size: 14px;
        font-weight: 600;
      }

      .wplace-setting-title i {
        margin-right: 8px;
        color: ${theme.highlight};
      }

      .wplace-setting-content {
        color: ${theme.text};
      }

      .wplace-section {
        margin-bottom: 20px;
        padding: 15px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
      }

      .wplace-section-title {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        color: ${theme.text};
        font-size: 14px;
        font-weight: 600;
      }

      .wplace-section-title i {
        margin-right: 8px;
        color: ${theme.highlight};
      }

      .wplace-speed-container {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }

      .wplace-slider {
        flex: 1;
        height: 6px;
        background: ${theme.accent};
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
      }

      .wplace-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        background: ${theme.highlight};
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid ${theme.primary};
      }

      .wplace-speed-display {
        background: ${theme.accent};
        padding: 5px 10px;
        border-radius: 4px;
        color: ${theme.text};
        font-weight: 600;
        min-width: 80px;
        text-align: center;
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }

      .wplace-select {
        width: 100%;
        padding: 8px 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        color: ${theme.text};
        font-size: 14px;
        margin-bottom: 10px;
      }

      .wplace-select:focus {
        outline: none;
        border-color: ${theme.highlight};
      }

      .wplace-description {
        color: ${theme.text};
        font-size: 12px;
        opacity: 0.8;
        line-height: 1.4;
      }

      .wplace-theme-custom {
        margin-top: 15px;
        padding: 15px;
        background: ${theme.accent};
        border-radius: ${theme.borderRadius};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }

      .wplace-custom-group {
        margin-bottom: 15px;
      }

      .wplace-custom-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${theme.text};
        font-size: 13px;
        font-weight: 600;
      }

      .wplace-custom-label i {
        margin-right: 8px;
        color: ${theme.highlight};
        width: 16px;
      }

      .wplace-color-input-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .wplace-color-input {
        width: 50px;
        height: 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
      }

      .wplace-color-text {
        flex: 1;
        padding: 6px 10px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: 4px;
        color: ${theme.text};
        font-size: 12px;
        font-family: monospace;
      }

      .wplace-animation-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .wplace-checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${theme.text};
        font-size: 12px;
        cursor: pointer;
      }

      .wplace-checkbox-label input[type="checkbox"] {
        accent-color: ${theme.highlight};
      }

      .wplace-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .wplace-slider-container .wplace-slider {
        flex: 1;
      }

      .wplace-slider-container span {
        color: ${theme.text};
        font-size: 12px;
        font-weight: 600;
        min-width: 40px;
      }

      .wplace-custom-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        border-top: 1px solid ${theme.accent};
        padding-top: 15px;
      }

      .wplace-btn-secondary {
        background: ${theme.accent};
        color: ${theme.text};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }

      .wplace-btn-secondary:hover {
        background: ${theme.secondary};
      }`
            : ""
        }
    `
    document.head.appendChild(style)

    const container = document.createElement("div")
    container.id = "wplace-image-bot-container"
    container.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t("settings")}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="Show Stats">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="Compact Mode">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t("minimize")}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${Utils.t("initMessage")}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🖼️ Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload">
                <i class="fas fa-upload"></i>
                <span>${Utils.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${Utils.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${Utils.t("selectPosition")}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Control Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🎮 Painting Control</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="startBtn" class="wplace-btn wplace-btn-start" disabled>
                <i class="fas fa-play"></i>
                <span>${Utils.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${Utils.t("stopPainting")}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${Utils.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">⏱️ ${Utils.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${Utils.t("waitCharges")}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${state.cooldownChargeThreshold}">
                    <span id="cooldownValue" style="font-weight:bold; min-width: 20px; text-align: center;">${state.cooldownChargeThreshold}</span>
                </div>
            </div>
        </div>

        <!-- Data Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">💾 Data Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="saveBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-save"></i>
                <span>${Utils.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary">
                <i class="fas fa-folder-open"></i>
                <span>${Utils.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${Utils.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file">
                <i class="fas fa-upload"></i>
                <span>${Utils.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Stats Window - Separate UI
    const statsContainer = document.createElement("div")
    statsContainer.id = "wplace-stats-container"
    statsContainer.style.display = "none"
    statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>Painting Stats</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="Refresh Charges">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="Close Stats">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t("initMessage")}</div>
            </div>
          </div>
        </div>
      </div>
    `

    // Modern Settings Container
    const settingsContainer = document.createElement("div")
    settingsContainer.id = "wplace-settings-container"
    settingsContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 16px;
      padding: 0;
      z-index: 10002;
      display: none;
      min-width: 420px;
      max-width: 480px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      overflow: hidden;
      animation: settingsSlideIn 0.4s ease-out;
    `

    settingsContainer.innerHTML = `
      <div class="wplace-settings-header" style="background: rgba(255,255,255,0.1); padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 300; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-cog" style="font-size: 18px; animation: spin 2s linear infinite;"></i>
            ${Utils.t("settings")}
          </h3>
          <button id="closeSettingsBtn" style="
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 300;
          " onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'">✕</button>
        </div>
      </div>

      <div style="padding: 25px; max-height: 70vh; overflow-y: auto;">

        <!-- Automation Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-robot" style="color: #4facfe; font-size: 16px;"></i>
            ${Utils.t("automation")}
          </label>
          <!-- Turnstile generator is always enabled - no toggle needed -->

        </div>

        <!-- Overlay Settings Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-eye" style="color: #48dbfb; font-size: 16px;"></i>
            Overlay Settings
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
              <!-- Opacity Slider -->
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                   <span style="font-weight: 500; font-size: 13px;">Overlay Opacity</span>
                   <div id="overlayOpacityValue" style="min-width: 40px; text-align: center; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-size: 12px;">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${state.overlayOpacity}" style="width: 100%; -webkit-appearance: none; height: 8px; background: linear-gradient(to right, #48dbfb 0%, #d3a4ff 100%); border-radius: 4px; outline: none; cursor: pointer;">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div>
                      <span style="font-weight: 500;">Blue Marble Effect</span>
                      <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${state.blueMarbleEnabled ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-tachometer-alt" style="color: #4facfe; font-size: 16px;"></i>
            ${Utils.t("paintingSpeed")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}"
                style="
                  flex: 1;
                  height: 8px;
                  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                  border-radius: 4px;
                  outline: none;
                  -webkit-appearance: none;
                  cursor: pointer;
                ">
              <div id="speedValue" style="
                min-width: 70px;
                text-align: center;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                padding: 8px 12px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                font-size: 13px;
                box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3);
                border: 1px solid rgba(255,255,255,0.2);
              ">${CONFIG.PAINTING_SPEED.DEFAULT} px/s</div>
            </div>
            <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 8px;">
              <span><i class="fas fa-turtle"></i> ${CONFIG.PAINTING_SPEED.MIN}</span>
              <span><i class="fas fa-rabbit"></i> ${CONFIG.PAINTING_SPEED.MAX}</span>
            </div>
          </div>
           <label style="display: flex; align-items: center; gap: 8px; color: white; margin-top: 10px;">
            <input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''} style="cursor: pointer;"/>
            <span>Enable painting speed limit</span>
          </label>
        </div>


        <!-- Theme Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-palette" style="color: #f093fb; font-size: 16px;"></i>
            ${Utils.t("themeSettings")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="themeSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              ${Object.keys(CONFIG.THEMES).map(themeName =>
            `<option value="${themeName}" ${CONFIG.currentTheme === themeName ? 'selected' : ''} style="background: #2d3748; color: white; padding: 10px;">${themeName}</option>`
        ).join('')}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-globe" style="color: #ffeaa7; font-size: 16px;"></i>
            ${Utils.t("language")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="languageSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              <option value="vi" ${state.language === 'vi' ? 'selected' : ''} style="background: #2d3748; color: white;">🇻🇳 Tiếng Việt</option>
              <option value="id" ${state.language === 'id' ? 'selected' : ''} style="background: #2d3748; color: white;">🇮🇩 Bahasa Indonesia</option>
              <option value="ru" ${state.language === 'ru' ? 'selected' : ''} style="background: #2d3748; color: white;">🇷🇺 Русский</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''} style="background: #2d3748; color: white;">🇺🇸 English</option>
              <option value="pt" ${state.language === 'pt' ? 'selected' : ''} style="background: #2d3748; color: white;">🇧🇷 Português</option>
              <option value="fr" ${state.language === 'fr' ? 'selected' : ''} style="background: #2d3748; color: white;">🇫🇷 Français</option>
              <option value="tr" ${state.language === 'tr' ? 'selected' : ''} style="background: #2d3748; color: white;">🇹🇷 Türkçe</option>
              <option value="zh" ${state.language === 'zh' ? 'selected' : ''} style="background: #2d3748; color: white;">🇨🇳 简体中文</option>
              <option value="ja" ${state.language === 'ja' ? 'selected' : ''} style="background: #2d3748; color: white;">🇯🇵 日本語</option>
              <option value="ko" ${state.language === 'ko' ? 'selected' : ''} style="background: #2d3748; color: white;">🇰🇷 한국어</option>
              </select>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px;">
             <button id="applySettingsBtn" style="
                width: 100%;
                ${CONFIG.CSS_CLASSES.BUTTON_PRIMARY}
             ">
                 <i class="fas fa-check"></i> ${Utils.t("applySettings")}
             </button>
        </div>

      </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes settingsSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes settingsFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        #speedSlider::-webkit-slider-thumb, #overlayOpacitySlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #speedSlider::-webkit-slider-thumb:hover, #overlayOpacitySlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
        }

        #speedSlider::-moz-range-thumb, #overlayOpacitySlider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        #themeSelect:hover, #languageSelect:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        #themeSelect:focus, #languageSelect:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
        }

        #themeSelect option, #languageSelect option {
          background: #2d3748;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        #themeSelect option:hover, #languageSelect option:hover {
          background: #4a5568;
        }

        .wplace-dragging {
          opacity: 0.9;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
          transition: none;
        }

        .wplace-settings-header:hover {
          background: rgba(255,255,255,0.15) !important;
        }

        .wplace-settings-header:active {
          background: rgba(255,255,255,0.2) !important;
        }
      </style>
    `

    const resizeContainer = document.createElement("div")
    resizeContainer.className = "resize-container"
    resizeContainer.innerHTML = `
      <h3 style="margin-top: 0; color: ${theme.text}">${Utils.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label>
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label>
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="display: flex; align-items: center;">
          <input type="checkbox" id="keepAspect" checked>
          Keep Aspect Ratio
        </label>
        <label style="display: flex; align-items: center;">
            <input type="checkbox" id="paintWhiteToggle" checked>
            Paint White Pixels
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn" title="Zoom Out" style="padding:4px 8px;"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider" min="0.1" max="20" value="1" step="0.05" style="max-width: 220px;">
          <button id="zoomInBtn" class="wplace-btn" title="Zoom In" style="padding:4px 8px;"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn" title="Fit to view" style="padding:4px 8px;">Fit</button>
          <button id="zoomActualBtn" class="wplace-btn" title="Actual size (100%)" style="padding:4px 8px;">100%</button>
          <button id="panModeBtn" class="wplace-btn" title="Pan (drag to move view)" style="padding:4px 8px;">
            <i class="fas fa-hand-paper"></i>
          </button>
          <span id="zoomValue" style="margin-left:6px; min-width:48px; text-align:right; opacity:.85; font-size:12px;">100%</span>
          <div id="cameraHelp" style="font-size:11px; opacity:.75; margin-left:auto;">
            Drag to pan • Pinch to zoom • Double‑tap to zoom
          </div>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <div id="resizePanStage" style="position:relative; width:100%; height:100%; overflow:hidden;">
            <div id="resizeCanvasStack" class="resize-canvas-stack" style="position:absolute; left:0; top:0; transform-origin: top left;">
              <canvas id="resizeCanvas" class="resize-base-canvas"></canvas>
              <canvas id="maskCanvas" class="resize-mask-canvas"></canvas>
            </div>
          </div>
      </div>
      <div class="resize-tools">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="font-size:12px; opacity:.85;">Brush</label>
            <input id="maskBrushSize" type="range" min="1" max="7" step="1" value="1" style="width:120px;">
            <span id="maskBrushSizeValue" style="font-size:12px; opacity:.85; min-width:18px; text-align:center;">1</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="font-size:12px; opacity:.85;">Mode</label>
            <div class="mask-mode-group" style="display:flex; gap:6px;">
              <button id="maskModeIgnore" class="wplace-btn" style="padding:4px 8px; font-size:12px;">Ignore</button>
              <button id="maskModeUnignore" class="wplace-btn" style="padding:4px 8px; font-size:12px;">Unignore</button>
              <button id="maskModeToggle" class="wplace-btn wplace-btn-primary" style="padding:4px 8px; font-size:12px;">Toggle</button>
            </div>
          </div>
          <button id="clearIgnoredBtn" class="wplace-btn" title="Clear all ignored pixels" style="padding:4px 8px; font-size:12px;">Clear</button>
          <button id="invertMaskBtn" class="wplace-btn" title="Invert mask" style="padding:4px 8px; font-size:12px;">Invert</button>
          <span style="opacity:.8; font-size:12px;">Shift = Row • Alt = Column</span>
        </div>
      </div>

      <div class="wplace-section" id="color-palette-section" style="margin-top: 15px;">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <input type="checkbox" id="showAllColorsToggle" style="cursor: pointer;">
                      <span>Show All Colors (including unavailable)</span>
                  </label>
              </div>
              <div class="wplace-row">
                  <button id="selectAllBtn" class="wplace-btn">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn">Unselect All</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="wplace-section" id="advanced-color-section" style="margin-top: 15px;">
        <div class="wplace-section-title">
          <i class="fas fa-flask"></i>&nbsp;Advanced Color Matching
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
            <span style="font-weight:600;">Algorithm</span>
            <select id="colorAlgorithmSelect" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;">
              <option value="lab" ${state.colorMatchingAlgorithm === 'lab' ? 'selected' : ''}>Perceptual (Lab)</option>
            <option value="legacy" ${state.colorMatchingAlgorithm === 'legacy' ? 'selected' : ''}>Legacy (RGB)</option>
            </select>
          </label>
          <label style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
            <div style="flex:1;">
              <span style="font-weight:600;">Chroma Penalty</span>
              <div style="margin-top:2px; opacity:0.65;">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${state.enableChromaPenalty ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;" />
          </label>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
              <span>Chroma Weight</span>
              <span id="chromaWeightValue" style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px;">${state.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="0" max="0.5" step="0.01" value="${state.chromaPenaltyWeight}" style="width:100%;" />
          </div>
          <label style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
            <div style="flex:1;">
              <span style="font-weight:600;">Enable Dithering</span>
              <div style="margin-top:2px; opacity:0.65;">Floyd–Steinberg error diffusion in preview and applied output</div>
            </div>
            <input type="checkbox" id="enableDitheringToggle" ${state.ditheringEnabled ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;" />
          </label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
              <span style="font-weight:600;">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${state.customTransparencyThreshold}" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;" />
            </label>
            <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
              <span style="font-weight:600;">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${state.customWhiteThreshold}" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn" style="background:linear-gradient(135deg,#ff6a6a,#ff4757); font-size:11px;">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>Download Preview</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>Apply</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>
    `

    const resizeOverlay = document.createElement("div")
    resizeOverlay.className = "resize-overlay"

    document.body.appendChild(container)
    document.body.appendChild(resizeOverlay)
    document.body.appendChild(resizeContainer)
    document.body.appendChild(statsContainer)
    document.body.appendChild(settingsContainer)

    const uploadBtn = container.querySelector("#uploadBtn")
    const resizeBtn = container.querySelector("#resizeBtn")
    const selectPosBtn = container.querySelector("#selectPosBtn")
    const startBtn = container.querySelector("#startBtn")
    const stopBtn = container.querySelector("#stopBtn")
    const saveBtn = container.querySelector("#saveBtn")
    const loadBtn = container.querySelector("#loadBtn")
    const saveToFileBtn = container.querySelector("#saveToFileBtn")
    const loadFromFileBtn = container.querySelector("#loadFromFileBtn")
    const minimizeBtn = container.querySelector("#minimizeBtn")
    const compactBtn = container.querySelector("#compactBtn")
    const statsBtn = container.querySelector("#statsBtn")
    const toggleOverlayBtn = container.querySelector("#toggleOverlayBtn");
    const statusText = container.querySelector("#statusText")
    const progressBar = container.querySelector("#progressBar")
    const statsArea = statsContainer.querySelector("#statsArea")
    const content = container.querySelector(".wplace-content")
    const closeStatsBtn = statsContainer.querySelector("#closeStatsBtn")
    const refreshChargesBtn = statsContainer.querySelector("#refreshChargesBtn")
    const cooldownSlider = container.querySelector("#cooldownSlider");
    const cooldownValue = container.querySelector("#cooldownValue");

    if (!uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
        console.error("Some UI elements not found:", {
            uploadBtn: !!uploadBtn,
            selectPosBtn: !!selectPosBtn,
            startBtn: !!startBtn,
            stopBtn: !!stopBtn,
        })
    }

    if (!statsContainer || !statsArea || !closeStatsBtn) {
        console.error("Stats UI elements not found:", {
            statsContainer: !!statsContainer,
            statsArea: !!statsArea,
            closeStatsBtn: !!closeStatsBtn,
        })
    }

    const header = container.querySelector(".wplace-header")

    makeDraggable(container)

    function makeDraggable(element) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0
        let isDragging = false
        const header = element.querySelector(".wplace-header") || element.querySelector(".wplace-settings-header")

        if (!header) {
            console.warn("No draggable header found for element:", element)
            return
        }

        header.onmousedown = dragMouseDown

        function dragMouseDown(e) {
            if (e.target.closest(".wplace-header-btn") || e.target.closest("button")) return

            e.preventDefault()
            isDragging = true

            const rect = element.getBoundingClientRect()

            element.style.transform = "none"
            element.style.top = rect.top + "px"
            element.style.left = rect.left + "px"

            pos3 = e.clientX
            pos4 = e.clientY
            element.classList.add("wplace-dragging")
            document.onmouseup = closeDragElement
            document.onmousemove = elementDrag

            document.body.style.userSelect = "none"
        }

        function elementDrag(e) {
            if (!isDragging) return

            e.preventDefault()
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            pos3 = e.clientX
            pos4 = e.clientY

            let newTop = element.offsetTop - pos2
            let newLeft = element.offsetLeft - pos1

            const rect = element.getBoundingClientRect()
            const maxTop = window.innerHeight - rect.height
            const maxLeft = window.innerWidth - rect.width

            newTop = Math.max(0, Math.min(newTop, maxTop))
            newLeft = Math.max(0, Math.min(newLeft, maxLeft))

            element.style.top = newTop + "px"
            element.style.left = newLeft + "px"
        }

        function closeDragElement() {
            isDragging = false
            element.classList.remove("wplace-dragging")
            document.onmouseup = null
            document.onmousemove = null
            document.body.style.userSelect = ""
        }
    }

    makeDraggable(statsContainer)
    makeDraggable(container)

    if (statsBtn && closeStatsBtn) {
        statsBtn.addEventListener("click", () => {
            const isVisible = statsContainer.style.display !== "none"
            if (isVisible) {
                statsContainer.style.display = "none"
                statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>'
                statsBtn.title = "Show Stats"
            } else {
                statsContainer.style.display = "block"
                statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>'
                statsBtn.title = "Hide Stats"
            }
        })

        closeStatsBtn.addEventListener("click", () => {
            statsContainer.style.display = "none"
            statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>'
            statsBtn.title = "Show Stats"
        })

        if (refreshChargesBtn) {
            refreshChargesBtn.addEventListener("click", async () => {
                refreshChargesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
                refreshChargesBtn.disabled = true

                try {
                    await updateStats()
                } catch (error) {
                    console.error("Error refreshing charges:", error)
                } finally {
                    refreshChargesBtn.innerHTML = '<i class="fas fa-sync"></i>'
                    refreshChargesBtn.disabled = false
                }
            })
        }
    }
    if (statsContainer && statsBtn) {
        statsContainer.style.display = "block";
        statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
        statsBtn.title = "Hide Stats";
    }

    const settingsBtn = container.querySelector("#settingsBtn")
    const closeSettingsBtn = settingsContainer.querySelector("#closeSettingsBtn")
    const applySettingsBtn = settingsContainer.querySelector("#applySettingsBtn");


    if (settingsBtn && closeSettingsBtn && applySettingsBtn) {
        settingsBtn.addEventListener("click", () => {
            const isVisible = settingsContainer.style.display !== "none"
            if (isVisible) {
                settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
                setTimeout(() => {
                    settingsContainer.style.display = "none"
                    settingsContainer.style.animation = ""
                }, 300)
            } else {
                settingsContainer.style.top = "50%"
                settingsContainer.style.left = "50%"
                settingsContainer.style.transform = "translate(-50%, -50%)"
                settingsContainer.style.display = "block"
                settingsContainer.style.animation = "settingsSlideIn 0.4s ease-out"
            }
        })

        closeSettingsBtn.addEventListener("click", () => {
            settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
            setTimeout(() => {
                settingsContainer.style.display = "none"
                settingsContainer.style.animation = ""
                settingsContainer.style.top = "50%"
                settingsContainer.style.left = "50%"
                settingsContainer.style.transform = "translate(-50%, -50%)"
            }, 300)
        })

        applySettingsBtn.addEventListener("click", () => {
            // Sync advanced settings before save
            const colorAlgorithmSelect = document.getElementById('colorAlgorithmSelect');
            if (colorAlgorithmSelect) state.colorMatchingAlgorithm = colorAlgorithmSelect.value;
            const enableChromaPenaltyToggle = document.getElementById('enableChromaPenaltyToggle');
            if (enableChromaPenaltyToggle) state.enableChromaPenalty = enableChromaPenaltyToggle.checked;
            const chromaPenaltyWeightSlider = document.getElementById('chromaPenaltyWeightSlider');
            if (chromaPenaltyWeightSlider) state.chromaPenaltyWeight = parseFloat(chromaPenaltyWeightSlider.value) || 0.15;
            const transparencyThresholdInput = document.getElementById('transparencyThresholdInput');
            if (transparencyThresholdInput) {
                const v = parseInt(transparencyThresholdInput.value, 10); if (!isNaN(v) && v >= 0 && v <= 255) state.customTransparencyThreshold = v;
            }
            const whiteThresholdInput = document.getElementById('whiteThresholdInput');
            if (whiteThresholdInput) {
                const v = parseInt(whiteThresholdInput.value, 10); if (!isNaN(v) && v >= 200 && v <= 255) state.customWhiteThreshold = v;
            }
            // Update functional thresholds
            CONFIG.TRANSPARENCY_THRESHOLD = state.customTransparencyThreshold;
            CONFIG.WHITE_THRESHOLD = state.customWhiteThreshold;
            saveBotSettings();
            Utils.showAlert(Utils.t("settingsSaved"), "success");
            closeSettingsBtn.click();
        });

        makeDraggable(settingsContainer)

        const languageSelect = settingsContainer.querySelector("#languageSelect")
        if (languageSelect) {
            languageSelect.addEventListener("change", (e) => {
                const newLanguage = e.target.value
                state.language = newLanguage
                localStorage.setItem('wplace_language', newLanguage)

                setTimeout(() => {
                    settingsContainer.style.display = "none"
                    createUI()
                }, 100)
            })
        }

        const themeSelect = settingsContainer.querySelector("#themeSelect")
        if (themeSelect) {
            themeSelect.addEventListener("change", (e) => {
                const newTheme = e.target.value
                switchTheme(newTheme)
            })
        }

        const overlayOpacitySlider = settingsContainer.querySelector("#overlayOpacitySlider");
        const overlayOpacityValue = settingsContainer.querySelector("#overlayOpacityValue");
        const enableBlueMarbleToggle = settingsContainer.querySelector("#enableBlueMarbleToggle");

        if (overlayOpacitySlider && overlayOpacityValue) {
            overlayOpacitySlider.addEventListener('input', (e) => {
                const opacity = parseFloat(e.target.value);
                state.overlayOpacity = opacity;
                overlayOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
            });
        }

        if (enableBlueMarbleToggle) {
            enableBlueMarbleToggle.addEventListener('click', async () => {
                state.blueMarbleEnabled = enableBlueMarbleToggle.checked;
                if (state.imageLoaded && overlayManager.imageBitmap) {
                    Utils.showAlert("Re-processing overlay...", "info");
                    await overlayManager.processImageIntoChunks();
                    Utils.showAlert("Overlay updated!", "success");
                }
            });
        }

        // (Advanced color listeners moved outside to work with resize dialog)

    }

    const widthSlider = resizeContainer.querySelector("#widthSlider")
    const heightSlider = resizeContainer.querySelector("#heightSlider")
    const widthValue = resizeContainer.querySelector("#widthValue")
    const heightValue = resizeContainer.querySelector("#heightValue")
    const keepAspect = resizeContainer.querySelector("#keepAspect")
    const paintWhiteToggle = resizeContainer.querySelector("#paintWhiteToggle");
    const zoomSlider = resizeContainer.querySelector("#zoomSlider");
    const zoomValue = resizeContainer.querySelector('#zoomValue');
    const zoomInBtn = resizeContainer.querySelector('#zoomInBtn');
    const zoomOutBtn = resizeContainer.querySelector('#zoomOutBtn');
    const zoomFitBtn = resizeContainer.querySelector('#zoomFitBtn');
    const zoomActualBtn = resizeContainer.querySelector('#zoomActualBtn');
    const panModeBtn = resizeContainer.querySelector('#panModeBtn');
    const panStage = resizeContainer.querySelector('#resizePanStage');
    const canvasStack = resizeContainer.querySelector('#resizeCanvasStack');
    const baseCanvas = resizeContainer.querySelector('#resizeCanvas');
    const maskCanvas = resizeContainer.querySelector('#maskCanvas');
    const baseCtx = baseCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    const confirmResize = resizeContainer.querySelector("#confirmResize")
    const cancelResize = resizeContainer.querySelector("#cancelResize")
    const downloadPreviewBtn = resizeContainer.querySelector("#downloadPreviewBtn");
    const clearIgnoredBtn = resizeContainer.querySelector('#clearIgnoredBtn');

    if (compactBtn) {
        compactBtn.addEventListener("click", () => {
            container.classList.toggle("wplace-compact")
            const isCompact = container.classList.contains("wplace-compact")

            if (isCompact) {
                compactBtn.innerHTML = '<i class="fas fa-expand"></i>'
                compactBtn.title = "Expand Mode"
            } else {
                compactBtn.innerHTML = '<i class="fas fa-compress"></i>'
                compactBtn.title = "Compact Mode"
            }
        })
    }

    if (minimizeBtn) {
        minimizeBtn.addEventListener("click", () => {
            state.minimized = !state.minimized
            if (state.minimized) {
                container.classList.add("wplace-minimized")
                content.classList.add("wplace-hidden")
                minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>'
                minimizeBtn.title = "Restore"
            } else {
                container.classList.remove("wplace-minimized")
                content.classList.remove("wplace-hidden")
                minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>'
                minimizeBtn.title = "Minimize"
            }
            saveBotSettings()
        })
    }

    if (toggleOverlayBtn) {
        toggleOverlayBtn.addEventListener('click', () => {
            const isEnabled = overlayManager.toggle();
            toggleOverlayBtn.classList.toggle('active', isEnabled);
            toggleOverlayBtn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
            Utils.showAlert(`Overlay ${isEnabled ? 'enabled' : 'disabled'}.`, 'info');
        });
    }

    if (state.minimized) {
        container.classList.add("wplace-minimized")
        content.classList.add("wplace-hidden")
        if (minimizeBtn) {
            minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>'
            minimizeBtn.title = "Restore"
        }
    } else {
        container.classList.remove("wplace-minimized")
        content.classList.remove("wplace-hidden")
        if (minimizeBtn) {
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>'
            minimizeBtn.title = "Minimize"
        }
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (!state.imageLoaded) {
                Utils.showAlert(Utils.t("missingRequirements"), "error")
                return
            }

            const success = Utils.saveProgress()
            if (success) {
                updateUI("autoSaved", "success")
                Utils.showAlert(Utils.t("autoSaved"), "success")
            } else {
                Utils.showAlert("❌ Erro ao salvar progresso", "error")
            }
        })
    }

    if (loadBtn) {
        loadBtn.addEventListener("click", () => {
            const savedData = Utils.loadProgress()
            if (!savedData) {
                updateUI("noSavedData", "warning")
                Utils.showAlert(Utils.t("noSavedData"), "warning")
                return
            }

            const confirmLoad = confirm(
                `${Utils.t("savedDataFound")}\n\n` +
                `Saved: ${new Date(savedData.timestamp).toLocaleString()}\n` +
                `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`,
            )

            if (confirmLoad) {
                const success = Utils.restoreProgress(savedData)
                if (success) {
                    updateUI("dataLoaded", "success")
                    Utils.showAlert(Utils.t("dataLoaded"), "success")
                    updateDataButtons()

                    updateStats()

                    // Restore overlay if image data was loaded from localStorage
                    Utils.restoreOverlayFromData().catch(error => {
                        console.error('Failed to restore overlay from localStorage:', error);
                    });

                    if (!state.colorsChecked) {
                        uploadBtn.disabled = false;
                    } else {
                        uploadBtn.disabled = false;
                        selectPosBtn.disabled = false;
                    }

                    if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
                        startBtn.disabled = false
                    }
                } else {
                    Utils.showAlert("❌ Erro ao carregar progresso", "error")
                }
            }
        })
    }

    if (saveToFileBtn) {
        saveToFileBtn.addEventListener("click", () => {
            const success = Utils.saveProgressToFile()
            if (success) {
                updateUI("fileSaved", "success")
                Utils.showAlert(Utils.t("fileSaved"), "success")
            } else {
                Utils.showAlert(Utils.t("fileError"), "error")
            }
        })
    }

    if (loadFromFileBtn) {
        loadFromFileBtn.addEventListener("click", async () => {
            try {
                const success = await Utils.loadProgressFromFile()
                if (success) {
                    updateUI("fileLoaded", "success")
                    Utils.showAlert(Utils.t("fileLoaded"), "success")
                    updateDataButtons()

                    await updateStats()

                    // Restore overlay if image data was loaded from file
                    await Utils.restoreOverlayFromData().catch(error => {
                        console.error('Failed to restore overlay from file:', error);
                    });

                    if (state.colorsChecked) {
                        uploadBtn.disabled = false
                        selectPosBtn.disabled = false
                        resizeBtn.disabled = false
                    } else {
                        uploadBtn.disabled = false;
                    }

                    if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
                        startBtn.disabled = false
                    }
                }
            } catch (error) {
                if (error.message === "Invalid JSON file") {
                    Utils.showAlert(Utils.t("invalidFileFormat"), "error")
                } else {
                    Utils.showAlert(Utils.t("fileError"), "error")
                }
            }
        })
    }

    updateUI = (messageKey, type = "default", params = {}) => {
        const message = Utils.t(messageKey, params)
        statusText.textContent = message
        statusText.className = `wplace-status status-${type}`
        statusText.style.animation = "none"
        void statusText.offsetWidth
        statusText.style.animation = "slideIn 0.3s ease-out"
    }

    updateStats = async () => {
        const { charges, cooldown, max } = await WPlaceService.getCharges();
        state.currentCharges = Math.floor(charges);
        state.cooldown = cooldown;
        state.maxCharges = Math.floor(max) > 1 ? Math.floor(max) : state.maxCharges;

        if (cooldownSlider.max != state.maxCharges) {
            cooldownSlider.max = state.maxCharges;
        }

        let imageStatsHTML = '';
        if (state.imageLoaded) {
            const progress = state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
            const remainingPixels = state.totalPixels - state.paintedPixels;
            state.estimatedTime = Utils.calculateEstimatedTime(remainingPixels, state.currentCharges, state.cooldown);
            progressBar.style.width = `${progress}%`;

            imageStatsHTML = `
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t("progress")}</div>
                <div class="wplace-stat-value">${progress}%</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t("pixels")}</div>
                <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t("estimatedTime")}</div>
                <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
                </div>
            `;
        }

        let colorSwatchesHTML = '';
        if (state.colorsChecked) {
            colorSwatchesHTML = state.availableColors.map(color => {
                const rgbString = `rgb(${color.rgb.join(',')})`;
                return `<div class="wplace-stat-color-swatch" style="background-color: ${rgbString};" title="ID: ${color.id}\nRGB: ${color.rgb.join(', ')}"></div>`;
            }).join('');
        }

        statsArea.innerHTML = `
            ${imageStatsHTML}
            <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${Utils.t("charges")}</div>
            <div class="wplace-stat-value">${Math.floor(state.currentCharges)} / ${state.maxCharges}</div>
            </div>
            ${state.colorsChecked ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> Available Colors (${state.availableColors.length})</div>
                <div class="wplace-stat-colors-grid">
                    ${colorSwatchesHTML}
                </div>
            </div>
            ` : ''}
        `;
    }

    updateDataButtons = () => {
        const hasImageData = state.imageLoaded && state.imageData
        saveBtn.disabled = !hasImageData
        saveToFileBtn.disabled = !hasImageData
    }

    updateDataButtons()

    function showResizeDialog(processor) {
        let baseProcessor = processor;
        let width, height;
        if (state.originalImage?.dataUrl) {
            baseProcessor = new ImageProcessor(state.originalImage.dataUrl);
            width = state.originalImage.width;
            height = state.originalImage.height;
        } else {
            const dims = processor.getDimensions();
            width = dims.width;
            height = dims.height;
        }
        const aspectRatio = width / height;

        const rs = state.resizeSettings;
        widthSlider.max = width * 2;
        heightSlider.max = height * 2;
        let initialW = width;
        let initialH = height;
        if (rs && Number.isFinite(rs.width) && Number.isFinite(rs.height) && rs.width > 0 && rs.height > 0) {
            initialW = rs.width;
            initialH = rs.height;
        }
        // Clamp to slider ranges
        initialW = Math.max(parseInt(widthSlider.min, 10) || 10, Math.min(initialW, parseInt(widthSlider.max, 10)));
        initialH = Math.max(parseInt(heightSlider.min, 10) || 10, Math.min(initialH, parseInt(heightSlider.max, 10)));
        widthSlider.value = initialW;
        heightSlider.value = initialH;
        widthValue.textContent = initialW;
        heightValue.textContent = initialH;
        zoomSlider.value = 1;
        if (zoomValue) zoomValue.textContent = '100%';
        paintWhiteToggle.checked = state.paintWhitePixels;

        let _previewTimer = null;
        let _previewJobId = 0;
        let _isDraggingSize = false;
        let _zoomLevel = 1;
        const ensureMaskSize = (w, h) => {
            if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
                state.resizeIgnoreMask = new Uint8Array(w * h);
            }
            baseCanvas.width = w; baseCanvas.height = h;
            maskCanvas.width = w; maskCanvas.height = h;
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        };
        _updateResizePreview = async () => {
            const jobId = ++_previewJobId;
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);
            _zoomLevel = parseFloat(zoomSlider.value);

            widthValue.textContent = newWidth;
            heightValue.textContent = newHeight;

            ensureMaskSize(newWidth, newHeight);
            canvasStack.style.width = newWidth + 'px';
            canvasStack.style.height = newHeight + 'px';
            baseCtx.imageSmoothingEnabled = false;
            if (!state.availableColors || state.availableColors.length === 0) {
                if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
                    await baseProcessor.load();
                }
                baseCtx.clearRect(0, 0, newWidth, newHeight);
                baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
                // Draw mask on overlay canvas only
                maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                if (state.resizeIgnoreMask) {
                    const img = maskCtx.createImageData(newWidth, newHeight);
                    const md = img.data; const m = state.resizeIgnoreMask;
                    for (let i = 0; i < m.length; i++) if (m[i]) { const p = i * 4; md[p] = 255; md[p + 1] = 0; md[p + 2] = 0; md[p + 3] = 150; }
                    maskCtx.putImageData(img, 0, 0);
                }
                updateZoomLayout();
                return;
            }
            if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
                await baseProcessor.load();
            }
            baseCtx.clearRect(0, 0, newWidth, newHeight);
            baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
            const imgData = baseCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;

            const tThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;

            const applyFSDither = () => {
                const w = newWidth, h = newHeight;
                const n = w * h;
                const work = new Float32Array(n * 3);
                const eligible = new Uint8Array(n);
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        const i4 = idx * 4;
                        const r = data[i4], g = data[i4 + 1], b = data[i4 + 2], a = data[i4 + 3];
                        const isEligible = a >= tThresh && (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
                        eligible[idx] = isEligible ? 1 : 0;
                        work[idx * 3] = r;
                        work[idx * 3 + 1] = g;
                        work[idx * 3 + 2] = b;
                        if (!isEligible) {
                            data[i4 + 3] = 0; // transparent in preview overlay
                        }
                    }
                }

                const diffuse = (nx, ny, er, eg, eb, factor) => {
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
                    const nidx = ny * w + nx;
                    if (!eligible[nidx]) return;
                    const base = nidx * 3;
                    work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
                    work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
                    work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
                };

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        if (!eligible[idx]) continue;
                        const base = idx * 3;
                        const r0 = work[base], g0 = work[base + 1], b0 = work[base + 2];
                        const [nr, ng, nb] = Utils.findClosestPaletteColor(r0, g0, b0, state.activeColorPalette);
                        const i4 = idx * 4;
                        data[i4] = nr;
                        data[i4 + 1] = ng;
                        data[i4 + 2] = nb;
                        data[i4 + 3] = 255;

                        const er = r0 - nr;
                        const eg = g0 - ng;
                        const eb = b0 - nb;

                        diffuse(x + 1, y, er, eg, eb, 7 / 16);
                        diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                        diffuse(x, y + 1, er, eg, eb, 5 / 16);
                        diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
                    }
                }
            };

            // Skip expensive dithering while user is dragging sliders
            if (state.ditheringEnabled && !_isDraggingSize) {
                applyFSDither();
            } else {
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < tThresh || (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))) {
                        data[i + 3] = 0;
                        continue;
                    }
                    const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
                    data[i] = nr;
                    data[i + 1] = ng;
                    data[i + 2] = nb;
                    data[i + 3] = 255;
                }
            }

            if (jobId !== _previewJobId) return;
            baseCtx.putImageData(imgData, 0, 0);
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            if (state.resizeIgnoreMask) {
                const img = maskCtx.createImageData(newWidth, newHeight);
                const md = img.data; const m = state.resizeIgnoreMask;
                for (let i = 0; i < m.length; i++) if (m[i]) { const p = i * 4; md[p] = 255; md[p + 1] = 0; md[p + 2] = 0; md[p + 3] = 150; }
                maskCtx.putImageData(img, 0, 0);
            }
            updateZoomLayout();
        };

        const onWidthInput = () => {
            if (keepAspect.checked) {
                heightSlider.value = Math.round(parseInt(widthSlider.value, 10) / aspectRatio);
            }
            _updateResizePreview();
            const curW = parseInt(widthSlider.value, 10);
            const curH = parseInt(heightSlider.value, 10);
            state.resizeSettings = { baseWidth: width, baseHeight: height, width: curW, height: curH };
            saveBotSettings();
            // Auto-fit after size changes
            const fit = (typeof computeFitZoom === 'function') ? computeFitZoom() : 1;
            if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
        };

        const onHeightInput = () => {
            if (keepAspect.checked) {
                widthSlider.value = Math.round(parseInt(heightSlider.value, 10) * aspectRatio);
            }
            _updateResizePreview();
            const curW = parseInt(widthSlider.value, 10);
            const curH = parseInt(heightSlider.value, 10);
            state.resizeSettings = { baseWidth: width, baseHeight: height, width: curW, height: curH };
            saveBotSettings();
            // Auto-fit after size changes
            const fit = (typeof computeFitZoom === 'function') ? computeFitZoom() : 1;
            if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
        };

        paintWhiteToggle.onchange = (e) => {
            state.paintWhitePixels = e.target.checked;
            _updateResizePreview();
        };

        let panX = 0, panY = 0;
        const clampPan = () => {
            const wrapRect = panStage?.getBoundingClientRect() || { width: 0, height: 0 };
            const w = (baseCanvas.width || 1) * _zoomLevel;
            const h = (baseCanvas.height || 1) * _zoomLevel;
            if (w <= wrapRect.width) {
                panX = Math.floor((wrapRect.width - w) / 2);
            } else {
                const minX = wrapRect.width - w;
                panX = Math.min(0, Math.max(minX, panX));
            }
            if (h <= wrapRect.height) {
                panY = Math.floor((wrapRect.height - h) / 2);
            } else {
                const minY = wrapRect.height - h;
                panY = Math.min(0, Math.max(minY, panY));
            }
        };
        const applyPan = () => {
            clampPan();
            canvasStack.style.transform = `translate(${panX}px, ${panY}px) scale(${_zoomLevel})`;
        };

        const updateZoomLayout = () => {
            const w = baseCanvas.width || 1, h = baseCanvas.height || 1;
            baseCanvas.style.width = w + 'px';
            baseCanvas.style.height = h + 'px';
            maskCanvas.style.width = w + 'px';
            maskCanvas.style.height = h + 'px';
            canvasStack.style.width = w + 'px';
            canvasStack.style.height = h + 'px';
            applyPan();
        };
        const applyZoom = (z) => {
            _zoomLevel = Math.max(0.05, Math.min(20, z || 1));
            zoomSlider.value = _zoomLevel;
            updateZoomLayout();
            if (zoomValue) zoomValue.textContent = `${Math.round(_zoomLevel * 100)}%`;
        };
        zoomSlider.addEventListener('input', () => {
            applyZoom(parseFloat(zoomSlider.value));
        });
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => applyZoom(parseFloat(zoomSlider.value) + 0.1));
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => applyZoom(parseFloat(zoomSlider.value) - 0.1));
        const computeFitZoom = () => {
            const wrapRect = panStage?.getBoundingClientRect();
            if (!wrapRect) return 1;
            const w = baseCanvas.width || 1;
            const h = baseCanvas.height || 1;
            const margin = 10;
            const scaleX = (wrapRect.width - margin) / w;
            const scaleY = (wrapRect.height - margin) / h;
            return Math.max(0.05, Math.min(20, Math.min(scaleX, scaleY)));
        };
        if (zoomFitBtn) zoomFitBtn.addEventListener('click', () => { applyZoom(computeFitZoom()); centerInView(); });
        if (zoomActualBtn) zoomActualBtn.addEventListener('click', () => { applyZoom(1); centerInView(); });

        const centerInView = () => {
            if (!panStage) return;
            const rect = panStage.getBoundingClientRect();
            const w = (baseCanvas.width || 1) * _zoomLevel;
            const h = (baseCanvas.height || 1) * _zoomLevel;
            panX = Math.floor((rect.width - w) / 2);
            panY = Math.floor((rect.height - h) / 2);
            applyPan();
        };

        let isPanning = false; let startX = 0, startY = 0, startPanX = 0, startPanY = 0;
        let allowPan = false; // Space key
        let panMode = false;  // Explicit pan mode toggle for touch/one-button mice
        const isPanMouseButton = (e) => e.button === 1 || e.button === 2;
        const setCursor = (val) => { if (panStage) panStage.style.cursor = val; };
        const isPanActive = (e) => panMode || allowPan || isPanMouseButton(e);
        const updatePanModeBtn = () => {
            if (!panModeBtn) return;
            panModeBtn.classList.toggle('active', panMode);
            panModeBtn.setAttribute('aria-pressed', panMode ? 'true' : 'false');
        };
        if (panModeBtn) {
            updatePanModeBtn();
            panModeBtn.addEventListener('click', () => { panMode = !panMode; updatePanModeBtn(); setCursor(panMode ? 'grab' : ''); });
        }
        if (panStage) {
            panStage.addEventListener('contextmenu', (e) => { if (allowPan) e.preventDefault(); });
            window.addEventListener('keydown', (e) => { if (e.code === 'Space') { allowPan = true; setCursor('grab'); } });
            window.addEventListener('keyup', (e) => { if (e.code === 'Space') { allowPan = false; if (!isPanning) setCursor(''); } });
            panStage.addEventListener('mousedown', (e) => {
                if (!isPanActive(e)) return;
                e.preventDefault();
                isPanning = true; startX = e.clientX; startY = e.clientY; startPanX = panX; startPanY = panY;
                setCursor('grabbing');
            });
            window.addEventListener('mousemove', (e) => {
                if (!isPanning) return;
                const dx = e.clientX - startX; const dy = e.clientY - startY;
                panX = startPanX + dx; panY = startPanY + dy; applyPan();
            });
            window.addEventListener('mouseup', () => { if (isPanning) { isPanning = false; setCursor(allowPan ? 'grab' : ''); } });
            panStage.addEventListener('wheel', (e) => {
                if (!e.ctrlKey && !e.metaKey) return;
                e.preventDefault();
                const rect = panStage.getBoundingClientRect();
                const cx = e.clientX - rect.left - panX;
                const cy = e.clientY - rect.top - panY;
                const before = _zoomLevel;
                const step = Math.max(0.05, Math.min(0.5, Math.abs(e.deltaY) > 20 ? 0.2 : 0.1));
                const next = Math.max(0.05, Math.min(20, before + (e.deltaY > 0 ? -step : step)));
                if (next === before) return;
                const scale = next / before;
                panX = panX - cx * (scale - 1);
                panY = panY - cy * (scale - 1);
                applyZoom(next);
            }, { passive: false });
            let lastTouchDist = null;
            let touchStartTime = 0;
            let doubleTapTimer = null;
            panStage.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    isPanning = true; startX = t.clientX; startY = t.clientY; startPanX = panX; startPanY = panY;
                    setCursor('grabbing');
                    const now = Date.now();
                    if (now - touchStartTime < 300) {
                        // double tap -> toggle 100%/fit
                        const z = Math.abs(_zoomLevel - 1) < 0.01 ? computeFitZoom() : 1;
                        applyZoom(z);
                        centerInView();
                        if (doubleTapTimer) clearTimeout(doubleTapTimer);
                    } else {
                        touchStartTime = now;
                        doubleTapTimer = setTimeout(() => { doubleTapTimer = null; }, 320);
                    }
                } else if (e.touches.length === 2) {
                    // Pinch start
                    const [a, b] = e.touches;
                    lastTouchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
                }
            }, { passive: true });
            panStage.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && isPanning) {
                    const t = e.touches[0];
                    const dx = t.clientX - startX; const dy = t.clientY - startY;
                    panX = startPanX + dx; panY = startPanY + dy; applyPan();
                } else if (e.touches.length === 2 && lastTouchDist != null) {
                    e.preventDefault();
                    const [a, b] = e.touches;
                    const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
                    const rect = panStage.getBoundingClientRect();
                    const centerX = (a.clientX + b.clientX) / 2 - rect.left - panX;
                    const centerY = (a.clientY + b.clientY) / 2 - rect.top - panY;
                    const before = _zoomLevel;
                    const scale = dist / (lastTouchDist || dist);
                    const next = Math.max(0.05, Math.min(20, before * scale));
                    if (next !== before) {
                        panX = panX - centerX * (next / before - 1);
                        panY = panY - centerY * (next / before - 1);
                        applyZoom(next);
                    }
                    lastTouchDist = dist;
                }
            }, { passive: false });
            panStage.addEventListener('touchend', () => {
                isPanning = false; lastTouchDist = null; setCursor(panMode || allowPan ? 'grab' : '');
            });
        }
        const schedulePreview = () => {
            if (_previewTimer) clearTimeout(_previewTimer);
            const run = () => {
                _previewTimer = null;
                _updateResizePreview();
            };
            if (window.requestIdleCallback) {
                _previewTimer = setTimeout(() => requestIdleCallback(run, { timeout: 150 }), 50);
            } else {
                _previewTimer = setTimeout(() => requestAnimationFrame(run), 50);
            }
        };
        // Track dragging to reduce work and skip dithering during drag
        const markDragStart = () => { _isDraggingSize = true; };
        const markDragEnd = () => { _isDraggingSize = false; schedulePreview(); };
        widthSlider.addEventListener('pointerdown', markDragStart);
        heightSlider.addEventListener('pointerdown', markDragStart);
        widthSlider.addEventListener('pointerup', markDragEnd);
        heightSlider.addEventListener('pointerup', markDragEnd);
        widthSlider.addEventListener("input", () => { onWidthInput(); schedulePreview(); });
        heightSlider.addEventListener("input", () => { onHeightInput(); schedulePreview(); });

        // Mask painting UX: brush size, modes, row/column fills, and precise coords
        let draggingMask = false;
        let lastPaintX = -1, lastPaintY = -1;
        let brushSize = 1;
        let maskMode = 'ignore'; // 'ignore' | 'unignore' | 'toggle'
        const brushEl = resizeContainer.querySelector('#maskBrushSize');
        const brushValEl = resizeContainer.querySelector('#maskBrushSizeValue');
        const btnIgnore = resizeContainer.querySelector('#maskModeIgnore');
        const btnUnignore = resizeContainer.querySelector('#maskModeUnignore');
        const btnToggle = resizeContainer.querySelector('#maskModeToggle');
        const clearIgnoredBtnEl = resizeContainer.querySelector('#clearIgnoredBtn');
        const invertMaskBtn = resizeContainer.querySelector('#invertMaskBtn');

        const updateModeButtons = () => {
            const map = [
                [btnIgnore, 'ignore'],
                [btnUnignore, 'unignore'],
                [btnToggle, 'toggle']
            ];
            for (const [el, m] of map) {
                if (!el) continue;
                const active = maskMode === m;
                el.classList.toggle('active', active);
                el.setAttribute('aria-pressed', active ? 'true' : 'false');
            }
        };
        const setMode = (mode) => { maskMode = mode; updateModeButtons(); };
        if (brushEl && brushValEl) {
            brushEl.addEventListener('input', () => { brushSize = parseInt(brushEl.value, 10) || 1; brushValEl.textContent = brushSize; });
            brushValEl.textContent = brushEl.value;
            brushSize = parseInt(brushEl.value, 10) || 1;
        }
        if (btnIgnore) btnIgnore.addEventListener('click', () => setMode('ignore'));
        if (btnUnignore) btnUnignore.addEventListener('click', () => setMode('unignore'));
        if (btnToggle) btnToggle.addEventListener('click', () => setMode('toggle'));
        // Initialize button state (default to toggle mode)
        updateModeButtons();

        const mapClientToPixel = (clientX, clientY) => {
            // Compute without rounding until final step to avoid drift at higher zoom
            const rect = baseCanvas.getBoundingClientRect();
            const scaleX = rect.width / baseCanvas.width;
            const scaleY = rect.height / baseCanvas.height;
            const dx = (clientX - rect.left) / scaleX;
            const dy = (clientY - rect.top) / scaleY;
            const x = Math.floor(dx);
            const y = Math.floor(dy);
            return { x, y };
        };

        const ensureMask = (w, h) => {
            if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
                state.resizeIgnoreMask = new Uint8Array(w * h);
            }
        };

        const paintCircle = (cx, cy, radius, value) => {
            const w = baseCanvas.width, h = baseCanvas.height;
            ensureMask(w, h);
            const r2 = radius * radius;
            for (let yy = cy - radius; yy <= cy + radius; yy++) {
                if (yy < 0 || yy >= h) continue;
                for (let xx = cx - radius; xx <= cx + radius; xx++) {
                    if (xx < 0 || xx >= w) continue;
                    const dx = xx - cx, dy = yy - cy;
                    if (dx * dx + dy * dy <= r2) {
                        const idx = yy * w + xx;
                        if (maskMode === 'toggle') {
                            state.resizeIgnoreMask[idx] = state.resizeIgnoreMask[idx] ? 0 : 1;
                        } else if (maskMode === 'ignore') {
                            state.resizeIgnoreMask[idx] = 1;
                        } else {
                            state.resizeIgnoreMask[idx] = 0;
                        }
                    }
                }
            }
        };

        const paintRow = (y, value) => {
            const w = baseCanvas.width, h = baseCanvas.height;
            ensureMask(w, h);
            if (y < 0 || y >= h) return;
            for (let x = 0; x < w; x++) {
                const idx = y * w + x;
                if (maskMode === 'toggle') {
                    state.resizeIgnoreMask[idx] = state.resizeIgnoreMask[idx] ? 0 : 1;
                } else if (maskMode === 'ignore') {
                    state.resizeIgnoreMask[idx] = 1;
                } else {
                    state.resizeIgnoreMask[idx] = 0;
                }
            }
        };

        const paintColumn = (x, value) => {
            const w = baseCanvas.width, h = baseCanvas.height;
            ensureMask(w, h);
            if (x < 0 || x >= w) return;
            for (let y = 0; y < h; y++) {
                const idx = y * w + x;
                if (maskMode === 'toggle') {
                    state.resizeIgnoreMask[idx] = state.resizeIgnoreMask[idx] ? 0 : 1;
                } else if (maskMode === 'ignore') {
                    state.resizeIgnoreMask[idx] = 1;
                } else {
                    state.resizeIgnoreMask[idx] = 0;
                }
            }
        };

        const redrawMaskOverlay = () => {
            const w = baseCanvas.width, h = baseCanvas.height;
            maskCanvas.width = w; maskCanvas.height = h;
            maskCtx.clearRect(0, 0, w, h);
            if (!state.resizeIgnoreMask) return;
            // Draw ignored pixels as semi-transparent red squares
            const img = maskCtx.createImageData(w, h);
            const md = img.data;
            for (let i = 0; i < state.resizeIgnoreMask.length; i++) {
                if (state.resizeIgnoreMask[i]) {
                    const p = i * 4;
                    md[p] = 255; md[p + 1] = 0; md[p + 2] = 0; md[p + 3] = 150;
                }
            }
            maskCtx.putImageData(img, 0, 0);
        };

        const handlePaint = (e) => {
            // Suppress painting while panning
            if ((e.buttons & 4) === 4 || (e.buttons & 2) === 2 || allowPan) return;
            const { x, y } = mapClientToPixel(e.clientX, e.clientY);
            const w = baseCanvas.width, h = baseCanvas.height;
            if (x < 0 || y < 0 || x >= w || y >= h) return;
            const radius = Math.max(1, Math.floor(brushSize / 2));
            if (e.shiftKey) {
                paintRow(y);
            } else if (e.altKey) {
                paintColumn(x);
            } else {
                paintCircle(x, y, radius);
            }
            lastPaintX = x; lastPaintY = y;
            redrawMaskOverlay();
        };

        maskCanvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || e.button === 2 || allowPan) return; // let pan handler manage
            draggingMask = true; handlePaint(e);
        });
        // Avoid hijacking touch gestures for panning/zooming
        maskCanvas.addEventListener('touchstart', (e) => { /* let panStage handle */ }, { passive: true });
        maskCanvas.addEventListener('touchmove', (e) => { /* let panStage handle */ }, { passive: true });
        maskCanvas.addEventListener('touchend', (e) => { /* let panStage handle */ }, { passive: true });
        window.addEventListener('mousemove', (e) => { if (draggingMask) handlePaint(e); });
        window.addEventListener('mouseup', () => { if (draggingMask) { draggingMask = false; saveBotSettings(); } });

        if (clearIgnoredBtnEl) clearIgnoredBtnEl.addEventListener('click', () => {
            if (state.resizeIgnoreMask) state.resizeIgnoreMask.fill(0);
            redrawMaskOverlay();
            _updateResizePreview();
            saveBotSettings();
        });

        if (invertMaskBtn) invertMaskBtn.addEventListener('click', () => {
            if (!state.resizeIgnoreMask) return;
            for (let i = 0; i < state.resizeIgnoreMask.length; i++) state.resizeIgnoreMask[i] = state.resizeIgnoreMask[i] ? 0 : 1;
            redrawMaskOverlay();
            _updateResizePreview();
            saveBotSettings();
        });

        confirmResize.onclick = async () => {
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);

            // Generate the final paletted image data
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            tempCtx.imageSmoothingEnabled = false;
            if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
                await baseProcessor.load();
            }
            tempCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
            const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;
            const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
            let totalValidPixels = 0;
            const mask = (state.resizeIgnoreMask && state.resizeIgnoreMask.length === newWidth * newHeight) ? state.resizeIgnoreMask : null;

            const applyFSDitherFinal = async () => {
                const w = newWidth, h = newHeight;
                const n = w * h;
                const work = new Float32Array(n * 3);
                const eligible = new Uint8Array(n);
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        const i4 = idx * 4;
                        const r = data[i4], g = data[i4 + 1], b = data[i4 + 2], a = data[i4 + 3];
                        const masked = mask && mask[idx];
                        const isEligible = !masked && a >= tThresh2 && (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
                        eligible[idx] = isEligible ? 1 : 0;
                        work[idx * 3] = r;
                        work[idx * 3 + 1] = g;
                        work[idx * 3 + 2] = b;
                        if (!isEligible) {
                            data[i4 + 3] = 0;
                        }
                    }
                    // Yield to keep UI responsive
                    if ((y & 15) === 0) await Promise.resolve();
                }

                const diffuse = (nx, ny, er, eg, eb, factor) => {
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
                    const nidx = ny * w + nx;
                    if (!eligible[nidx]) return;
                    const base = nidx * 3;
                    work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
                    work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
                    work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
                };

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        if (!eligible[idx]) continue;
                        const base = idx * 3;
                        const r0 = work[base], g0 = work[base + 1], b0 = work[base + 2];
                        const [nr, ng, nb] = Utils.findClosestPaletteColor(r0, g0, b0, state.activeColorPalette);
                        const i4 = idx * 4;
                        data[i4] = nr;
                        data[i4 + 1] = ng;
                        data[i4 + 2] = nb;
                        data[i4 + 3] = 255;
                        totalValidPixels++;

                        const er = r0 - nr;
                        const eg = g0 - ng;
                        const eb = b0 - nb;

                        diffuse(x + 1, y, er, eg, eb, 7 / 16);
                        diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                        diffuse(x, y + 1, er, eg, eb, 5 / 16);
                        diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
                    }
                    // Yield every row to reduce jank
                    await Promise.resolve();
                }
            };

            if (state.ditheringEnabled) {
                await applyFSDitherFinal();
            } else {
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    const masked = mask && mask[(i >> 2)];
                    const isTransparent = a < tThresh2 || masked;
                    const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);
                    if (isTransparent || isWhiteAndSkipped) {
                        data[i + 3] = 0; // overlay transparency
                        continue;
                    }
                    totalValidPixels++;
                    const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
                    data[i] = nr;
                    data[i + 1] = ng;
                    data[i + 2] = nb;
                    data[i + 3] = 255;
                }
            }
            tempCtx.putImageData(imgData, 0, 0);

            // Save the final pixel data for painting
            // Persist the paletted (and possibly dithered) pixels so painting uses the same output seen in overlay
            const palettedPixels = new Uint8ClampedArray(imgData.data);
            state.imageData.pixels = palettedPixels;
            state.imageData.width = newWidth;
            state.imageData.height = newHeight;
            state.imageData.totalPixels = totalValidPixels;
            state.totalPixels = totalValidPixels;
            state.paintedPixels = 0;

            state.resizeSettings = { baseWidth: width, baseHeight: height, width: newWidth, height: newHeight };
            saveBotSettings();

            const finalImageBitmap = await createImageBitmap(tempCanvas);
            await overlayManager.setImage(finalImageBitmap);
            overlayManager.enable();
            toggleOverlayBtn.classList.add('active');
            toggleOverlayBtn.setAttribute('aria-pressed', 'true');

            // Keep state.imageData.processor as the original-based source; painting uses paletted pixels already stored

            updateStats();
            updateUI("resizeSuccess", "success", { width: newWidth, height: newHeight });
            closeResizeDialog();
        };

        downloadPreviewBtn.onclick = () => {
            try {
                const w = baseCanvas.width, h = baseCanvas.height;
                const out = document.createElement('canvas');
                out.width = w; out.height = h;
                const octx = out.getContext('2d');
                octx.imageSmoothingEnabled = false;
                octx.drawImage(baseCanvas, 0, 0);
                octx.drawImage(maskCanvas, 0, 0);
                const link = document.createElement('a');
                link.download = 'wplace-preview.png';
                link.href = out.toDataURL();
                link.click();
            } catch (e) { console.warn('Failed to download preview:', e); }
        };

        cancelResize.onclick = closeResizeDialog;

        resizeOverlay.style.display = "block";
        resizeContainer.style.display = "block";

        // Reinitialize color palette with current available colors
        initializeColorPalette(resizeContainer);

        _updateResizePreview();
        setTimeout(() => {
            if (typeof computeFitZoom === 'function') {
                const z = computeFitZoom();
                if (!isNaN(z) && isFinite(z)) {
                    applyZoom(z);
                    centerInView();
                }
            } else {
                centerInView();
            }
        }, 0);
    }

    function closeResizeDialog() {
        resizeOverlay.style.display = "none";
        resizeContainer.style.display = "none";
        _updateResizePreview = () => { };
    }

    if (uploadBtn) {
        uploadBtn.addEventListener("click", async () => {
            const availableColors = Utils.extractAvailableColors();
            if (availableColors.length < 10) {
                updateUI("noColorsFound", "error");
                Utils.showAlert(Utils.t("noColorsFound"), "error");
                return;
            }

            if (!state.colorsChecked) {
                state.availableColors = availableColors;
                state.colorsChecked = true;
                updateUI("colorsFound", "success", { count: availableColors.length });
                updateStats();
                selectPosBtn.disabled = false;
                // Only enable resize button if image is also loaded
                if (state.imageLoaded) {
                    resizeBtn.disabled = false;
                }
            }

            try {
                updateUI("loadingImage", "default")
                const imageSrc = await Utils.createImageUploader()
                if (!imageSrc) {
                    updateUI("colorsFound", "success", { count: state.availableColors.length });
                    return;
                }

                const processor = new ImageProcessor(imageSrc)
                await processor.load()

                const { width, height } = processor.getDimensions()
                const pixels = processor.getPixelData()

                let totalValidPixels = 0;
                for (let i = 0; i < pixels.length; i += 4) {
                    const isTransparent = pixels[i + 3] < (state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD);
                    const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(pixels[i], pixels[i + 1], pixels[i + 2]);
                    if (!isTransparent && !isWhiteAndSkipped) {
                        totalValidPixels++;
                    }
                }

                state.imageData = {
                    width,
                    height,
                    pixels,
                    totalPixels: totalValidPixels,
                    processor,
                }

                state.totalPixels = totalValidPixels
                state.paintedPixels = 0
                state.imageLoaded = true
                state.lastPosition = { x: 0, y: 0 }
                // New image: clear previous resize settings
                state.resizeSettings = null;
                // Also clear any previous ignore mask
                state.resizeIgnoreMask = null;
                // Save original image for this browser (dataUrl + dims)
                state.originalImage = { dataUrl: imageSrc, width, height };
                saveBotSettings();
                saveBotSettings();

                // Use the original image for the overlay initially
                const imageBitmap = await createImageBitmap(processor.img);
                await overlayManager.setImage(imageBitmap);
                overlayManager.enable();
                toggleOverlayBtn.disabled = false;
                toggleOverlayBtn.classList.add('active');
                toggleOverlayBtn.setAttribute('aria-pressed', 'true');

                // Only enable resize button if colors have also been captured
                if (state.colorsChecked) {
                    resizeBtn.disabled = false;
                }
                saveBtn.disabled = false

                if (state.startPosition) {
                    startBtn.disabled = false
                }

                updateStats()
                updateDataButtons()
                updateUI("imageLoaded", "success", { count: totalValidPixels })
            } catch {
                updateUI("imageError", "error")
            }
        })
    }

    if (resizeBtn) {
        resizeBtn.addEventListener("click", () => {
            if (state.imageLoaded && state.imageData.processor && state.colorsChecked) {
                showResizeDialog(state.imageData.processor)
            } else if (!state.colorsChecked) {
                Utils.showAlert("Please upload an image first to capture available colors", "warning")
            }
        })
    }

    if (selectPosBtn) {
        selectPosBtn.addEventListener("click", async () => {
            if (state.selectingPosition) return

            state.selectingPosition = true
            state.startPosition = null
            state.region = null
            startBtn.disabled = true

            Utils.showAlert(Utils.t("selectPositionAlert"), "info")
            updateUI("waitingPosition", "default")

            const tempFetch = async (url, options) => {
                if (
                    typeof url === "string" &&
                    url.includes("https://backend.wplace.live/s0/pixel/") &&
                    options?.method?.toUpperCase() === "POST"
                ) {
                    try {
                        const response = await originalFetch(url, options)
                        const clonedResponse = response.clone()
                        const data = await clonedResponse.json()

                        if (data?.painted === 1) {
                            const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/)
                            if (regionMatch && regionMatch.length >= 3) {
                                state.region = {
                                    x: Number.parseInt(regionMatch[1]),
                                    y: Number.parseInt(regionMatch[2]),
                                }
                            }

                            const payload = JSON.parse(options.body)
                            if (payload?.coords && Array.isArray(payload.coords)) {
                                state.startPosition = {
                                    x: payload.coords[0],
                                    y: payload.coords[1],
                                }
                                state.lastPosition = { x: 0, y: 0 }

                                await overlayManager.setPosition(state.startPosition, state.region);

                                if (state.imageLoaded) {
                                    startBtn.disabled = false
                                }

                                window.fetch = originalFetch
                                state.selectingPosition = false
                                updateUI("positionSet", "success")
                            }
                        }

                        return response
                    } catch {
                        return originalFetch(url, options)
                    }
                }
                return originalFetch(url, options)
            }

            const originalFetch = window.fetch;
            window.fetch = tempFetch;

            setTimeout(() => {
                if (state.selectingPosition) {
                    window.fetch = originalFetch
                    state.selectingPosition = false
                    updateUI("positionTimeout", "error")
                    Utils.showAlert(Utils.t("positionTimeout"), "error")
                }
            }, 120000)
        })
    }

    async function startPainting() {
        if (!state.imageLoaded || !state.startPosition || !state.region) {
            updateUI("missingRequirements", "error")
            return false
        }
        await ensureToken()
        if (!turnstileToken) return false

        state.running = true
        state.stopFlag = false
        startBtn.disabled = true
        stopBtn.disabled = false
        uploadBtn.disabled = true
        selectPosBtn.disabled = true
        resizeBtn.disabled = true
        saveBtn.disabled = true
        toggleOverlayBtn.disabled = true;

        updateUI("startPaintingMsg", "success")

        try {
            await processImage()
            return true
        } catch {
            updateUI("paintingError", "error")
            return false
        } finally {
            state.running = false
            stopBtn.disabled = true
            saveBtn.disabled = false

            if (!state.stopFlag) {
                startBtn.disabled = true
                uploadBtn.disabled = false
                selectPosBtn.disabled = false
                resizeBtn.disabled = false
            } else {
                startBtn.disabled = false
            }
            toggleOverlayBtn.disabled = false;
        }
    }

    if (startBtn) {
        startBtn.addEventListener("click", startPainting)
    }

    if (stopBtn) {
        stopBtn.addEventListener("click", () => {
            state.stopFlag = true
            state.running = false
            stopBtn.disabled = true
            updateUI("paintingStopped", "warning")

            if (state.imageLoaded && state.paintedPixels > 0) {
                Utils.saveProgress()
                Utils.showAlert(Utils.t("autoSaved"), "success")
            }
        })
    }

    const checkSavedProgress = () => {
        const savedData = Utils.loadProgress()
        if (savedData && savedData.state.paintedPixels > 0) {
            const savedDate = new Date(savedData.timestamp).toLocaleString()
            const progress = Math.round((savedData.state.paintedPixels / savedData.state.totalPixels) * 100)

            Utils.showAlert(
                `${Utils.t("savedDataFound")}\n\n` +
                `Saved: ${savedDate}\n` +
                `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
                `${Utils.t("clickLoadToContinue")}`,
                "info",
            )
        }
    }

    setTimeout(checkSavedProgress, 1000)

    if (cooldownSlider && cooldownValue) {
        cooldownSlider.addEventListener("input", (e) => {
            const threshold = parseInt(e.target.value);
            state.cooldownChargeThreshold = threshold;
            cooldownValue.textContent = threshold;
            saveBotSettings();
        });
    }

    loadBotSettings();
}
