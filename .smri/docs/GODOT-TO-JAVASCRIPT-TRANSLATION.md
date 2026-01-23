# Godot to JavaScript Translation Reference

**Source:** https://github.com/uheartbeast/youtube-tutorials/tree/master/Action%20RPG

## Player Movement System (Player.gd)

### Godot GDScript
```gdscript
extends KinematicBody2D

export var ACCELERATION = 500
export var MAX_SPEED = 80
export var FRICTION = 500

var velocity = Vector2.ZERO
var state = MOVE

func _physics_process(delta):
    var input_vector = Vector2.ZERO
    input_vector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
    input_vector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
    input_vector = input_vector.normalized()
    
    if input_vector != Vector2.ZERO:
        velocity = velocity.move_toward(input_vector * MAX_SPEED, ACCELERATION * delta)
    else:
        velocity = velocity.move_toward(Vector2.ZERO, FRICTION * delta)
    
    velocity = move_and_slide(velocity)
```

### JavaScript Translation
```javascript
class Player {
    constructor() {
        this.ACCELERATION = 500;
        this.MAX_SPEED = 80;
        this.FRICTION = 500;
        
        this.velocity = {x: 0, y: 0};
        this.position = {x: 0, y: 0};
        this.state = 'MOVE';
    }
    
    update(deltaTime) {
        const input = this.getInputVector();
        
        if (input.x !== 0 || input.y !== 0) {
            // Normalize input
            const magnitude = Math.sqrt(input.x * input.x + input.y * input.y);
            input.x /= magnitude;
            input.y /= magnitude;
            
            // Move toward target velocity
            this.velocity = this.moveToward(
                this.velocity,
                {x: input.x * this.MAX_SPEED, y: input.y * this.MAX_SPEED},
                this.ACCELERATION * deltaTime
            );
        } else {
            // Apply friction
            this.velocity = this.moveToward(
                this.velocity,
                {x: 0, y: 0},
                this.FRICTION * deltaTime
            );
        }
        
        this.moveAndSlide();
    }
    
    getInputVector() {
        const keys = {};
        keys.right = Input.isKeyDown('ArrowRight') || Input.isKeyDown('d');
        keys.left = Input.isKeyDown('ArrowLeft') || Input.isKeyDown('a');
        keys.down = Input.isKeyDown('ArrowDown') || Input.isKeyDown('s');
        keys.up = Input.isKeyDown('ArrowUp') || Input.isKeyDown('w');
        
        return {
            x: (keys.right ? 1 : 0) - (keys.left ? 1 : 0),
            y: (keys.down ? 1 : 0) - (keys.up ? 1 : 0)
        };
    }
    
    moveToward(current, target, maxDelta) {
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= maxDelta) {
            return target;
        }
        
        return {
            x: current.x + (dx / distance) * maxDelta,
            y: current.y + (dy / distance) * maxDelta
        };
    }
    
    moveAndSlide() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // TODO: Add collision detection
    }
}
```

## State Machine Pattern

### Godot
```gdscript
enum {
    MOVE,
    ROLL,
    ATTACK
}

var state = MOVE

func _physics_process(delta):
    match state:
        MOVE:
            move_state(delta)
        ROLL:
            roll_state()
        ATTACK:
            attack_state()
```

### JavaScript
```javascript
const PlayerStates = {
    MOVE: 'MOVE',
    ROLL: 'ROLL',
    ATTACK: 'ATTACK'
};

class Player {
    constructor() {
        this.state = PlayerStates.MOVE;
    }
    
    update(deltaTime) {
        switch (this.state) {
            case PlayerStates.MOVE:
                this.moveState(deltaTime);
                break;
            case PlayerStates.ROLL:
                this.rollState();
                break;
            case PlayerStates.ATTACK:
                this.attackState();
                break;
        }
    }
    
    moveState(dt) {
        // Movement logic
        if (Input.isKeyPressed('Space')) {
            this.state = PlayerStates.ROLL;
        }
        if (Input.isKeyPressed('z')) {
            this.state = PlayerStates.ATTACK;
        }
    }
    
    rollState() {
        // Roll logic
    }
    
    attackState() {
        // Attack logic
    }
}
```

