import { state } from './state';

export class OverlayManager {
    constructor() {
        this.isEnabled = false;
        this.startCoords = null; // { region: {x, y}, pixel: {x, y} }
        this.imageBitmap = null;
        this.chunkedTiles = new Map(); // Map<"tileX,tileY", ImageBitmap>
        this.tileSize = 1000;
        this.processPromise = null; // Track ongoing processing
        this.lastProcessedHash = null; // Cache invalidation
        this.workerPool = null; // Web worker pool for heavy processing
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        console.log(`Overlay ${this.isEnabled ? 'enabled' : 'disabled'}.`);
        return this.isEnabled;
    }

    enable() { this.isEnabled = true; }
    disable() { this.isEnabled = false; }
    clear() {
        this.disable();
        this.imageBitmap = null;
        this.chunkedTiles.clear();
        this.lastProcessedHash = null;
        if (this.processPromise) {
            this.processPromise = null;
        }
    }

    async setImage(imageBitmap) {
        this.imageBitmap = imageBitmap;
        this.lastProcessedHash = null; // Invalidate cache
        if (this.imageBitmap && this.startCoords) {
            await this.processImageIntoChunks();
        }
    }

    async setPosition(startPosition, region) {
        if (!startPosition || !region) {
            this.startCoords = null;
            this.chunkedTiles.clear();
            this.lastProcessedHash = null;
            return;
        }
        this.startCoords = { region, pixel: startPosition };
        this.lastProcessedHash = null; // Invalidate cache
        if (this.imageBitmap) {
            await this.processImageIntoChunks();
        }
    }

    // Generate hash for cache invalidation
    _generateProcessHash() {
        if (!this.imageBitmap || !this.startCoords) return null;
        const { width, height } = this.imageBitmap;
        const { x: px, y: py } = this.startCoords.pixel;
        const { x: rx, y: ry } = this.startCoords.region;
        return `${width}x${height}_${px},${py}_${rx},${ry}_${state.blueMarbleEnabled}_${state.overlayOpacity}`;
    }

    // --- OVERLAY UPDATE: Optimized chunking with caching and batch processing ---
    async processImageIntoChunks() {
        if (!this.imageBitmap || !this.startCoords) return;

        // Check if we're already processing to avoid duplicate work
        if (this.processPromise) {
            return this.processPromise;
        }

        // Check cache validity
        const currentHash = this._generateProcessHash();
        if (this.lastProcessedHash === currentHash && this.chunkedTiles.size > 0) {
            console.log(`📦 Using cached overlay chunks (${this.chunkedTiles.size} tiles)`);
            return;
        }

        // Start processing
        this.processPromise = this._doProcessImageIntoChunks();
        try {
            await this.processPromise;
            this.lastProcessedHash = currentHash;
        } finally {
            this.processPromise = null;
        }
    }

    async _doProcessImageIntoChunks() {
        const startTime = performance.now();
        this.chunkedTiles.clear();

        const { width: imageWidth, height: imageHeight } = this.imageBitmap;
        const { x: startPixelX, y: startPixelY } = this.startCoords.pixel;
        const { x: startRegionX, y: startRegionY } = this.startCoords.region;

        const endPixelX = startPixelX + imageWidth;
        const endPixelY = startPixelY + imageHeight;

        const startTileX = startRegionX + Math.floor(startPixelX / this.tileSize);
        const startTileY = startRegionY + Math.floor(startPixelY / this.tileSize);
        const endTileX = startRegionX + Math.floor(endPixelX / this.tileSize);
        const endTileY = startRegionY + Math.floor(endPixelY / this.tileSize);

        const totalTiles = (endTileX - startTileX + 1) * (endTileY - startTileY + 1);
        console.log(`🔄 Processing ${totalTiles} overlay tiles...`);

        // Process tiles in batches to avoid blocking the main thread
        const batchSize = 4; // Process 4 tiles at a time
        const tilesToProcess = [];

        for (let ty = startTileY; ty <= endTileY; ty++) {
            for (let tx = startTileX; tx <= endTileX; tx++) {
                tilesToProcess.push({ tx, ty });
            }
        }

        // Process tiles in batches with yielding
        for (let i = 0; i < tilesToProcess.length; i += batchSize) {
            const batch = tilesToProcess.slice(i, i + batchSize);

            await Promise.all(batch.map(async ({ tx, ty }) => {
                const tileKey = `${tx},${ty}`;
                const chunkBitmap = await this._processTile(tx, ty, imageWidth, imageHeight, startPixelX, startPixelY, startRegionX, startRegionY);
                if (chunkBitmap) {
                    this.chunkedTiles.set(tileKey, chunkBitmap);
                }
            }));

            // Yield control to prevent blocking
            if (i + batchSize < tilesToProcess.length) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        const processingTime = performance.now() - startTime;
        console.log(`✅ Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round(processingTime)}ms`);
    }

    async _processTile(tx, ty, imageWidth, imageHeight, startPixelX, startPixelY, startRegionX, startRegionY) {
        const tileKey = `${tx},${ty}`;

        // Calculate the portion of the image that overlaps with this tile
        const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
        const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;

        // Crop coordinates within the source image
        const sX = Math.max(0, imgStartX);
        const sY = Math.max(0, imgStartY);
        const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
        const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));

