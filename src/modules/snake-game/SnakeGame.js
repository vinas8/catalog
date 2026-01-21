/**
 * Snake Ranch Game - Stardew Valley style pixel art ranch simulator
 * SMRI: S11.2,10.02
 */

import { VERSION_CONFIG } from '../../config/version.js';

export class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.version = VERSION_CONFIG.DISPLAY;
        this.smri = 'S11.2,10.03';
        
        // Game dimensions (internal pixel resolution)
        this.width = 480;
        this.height = 320;
        this.scale = 2;
        this.tileSize = 16;
        
        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.animationFrame = 0;
        this.currentMap = 'ranch';
        
        // Player
        this.player = {
            x: 15,
            y: 18,
            direction: 'down',
            animFrame: 0
        };
        
        // Input
        this.keys = {};
        this.setupInput();
        
        // Map data
        this.maps = this.createMaps();
    }

    createMaps() {
        const TILES = {
            GRASS: 0,
            DIRT: 1,
            WATER: 2,
            WALL: 3,
            FLOOR: 4,
            DOOR: 5,
            FENCE: 6
        };
        
        // Ranch outdoor map (30x20 tiles)
        const ranch = {
            width: 30,
            height: 20,
            tiles: this.generateRanchMap(),
            entities: [
                { type: 'snake', x: 10, y: 8, name: 'Butter' },
                { type: 'snake', x: 18, y: 12, name: 'Honey' },
                { type: 'door', x: 15, y: 5, leads: 'shop', label: 'SHOP' },
                { type: 'door', x: 8, y: 10, leads: 'breeding', label: 'BREEDING' }
            ]
        };
        
        return { ranch, TILES };
    }
    
    generateRanchMap() {
        const map = [];
        const w = 30, h = 20;
        
        // Fill with grass
        for (let y = 0; y < h; y++) {
            map[y] = [];
            for (let x = 0; x < w; x++) {
                map[y][x] = 0; // GRASS
            }
        }
        
        // Add dirt paths
        for (let x = 5; x < 25; x++) map[10][x] = 1;
        for (let y = 5; y < 15; y++) map[y][15] = 1;
        
        // Shop building (top center)
        for (let y = 2; y < 6; y++) {
            for (let x = 13; x < 18; x++) {
                if (y === 2 || y === 5 || x === 13 || x === 17) {
                    map[y][x] = 3; // WALL
                } else {
                    map[y][x] = 4; // FLOOR
                }
            }
        }
        map[5][15] = 5; // DOOR
        
        // Breeding facility (left)
        for (let y = 8; y < 13; y++) {
            for (let x = 5; x < 12; x++) {
                if (y === 8 || y === 12 || x === 5 || x === 11) {
                    map[y][x] = 3; // WALL
                } else {
                    map[y][x] = 4; // FLOOR
                }
            }
        }
        map[10][5] = 5; // DOOR
        
        // Pond (bottom right)
        for (let y = 15; y < 18; y++) {
            for (let x = 22; x < 27; x++) {
                map[y][x] = 2; // WATER
            }
        }
        
        // Fences
        for (let x = 18; x < 24; x++) {
            map[7][x] = 6;
            map[14][x] = 6;
        }
        for (let y = 7; y < 15; y++) {
            map[y][18] = 6;
            map[y][23] = 6;
        }
        
        return map;
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    async init() {
        // Set up canvas with pixel-perfect scaling
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width * this.scale}px`;
        this.canvas.style.height = `${this.height * this.scale}px`;
        
        // Disable image smoothing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop = (currentTime) => {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }

    update(dt) {
        this.animationFrame += dt * 0.001;
        
        // Player movement (grid-based)
        const moveSpeed = 4; // tiles per second
        const moveDelay = 1000 / moveSpeed;
        
        if (dt > moveDelay && !this.isMoving) {
            let dx = 0, dy = 0;
            let newDir = this.player.direction;
            
            if (this.keys['ArrowUp'] || this.keys['w']) { dy = -1; newDir = 'up'; }
            if (this.keys['ArrowDown'] || this.keys['s']) { dy = 1; newDir = 'down'; }
            if (this.keys['ArrowLeft'] || this.keys['a']) { dx = -1; newDir = 'left'; }
            if (this.keys['ArrowRight'] || this.keys['d']) { dx = 1; newDir = 'right'; }
            
            this.player.direction = newDir;
            
            if (dx !== 0 || dy !== 0) {
                const newX = this.player.x + dx;
                const newY = this.player.y + dy;
                
                if (this.canMove(newX, newY)) {
                    this.player.x = newX;
                    this.player.y = newY;
                    this.player.animFrame = (this.player.animFrame + 1) % 4;
                }
            }
        }
    }
    
    canMove(x, y) {
        const map = this.maps.ranch;
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;
        
        const tile = map.tiles[y][x];
        const { TILES } = this.maps;
        
        // Can't walk on water, walls
        return tile !== TILES.WATER && tile !== TILES.WALL;
    }

    render() {
        const ts = this.tileSize;
        const map = this.maps.ranch;
        
        // Clear canvas
        this.ctx.fillStyle = '#1a1410';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Calculate camera offset (center on player)
        const camX = Math.floor((this.width / 2) - (this.player.x * ts) - (ts / 2));
        const camY = Math.floor((this.height / 2) - (this.player.y * ts) - (ts / 2));
        
        this.ctx.save();
        this.ctx.translate(camX, camY);
        
        // Draw tilemap
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                this.drawTile(x, y, map.tiles[y][x]);
            }
        }
        
        // Draw entities (snakes)
        map.entities.forEach(entity => {
            if (entity.type === 'snake') {
                this.drawSnakeEntity(entity);
            } else if (entity.type === 'door') {
                this.drawDoor(entity);
            }
        });
        
        // Draw player
        this.drawPlayer();
        
        this.ctx.restore();
        
        // Draw UI
        this.drawUI();
    }
    
    drawTile(x, y, tileType) {
        const ts = this.tileSize;
        const px = x * ts;
        const py = y * ts;
        const { TILES } = this.maps;
        
        switch(tileType) {
            case TILES.GRASS:
                this.ctx.fillStyle = '#6b8e23';
                this.ctx.fillRect(px, py, ts, ts);
                // Add texture
                this.ctx.fillStyle = '#5a7a1a';
                if ((x + y) % 3 === 0) this.ctx.fillRect(px + 2, py + 2, 2, 2);
                if ((x + y) % 5 === 0) this.ctx.fillRect(px + 10, py + 8, 2, 2);
                break;
            case TILES.DIRT:
                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.fillStyle = '#6b5335';
                if ((x + y) % 2 === 0) this.ctx.fillRect(px + 4, py + 4, 2, 2);
                break;
            case TILES.WATER:
                this.ctx.fillStyle = '#4a7ba7';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.fillStyle = '#6a9bc7';
                this.ctx.fillRect(px + 3, py + 3, 4, 4);
                break;
            case TILES.WALL:
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.strokeStyle = '#4a3218';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(px, py, ts, ts);
                break;
            case TILES.FLOOR:
                this.ctx.fillStyle = '#d4a574';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.strokeStyle = '#c49564';
                if ((x + y) % 2 === 0) this.ctx.strokeRect(px, py, ts, ts);
                break;
            case TILES.DOOR:
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(px + 2, py, ts - 4, ts);
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(px + 6, py + 8, 4, 4);
                break;
            case TILES.FENCE:
                this.ctx.fillStyle = '#6b5335';
                this.ctx.fillRect(px + 6, py, 4, ts);
                this.ctx.fillRect(px + 2, py + 6, ts - 4, 4);
                break;
        }
    }
    
    drawPlayer() {
        const ts = this.tileSize;
        const px = this.player.x * ts;
        const py = this.player.y * ts;
        
        // Body
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(px + 4, py + 6, 8, 10);
        
        // Head
        this.ctx.fillStyle = '#ffc896';
        this.ctx.fillRect(px + 5, py + 3, 6, 6);
        
        // Hair
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(px + 5, py + 2, 6, 3);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(px + 6, py + 5, 1, 1);
        this.ctx.fillRect(px + 9, py + 5, 1, 1);
        
        // Direction indicator (simple shadow)
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + 8, py + 15, 4, 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawSnakeEntity(entity) {
        const ts = this.tileSize;
        const px = entity.x * ts;
        const py = entity.y * ts;
        const wave = Math.sin(this.animationFrame + entity.x) * 2;
        
        // Snake body (coiled)
        this.ctx.fillStyle = '#d4a574';
        this.ctx.beginPath();
        this.ctx.arc(px + 8, py + 8, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pattern spots
        this.ctx.fillStyle = '#8a6040';
        this.ctx.fillRect(px + 6 + wave, py + 6, 2, 2);
        this.ctx.fillRect(px + 10 - wave, py + 8, 2, 2);
        this.ctx.fillRect(px + 7, py + 10, 2, 2);
        
        // Head
        this.ctx.fillStyle = '#d4a574';
        this.ctx.beginPath();
        this.ctx.arc(px + 12, py + 5, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(px + 11, py + 4, 1, 1);
        this.ctx.fillRect(px + 13, py + 4, 1, 1);
        
        // Name label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '6px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(entity.name, px + 8, py - 2);
    }
    
    drawDoor(entity) {
        const ts = this.tileSize;
        const px = entity.x * ts;
        const py = entity.y * ts;
        
        // Door sign
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(px + 2, py - 6, ts - 4, 6);
        
        // Text
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '5px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(entity.label, px + 8, py - 1);
    }

    drawUI() {
        // Top bar
        this.ctx.fillStyle = 'rgba(42, 24, 16, 0.9)';
        this.ctx.fillRect(0, 0, this.width, 24);
        
        // Title
        this.ctx.fillStyle = '#8ab060';
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🐍 SNAKE RANCH', 8, 16);
        
        // Controls hint
        this.ctx.fillStyle = '#a0c070';
        this.ctx.font = '6px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('WASD/Arrows to move', this.width - 8, 16);
        
        // Mini info panel
        const panelWidth = 150;
        const panelHeight = 40;
        const panelX = this.width - panelWidth - 8;
        const panelY = this.height - panelHeight - 8;
        
        this.ctx.fillStyle = 'rgba(42, 24, 16, 0.8)';
        this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        
        this.ctx.strokeStyle = '#4a3828';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Info text
        this.ctx.fillStyle = '#8ab060';
        this.ctx.font = '7px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Ranch Explorer', panelX + 6, panelY + 12);
        
        this.ctx.fillStyle = '#a0c070';
        this.ctx.font = '6px monospace';
        this.ctx.fillText('Snakes: 2 (Butter, Honey)', panelX + 6, panelY + 22);
        this.ctx.fillText(`Pos: ${this.player.x},${this.player.y}`, panelX + 6, panelY + 32);
    }
}
