/**
 * Snake Ranch Game - Based on Mozilla's tile game engine
 * SMRI: S11.2,10.04
 * Adapted from: https://github.com/mozdevs/gamedev-js-tiles
 */

export class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.version = '0.7.84';
        this.smri = 'S11.2,10.04';
        
        this._previousElapsed = 0;
        this.isRunning = false;
        
        // Map configuration
        this.map = {
            cols: 30,
            rows: 20,
            tsize: 32,
            layers: [],
            getTile: function(layer, col, row) {
                return this.layers[layer][row * this.cols + col];
            }
        };
        
        // Player
        this.player = {
            x: 480,      // pixel position
            y: 576,
            width: 32,
            height: 32,
            speed: 128   // pixels per second
        };
        
        // Camera
        this.camera = null;
        
        // Keyboard
        this.keys = {};
        this.setupInput();
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
            if ([37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });
    }
    
    isKeyDown(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    async init() {
        // Set canvas size
        this.canvas.width = 960;
        this.canvas.height = 640;
        this.canvas.style.width = '960px';
        this.canvas.style.height = '640px';
        
        // Disable smoothing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;
        
        // Generate map data
        this.generateMap();
        
        // Initialize camera
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            maxX: this.map.cols * this.map.tsize - this.canvas.width,
            maxY: this.map.rows * this.map.tsize - this.canvas.height
        };
    }
    
    generateMap() {
        const cols = this.map.cols;
        const rows = this.map.rows;
        
        // Layer 0: Base terrain (grass, dirt, water)
        const baseLayer = [];
        // Layer 1: Objects (buildings, fences, trees)
        const objectLayer = [];
        
        // Fill with grass
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                baseLayer.push(1); // grass
                objectLayer.push(0); // empty
            }
        }
        
        // Helper to set tile
        const setTile = (layer, x, y, tile) => {
            if (x >= 0 && x < cols && y >= 0 && y < rows) {
                layer[y * cols + x] = tile;
            }
        };
        
        // Dirt paths
        for (let x = 10; x < 20; x++) setTile(baseLayer, x, 10, 2); // horizontal path
        for (let y = 5; y < 15; y++) setTile(baseLayer, 15, y, 2); // vertical path
        
        // Shop building (top center)
        for (let y = 3; y < 8; y++) {
            for (let x = 12; x < 18; x++) {
                if (y === 3 || y === 7 || x === 12 || x === 17) {
                    setTile(objectLayer, x, y, 3); // wall
                } else {
                    setTile(objectLayer, x, y, 4); // floor
                }
            }
        }
        setTile(objectLayer, 15, 7, 5); // door
        
        // Breeding facility (left side)
        for (let y = 8; y < 14; y++) {
            for (let x = 4; x < 11; x++) {
                if (y === 8 || y === 13 || x === 4 || x === 10) {
                    setTile(objectLayer, x, y, 3); // wall
                } else {
                    setTile(objectLayer, x, y, 4); // floor
                }
            }
        }
        setTile(objectLayer, 4, 11, 5); // door
        
        // Pond (bottom right)
        for (let y = 15; y < 18; y++) {
            for (let x = 22; x < 27; x++) {
                setTile(baseLayer, x, y, 6); // water
            }
        }
        
        // Trees for decoration
        setTile(objectLayer, 5, 5, 7);
        setTile(objectLayer, 25, 8, 7);
        setTile(objectLayer, 8, 16, 7);
        
        // Fences
        for (let x = 18; x < 24; x++) {
            setTile(objectLayer, x, 7, 8);
            setTile(objectLayer, x, 14, 8);
        }
        for (let y = 8; y < 14; y++) {
            setTile(objectLayer, 18, y, 8);
            setTile(objectLayer, 23, y, 8);
        }
        
        this.map.layers = [baseLayer, objectLayer];
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop(0);
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop = (elapsed) => {
        if (!this.isRunning) return;
        
        window.requestAnimationFrame(this.gameLoop);
        
        // Clear frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate delta time
        const delta = (elapsed - this._previousElapsed) / 1000.0;
        this._previousElapsed = elapsed;
        
        this.update(Math.min(delta, 0.25));
        this.render();
    }
    
    update(delta) {
        // Player movement
        let dirx = 0, diry = 0;
        if (this.isKeyDown(37) || this.isKeyDown(65)) dirx = -1; // left
        if (this.isKeyDown(39) || this.isKeyDown(68)) dirx = 1;  // right
        if (this.isKeyDown(38) || this.isKeyDown(87)) diry = -1; // up
        if (this.isKeyDown(40) || this.isKeyDown(83)) diry = 1;  // down
        
        // Move player
        this.player.x += dirx * this.player.speed * delta;
        this.player.y += diry * this.player.speed * delta;
        
        // Clamp to map bounds
        this.player.x = Math.max(0, Math.min(this.player.x, 
            this.map.cols * this.map.tsize - this.player.width));
        this.player.y = Math.max(0, Math.min(this.player.y, 
            this.map.rows * this.map.tsize - this.player.height));
        
        // Update camera to follow player
        this.camera.x = this.player.x - this.camera.width / 2 + this.player.width / 2;
        this.camera.y = this.player.y - this.camera.height / 2 + this.player.height / 2;
        
        // Clamp camera
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.camera.maxX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.camera.maxY));
    }
    
    drawLayer(layer) {
        const startCol = Math.floor(this.camera.x / this.map.tsize);
        const endCol = startCol + Math.ceil(this.camera.width / this.map.tsize);
        const startRow = Math.floor(this.camera.y / this.map.tsize);
        const endRow = startRow + Math.ceil(this.camera.height / this.map.tsize);
        const offsetX = -this.camera.x + startCol * this.map.tsize;
        const offsetY = -this.camera.y + startRow * this.map.tsize;
        
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                if (c < 0 || c >= this.map.cols || r < 0 || r >= this.map.rows) continue;
                
                const tile = this.map.getTile(layer, c, r);
                if (tile === 0) continue; // empty
                
                const x = (c - startCol) * this.map.tsize + offsetX;
                const y = (r - startRow) * this.map.tsize + offsetY;
                
                this.drawTile(tile, x, y);
            }
        }
    }
    
    drawTile(tile, x, y) {
        const ts = this.map.tsize;
        
        switch(tile) {
            case 1: // Grass
                this.ctx.fillStyle = '#6b8e23';
                this.ctx.fillRect(x, y, ts, ts);
                this.ctx.fillStyle = '#5a7a1a';
                if ((x + y) % 64 === 0) {
                    this.ctx.fillRect(x + 4, y + 4, 4, 4);
                    this.ctx.fillRect(x + 20, y + 16, 4, 4);
                }
                break;
            case 2: // Dirt path
                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(x, y, ts, ts);
                this.ctx.fillStyle = '#6b5335';
                this.ctx.fillRect(x + 8, y + 8, 4, 4);
                this.ctx.fillRect(x + 16, y + 20, 4, 4);
                break;
            case 3: // Wall
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(x, y, ts, ts);
                this.ctx.strokeStyle = '#4a3218';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 1, y + 1, ts - 2, ts - 2);
                break;
            case 4: // Floor
                this.ctx.fillStyle = '#d4a574';
                this.ctx.fillRect(x, y, ts, ts);
                this.ctx.strokeStyle = '#c49564';
                this.ctx.strokeRect(x, y, ts, ts);
                break;
            case 5: // Door
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(x + 8, y, ts - 16, ts);
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(x + 12, y + 16, 8, 8);
                break;
            case 6: // Water
                this.ctx.fillStyle = '#4a7ba7';
                this.ctx.fillRect(x, y, ts, ts);
                this.ctx.fillStyle = '#6a9bc7';
                this.ctx.fillRect(x + 6, y + 6, 12, 12);
                break;
            case 7: // Tree
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(x + 12, y + 16, 8, 16);
                this.ctx.fillStyle = '#2d5016';
                this.ctx.beginPath();
                this.ctx.arc(x + 16, y + 12, 12, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 8: // Fence
                this.ctx.fillStyle = '#6b5335';
                this.ctx.fillRect(x + 12, y, 8, ts);
                this.ctx.fillRect(x + 4, y + 12, ts - 8, 8);
                break;
        }
    }
    
    drawPlayer() {
        const x = this.player.x - this.camera.x;
        const y = this.player.y - this.camera.y;
        const w = this.player.width;
        const h = this.player.height;
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(x + w/2, y + h - 4, w/3, h/6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Body
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(x + 8, y + 12, 16, 18);
        
        // Head
        this.ctx.fillStyle = '#ffc896';
        this.ctx.fillRect(x + 10, y + 6, 12, 12);
        
        // Hair
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x + 10, y + 4, 12, 6);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + 12, y + 10, 2, 2);
        this.ctx.fillRect(x + 18, y + 10, 2, 2);
    }
    
    render() {
        // Draw base terrain layer
        this.drawLayer(0);
        
        // Draw player
        this.drawPlayer();
        
        // Draw objects layer (buildings, trees, etc)
        this.drawLayer(1);
        
        // Draw UI
        this.drawUI();
    }
    
    drawUI() {
        // Top bar
        this.ctx.fillStyle = 'rgba(42, 24, 16, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, 40);
        
        // Title
        this.ctx.fillStyle = '#8ab060';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🐍 SNAKE RANCH', 16, 26);
        
        // Controls
        this.ctx.fillStyle = '#a0c070';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('WASD/Arrows to move', this.canvas.width - 16, 26);
        
        // Position
        const tileX = Math.floor(this.player.x / this.map.tsize);
        const tileY = Math.floor(this.player.y / this.map.tsize);
        this.ctx.fillText(`Pos: ${tileX}, ${tileY}`, this.canvas.width - 16, 56);
    }
}