## Hitbox/Hurtbox System

### Godot
```gdscript
# Hitbox.gd
extends Area2D

export var damage = 1
var knockback_vector = Vector2.ZERO

# Hurtbox.gd
extends Area2D

func _on_Hurtbox_area_entered(area):
    stats.health -= area.damage
```

### JavaScript
```javascript
class Hitbox {
    constructor(x, y, width, height, damage = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.damage = damage;
        this.knockbackVector = {x: 0, y: 0};
    }
    
    intersects(hurtbox) {
        return this.x < hurtbox.x + hurtbox.width &&
               this.x + this.width > hurtbox.x &&
               this.y < hurtbox.y + hurtbox.height &&
               this.y + this.height > hurtbox.y;
    }
}

class Hurtbox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.invincible = false;
    }
    
    checkCollisions(hitboxes) {
        if (this.invincible) return;
        
        for (const hitbox of hitboxes) {
            if (hitbox.intersects(this)) {
                this.onHit(hitbox);
            }
        }
    }
    
    onHit(hitbox) {
        this.stats.health -= hitbox.damage;
        this.startInvincibility(0.6);
    }
    
    startInvincibility(duration) {
        this.invincible = true;
        setTimeout(() => {
            this.invincible = false;
        }, duration * 1000);
    }
}
```

## Stats System

### Godot
```gdscript
# Stats.gd
extends Node

signal no_health

export(int) var max_health = 1 setget set_max_health
var health = max_health setget set_health

func set_health(value):
    health = value
    if health <= 0:
        emit_signal("no_health")

func set_max_health(value):
    max_health = value
    health = min(health, max_health)
```

### JavaScript
```javascript
class Stats extends EventEmitter {
    constructor(maxHealth = 1) {
        super();
        this._maxHealth = maxHealth;
        this._health = maxHealth;
    }
    
    get health() {
        return this._health;
    }
    
    set health(value) {
        this._health = value;
        if (this._health <= 0) {
            this.emit('no_health');
        }
    }
    
    get maxHealth() {
        return this._maxHealth;
    }
    
    set maxHealth(value) {
        this._maxHealth = value;
        this._health = Math.min(this._health, this._maxHealth);
    }
}

// Simple EventEmitter implementation
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }
}
```

## Game Loop

### Godot (Automatic)
```gdscript
func _physics_process(delta):
    # Called every frame (60 FPS by default)
    update_game(delta)
```

### JavaScript (Manual)
```javascript
class Game {
    constructor() {
        this.lastTime = 0;
        this.running = true;
    }
    
    start() {
        this.loop(0);
    }
    
    loop(currentTime) {
        if (!this.running) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.loop(time));
    }
    
    update(dt) {
        // Update all game entities
        this.player.update(dt);
        this.enemies.forEach(enemy => enemy.update(dt));
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render all entities
        this.player.render(this.ctx);
        this.enemies.forEach(enemy => enemy.render(this.ctx));
    }
}

// Start game
const game = new Game();
game.start();
```

## Input Handling

### Godot
```gdscript
Input.is_action_just_pressed("attack")
Input.get_action_strength("ui_right")
```

### JavaScript
```javascript
class Input {
    static keys = {};
    static keysPressed = {};
    
    static init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keysPressed[e.key] = true;
            }
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    static isKeyDown(key) {
        return this.keys[key] || false;
    }
    
    static isKeyJustPressed(key) {
        const pressed = this.keysPressed[key] || false;
        this.keysPressed[key] = false;
        return pressed;
    }
    
    static update() {
        // Clear "just pressed" state each frame
        this.keysPressed = {};
    }
}

Input.init();
```

---

**Next Steps:**
1. Create basic game engine with player movement
2. Add state machine
3. Implement hitbox/hurtbox collision
4. Port animations (use sprite sheets)
5. Add enemy AI
6. Build UI system
