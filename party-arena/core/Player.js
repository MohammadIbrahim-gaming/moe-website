export class Player {
    constructor(id, name, controls, color) {
        this.id = id;
        this.name = name;
        this.controls = controls;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.radius = 15;
        this.speed = 3;
        this.score = 0;
        this.alive = true;
        this.angle = 0;
    }

    update(inputState) {
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

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Update angle for visual direction
        if (dx !== 0 || dy !== 0) {
            this.angle = Math.atan2(dy, dx);
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw player circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw direction indicator
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.radius * 0.6, 0, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

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