        if (sW <= 0 || sH <= 0) return null;

        // Destination coordinates on the new chunk canvas
        const dX = Math.max(0, -imgStartX);
        const dY = Math.max(0, -imgStartY);

        const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
        const chunkCtx = chunkCanvas.getContext('2d');
        chunkCtx.imageSmoothingEnabled = false;

        chunkCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, dX, dY, sW, sH);

        // --- OPTIMIZED: Blue marble effect with faster pixel manipulation ---
        if (state.blueMarbleEnabled) {
            const imageData = chunkCtx.getImageData(dX, dY, sW, sH);
            const data = imageData.data;

            // Faster pixel manipulation using typed arrays
            for (let i = 0; i < data.length; i += 4) {
                const pixelIndex = i / 4;
                const pixelY = Math.floor(pixelIndex / sW);
                const pixelX = pixelIndex % sW;

                if ((pixelX + pixelY) % 2 === 0 && data[i + 3] > 0) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            chunkCtx.putImageData(imageData, dX, dY);
        }

        return await chunkCanvas.transferToImageBitmap();
    }

    // --- OVERLAY UPDATE: Optimized compositing with caching ---
    async processAndRespondToTileRequest(eventData) {
        const { endpoint, blobID, blobData } = eventData;

        let finalBlob = blobData;

        if (this.isEnabled && this.chunkedTiles.size > 0) {
            const tileMatch = endpoint.match(/(\d+)\/(\d+)\.png/);
            if (tileMatch) {
                const tileX = parseInt(tileMatch[1], 10);
                const tileY = parseInt(tileMatch[2], 10);
                const tileKey = `${tileX},${tileY}`;

                const chunkBitmap = this.chunkedTiles.get(tileKey);
                if (chunkBitmap) {
                    try {
                        // Use faster compositing for better performance
                        finalBlob = await this._compositeTileOptimized(blobData, chunkBitmap);
                    } catch (e) {
                        console.error("Error compositing overlay:", e);
                        // Fallback to original tile on error
                        finalBlob = blobData;
                    }
                }
            }
        }

        // Send the (possibly modified) blob back to the injected script
        window.postMessage({
            source: 'auto-image-overlay',
            blobID: blobID,
            blobData: finalBlob
        }, '*');
    }

    async _compositeTileOptimized(originalBlob, overlayBitmap) {
        const originalBitmap = await createImageBitmap(originalBlob);
        const canvas = new OffscreenCanvas(originalBitmap.width, originalBitmap.height);
        const ctx = canvas.getContext('2d');

        // Disable antialiasing for pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;

        // Draw original tile first
        ctx.drawImage(originalBitmap, 0, 0);

        // Set opacity and draw overlay with optimized blend mode
        ctx.globalAlpha = state.overlayOpacity;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(overlayBitmap, 0, 0);

        // Use faster blob conversion with compression settings
        return await canvas.convertToBlob({
            type: 'image/png',
            quality: 0.95 // Slight compression for faster processing
        });
    }
}
