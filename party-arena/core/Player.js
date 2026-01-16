export class Player {
    constructor(id, name, controls, color, avatar) {
        this.id = id;
        this.name = name;
        this.controls = controls;
        this.color = color;
        this.avatar = avatar || '';
        this.x = 0;
        this.y = 0;
        this.radius = 30;
        this.baseSpeed = 3;
        this.boostMultiplier = 1;
        this.boostMax = 3;
        this.boostDecayPerMs = 0.0008;
        this.wasBoostPressed = false;
        this.score = 0;
        this.alive = true;
        this.angle = 0;
    }

    update(inputState, deltaMs) {
        let dx = 0;
        let dy = 0;

        if (inputState[this.controls.up]) dy -= 1;
        if (inputState[this.controls.down]) dy += 1;
        if (inputState[this.controls.left]) dx -= 1;
        if (inputState[this.controls.right]) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        const boostKey = this.controls.boost;
        const isBoostPressed = boostKey ? !!inputState[boostKey] : false;
        if (isBoostPressed && !this.wasBoostPressed) {
            this.boostMultiplier = this.boostMax;
        }
        this.wasBoostPressed = isBoostPressed;

        this.boostMultiplier = Math.max(1, this.boostMultiplier - this.boostDecayPerMs * (deltaMs || 16.67));
        const speed = this.baseSpeed * this.boostMultiplier;

        this.x += dx * speed;
        this.y += dy * speed;

        // Update angle for visual direction
        if (dx !== 0 || dy !== 0) {
            this.angle = Math.atan2(dy, dx);
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.avatar) {
            // Draw emoji avatar without rotation for clarity
            ctx.font = `${this.radius * 1.8}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiSymbols", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.avatar, 0, 0);
        } else {
            ctx.rotate(this.angle);
            // Draw player circle background
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw direction indicator
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.radius * 0.6, 0, this.radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.angle = 0;
    }

    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}