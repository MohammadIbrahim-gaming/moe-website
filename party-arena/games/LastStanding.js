import { BaseGame } from '../core/BaseGame.js';

export class LastStanding extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Last Standing';
        this.duration = 30000;
        this.shrinkingCircle = { x: 0, y: 0, radius: 0, maxRadius: 0 };
        this.shrinkSpeed = 0.5;
    }

    init() {
        this.shrinkingCircle.x = this.canvas.width / 2;
        this.shrinkingCircle.y = this.canvas.height / 2;
        this.shrinkingCircle.maxRadius = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.shrinkingCircle.radius = this.shrinkingCircle.maxRadius;

        // Reset players randomly
        this.players.forEach(player => {
            player.reset(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
        });
    }

    gameUpdate() {
        // Shrink circle
        this.shrinkingCircle.radius -= this.shrinkSpeed;
        if (this.shrinkingCircle.radius < 50) {
            this.shrinkingCircle.radius = 50;
        }

        // Check if players are outside circle
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const dist = Math.hypot(player.x - this.shrinkingCircle.x, player.y - this.shrinkingCircle.y);
            if (dist > this.shrinkingCircle.radius) {
                player.alive = false;
            } else {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Draw shrinking circle
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(this.shrinkingCircle.x, this.shrinkingCircle.y, this.shrinkingCircle.radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
}