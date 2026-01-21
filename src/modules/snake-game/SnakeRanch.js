/**
 * Snake Ranch - Clean sprite-based game
 * SMRI: S11.2,10.05
 */

export class SnakeRanch {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.version = '0.7.85';
        
        // Simple clean map - 20x15 tiles @ 32px
        this.tileSize = 32;
        this.mapWidth = 20;
        this.mapHeight = 15;
        
        // Player
        this.player = {
            x: 10,
            y: 12,
            dir: 'down'
        };
        
        // Keys
        this.keys = {};
        this.setupInput();
        
        // Game state
        this.isRunning = false;
        this.lastMove = 0;
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    async init() {
        // Mobile-friendly size
        const w = Math.min(window.innerWidth - 40, 640);
        const h = Math.min(window.innerHeight - 200, 480);
        
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        
        this.ctx.imageSmoothingEnabled = false;
        
        // Generate simple map
        this.map = this.createMap();
    }
    
    createMap() {
        const map = [];
        
        // Simple 2D array
        for (let y = 0; y < this.mapHeight; y++) {
            map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Grass everywhere
                map[y][x] = 'grass';
            }
        }
        
        // Shop building - simple 4x3 rectangle
        for (let y = 2; y < 5; y++) {
            for (let x = 8; x < 12; x++) {
                if (y === 2 || y === 4 || x === 8 || x === 11) {
                    map[y][x] = 'wall';
                } else {
                    map[y][x] = 'floor';
                }
            }
        }
        map[4][10] = 'door'; // door
        
        // Breeding house
        for (let y = 7; y < 10; y++) {
            for (let x = 3; x < 7; x++) {
                if (y === 7 || y === 9 || x === 3 || x === 6) {
                    map[y][x] = 'wall';
                } else {
                    map[y][x] = 'floor';
                }
            }
        }
        map[9][5] = 'door';
        
        // Pond
        map[10][15] = 'water';
        map[10][16] = 'water';
        map[11][15] = 'water';
        map[11][16] = 'water';
        
        // Trees
        map[3][3] = 'tree';
        map[5][15] = 'tree';
        map[12][5] = 'tree';
        
        return map;
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop = () => {
        if (!this.isRunning) return;
        
        const now = Date.now();
        if (now - this.lastMove > 150) { // 6.6 moves/sec
            this.update();
            this.lastMove = now;
        }
        
        this.render();
        requestAnimationFrame(this.gameLoop);
    }
    
    update() {
        let dx = 0, dy = 0;
        
        if (this.keys['ArrowUp']) { dy = -1; this.player.dir = 'up'; }
        if (this.keys['ArrowDown']) { dy = 1; this.player.dir = 'down'; }
        if (this.keys['ArrowLeft']) { dx = -1; this.player.dir = 'left'; }
        if (this.keys['ArrowRight']) { dx = 1; this.player.dir = 'right'; }
        
        if (dx === 0 && dy === 0) return;
        
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // Check bounds
        if (newX < 0 || newX >= this.mapWidth || newY < 0 || newY >= this.mapHeight) return;
        
        // Check collision
        const tile = this.map[newY][newX];
        if (tile === 'wall' || tile === 'water' || tile === 'tree') return;
        
        this.player.x = newX;
        this.player.y = newY;
    }
    
    render() {
        // Clear
        this.ctx.fillStyle = '#87CEEB'; // sky blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate visible area
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const offsetX = centerX - (this.player.x * this.tileSize) - (this.tileSize / 2);
        const offsetY = centerY - (this.player.y * this.tileSize) - (this.tileSize / 2);
        
        this.ctx.save();
        this.ctx.translate(Math.round(offsetX), Math.round(offsetY));
        
        // Draw map
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                this.drawTile(x, y, this.map[y][x]);
            }
        }
        
        // Draw player
        this.drawPlayer();
        
        this.ctx.restore();
        
        // UI
        this.drawUI();
    }
    
    drawTile(x, y, type) {
        const ts = this.tileSize;
        const px = x * ts;
        const py = y * ts;
        
        switch(type) {
            case 'grass':
                // Bright green grass
                this.ctx.fillStyle = '#5cb85c';
                this.ctx.fillRect(px, py, ts, ts);
                // Border for clarity
                this.ctx.strokeStyle = '#4a9d4a';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(px, py, ts, ts);
                // Add some grass detail
                this.ctx.fillStyle = '#6dc66d';
                this.ctx.fillRect(px + 4, py + 4, 4, 4);
                this.ctx.fillRect(px + 20, py + 16, 4, 4);
                break;
                
            case 'wall':
                // Brown wall
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.strokeStyle = '#654321';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(px + 2, py + 2, ts - 4, ts - 4);
                break;
                
            case 'floor':
                // Wood floor
                this.ctx.fillStyle = '#DEB887';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.strokeStyle = '#D2A679';
                this.ctx.strokeRect(px, py, ts, ts);
                break;
                
            case 'door':
                // Red door
                this.ctx.fillStyle = '#dc3545';
                this.ctx.fillRect(px + 6, py + 4, ts - 12, ts - 4);
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(px + 20, py + 16, 4, 4);
                break;
                
            case 'water':
                // Blue water
                this.ctx.fillStyle = '#007bff';
                this.ctx.fillRect(px, py, ts, ts);
                this.ctx.fillStyle = '#5dade2';
                this.ctx.fillRect(px + 6, py + 6, 12, 12);
                break;
                
            case 'tree':
                // Green circle tree
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(px + 12, py + 20, 8, 12);
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.arc(px + 16, py + 16, 14, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }
    }
    
    drawPlayer() {
        const ts = this.tileSize;
        const px = this.player.x * ts;
        const py = this.player.y * ts;
        
        // Simple clear character - bright colors
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + ts/2, py + ts - 4, 10, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Body - blue shirt
        this.ctx.fillStyle = '#007bff';
        this.ctx.fillRect(px + 8, py + 14, 16, 14);
        
        // Head - peach skin
        this.ctx.fillStyle = '#ffcc99';
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 12, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Hair - dark brown
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 8, 8, Math.PI, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(px + 12, py + 11, 3, 3);
        this.ctx.fillRect(px + 19, py + 11, 3, 3);
        
        // Mouth
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 14, 4, 0, Math.PI);
        this.ctx.stroke();
    }
    
    drawUI() {
        // Title bar
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, 36);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🐍 Snake Ranch', 12, 24);
        
        this.ctx.textAlign = 'right';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Tile: ${this.player.x}, ${this.player.y}`, this.canvas.width - 12, 24);
    }
}
