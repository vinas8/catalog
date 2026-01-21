/**
 * Snake Ranch - Clean sprite-based game
 * SMRI: S11.2,10.05
 */

export class SnakeRanch {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.version = '0.7.93';
        
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
        
        // Snake collection
        this.snakes = [];
        this.encounterZones = [];
        this.showingEncounter = false;
        this.currentEncounter = null;
        
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
        // Fullscreen on mobile
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        this.ctx.imageSmoothingEnabled = false;
        
        // Load existing collection
        const saved = localStorage.getItem('snakeCollection');
        if (saved) {
            try {
                const all = JSON.parse(saved);
                this.snakes = all.filter(s => s.source === 'ranch-game');
            } catch (e) {
                this.snakes = [];
            }
        }
        
        // Generate simple map
        this.map = this.createMap();
        
        // Setup click handler
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchend', (e) => {
            if (e.changedTouches.length > 0) {
                this.handleClick(e.changedTouches[0]);
            }
        });
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
        
        // Create encounter zones (tall grass areas)
        this.encounterZones = [
            { x: 13, y: 8, width: 4, height: 3 },
            { x: 15, y: 2, width: 3, height: 4 },
            { x: 2, y: 11, width: 5, height: 3 }
        ];
        
        // Mark tall grass on map
        this.encounterZones.forEach(zone => {
            for (let y = zone.y; y < zone.y + zone.height; y++) {
                for (let x = zone.x; x < zone.x + zone.width; x++) {
                    if (x < this.mapWidth && y < this.mapHeight) {
                        map[y][x] = 'tallgrass';
                    }
                }
            }
        });
        
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
        
        // Check for encounters in tall grass
        if (tile === 'tallgrass' && Math.random() < 0.3) {
            this.triggerEncounter();
        }
    }
    
    triggerEncounter() {
        const morphs = [
            { name: 'Normal Ball Python', morph: 'Normal', price: 50, color: '#8B4513' },
            { name: 'Pastel Ball Python', morph: 'Pastel', price: 150, color: '#F4C430' },
            { name: 'Mojave Ball Python', morph: 'Mojave', price: 200, color: '#D4A574' },
            { name: 'Banana Ball Python', morph: 'Banana', price: 300, color: '#FFE135' },
            { name: 'Piebald Ball Python', morph: 'Piebald', price: 500, color: '#FFFFFF' }
        ];
        
        const snake = morphs[Math.floor(Math.random() * morphs.length)];
        snake.id = Date.now();
        
        this.currentEncounter = snake;
        this.showingEncounter = true;
    }
    
    catchSnake() {
        if (!this.currentEncounter) return;
        
        const caughtSnake = {
            id: this.currentEncounter.id,
            name: this.currentEncounter.name,
            morph: this.currentEncounter.morph,
            price: this.currentEncounter.price,
            color: this.currentEncounter.color,
            caughtAt: new Date().toISOString(),
            source: 'ranch-game',
            // Game stats for /game integration
            stats: {
                hunger: 100,
                water: 100,
                temperature: 80,
                humidity: 60,
                health: 100,
                stress: 0,
                cleanliness: 100,
                happiness: 100
            }
        };
        
        this.snakes.push(caughtSnake);
        
        // Save to localStorage for dex AND game
        const collection = JSON.parse(localStorage.getItem('snakeCollection') || '[]');
        collection.push(caughtSnake);
        localStorage.setItem('snakeCollection', JSON.stringify(collection));
        
        // Also save to userProducts for /game
        const products = JSON.parse(localStorage.getItem('userProducts') || '[]');
        products.push({
            id: caughtSnake.id,
            name: caughtSnake.name,
            morph: caughtSnake.morph,
            price: caughtSnake.price,
            purchaseDate: caughtSnake.caughtAt,
            stats: caughtSnake.stats
        });
        localStorage.setItem('userProducts', JSON.stringify(products));
        
        this.currentEncounter = null;
        this.showingEncounter = false;
    }
    
    skipEncounter() {
        this.currentEncounter = null;
        this.showingEncounter = false;
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        
        // Check dex button (top right area)
        if (canvasY < 40 && canvasX > this.canvas.width - 200) {
            window.location.href = '/game/index.html';
            return;
        }
        
        // Check encounter buttons
        if (this.showingEncounter && this.encounterZones) {
            const zones = this.encounterZones;
            
            if (zones.catch && canvasX >= zones.catch.x && canvasX <= zones.catch.x + zones.catch.w &&
                canvasY >= zones.catch.y && canvasY <= zones.catch.y + zones.catch.h) {
                this.catchSnake();
                return;
            }
            
            if (zones.skip && canvasX >= zones.skip.x && canvasX <= zones.skip.x + zones.skip.w &&
                canvasY >= zones.skip.y && canvasY <= zones.skip.y + zones.skip.h) {
                this.skipEncounter();
                return;
            }
        }
    }
    
    render() {
        // Clear with green background
        this.ctx.fillStyle = '#4a7a3a';
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
        
        // Encounter modal
        if (this.showingEncounter) {
            this.drawEncounterModal();
        }
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.canvas.width, 40);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🐍 Snake Ranch', 12, 26);
        
        // Dex button - big and visible
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`📖 DEX: ${this.snakes.length}`, this.canvas.width - 12, 26);
    }
    
    drawEncounterModal() {
        const w = Math.min(400, this.canvas.width - 40);
        const h = 300;
        const x = (this.canvas.width - w) / 2;
        const y = (this.canvas.height - h) / 2;
        
        // Overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Modal background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x, y, w, h);
        
        // Border
        this.ctx.strokeStyle = '#4a3828';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, y, w, h);
        
        // Title
        this.ctx.fillStyle = '#2a1810';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Wild Snake Appeared!', x + w/2, y + 40);
        
        // Snake info
        const snake = this.currentEncounter;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText(snake.name, x + w/2, y + 80);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.fillText(`Morph: ${snake.morph}`, x + w/2, y + 110);
        this.ctx.fillText(`Value: $${snake.price}`, x + w/2, y + 135);
        
        // Draw snake visual
        this.ctx.fillStyle = snake.color;
        this.ctx.beginPath();
        this.ctx.arc(x + w/2, y + 180, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pattern spots
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + w/2 - 15, y + 170, 10, 10);
        this.ctx.fillRect(x + w/2 + 5, y + 180, 10, 10);
        
        // Buttons
        const btnY = y + h - 60;
        const btnW = 100;
        const btnH = 40;
        
        // Store zones for clicking
        this.encounterZones = {
            catch: { x: x + 50, y: btnY, w: btnW, h: btnH },
            skip: { x: x + w - 150, y: btnY, w: btnW, h: btnH }
        };
        
        // Catch button
        this.ctx.fillStyle = '#28a745';
        this.ctx.fillRect(x + 50, btnY, btnW, btnH);
        this.ctx.strokeStyle = '#1e7e34';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 50, btnY, btnW, btnH);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('CATCH', x + 100, btnY + 26);
        
        // Skip button
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(x + w - 150, btnY, btnW, btnH);
        this.ctx.strokeStyle = '#c82333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + w - 150, btnY, btnW, btnH);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('RUN', x + w - 100, btnY + 26);
    }
}
