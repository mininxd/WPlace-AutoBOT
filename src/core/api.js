import { CONFIG } from '../config';
import { ensureToken, setTurnstileToken } from './turnstile';

export const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
        try {
            const token = await ensureToken();
            if (!token) {
                return "token_error";
            }
            const payload = { coords: [pixelX, pixelY], colors: [color], t: token };
            const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=UTF-8" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (res.status === 403) {
                console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired.");
                setTurnstileToken(null); // Invalidate the token
                return "token_error";
            }
            const data = await res.json();
            return data?.painted === 1;
        } catch (e) {
            console.error("Paint request failed:", e);
            return false;
        }
    },

    async getCharges() {
        try {
            const res = await fetch("https://backend.wplace.live/me", {
                credentials: "include",
            });
            const data = await res.json();
            return {
                charges: data.charges?.count || 0,
                max: data.charges?.max || 1,
                cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
            };
        } catch (e) {
            console.error("Failed to get charges:", e);
            return {
                charges: 0,
                max: 1,
                cooldown: CONFIG.COOLDOWN_DEFAULT,
            };
        }
    },
};
