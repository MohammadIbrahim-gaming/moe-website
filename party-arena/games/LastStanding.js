import { BaseGame } from '../core/BaseGame.js';

export class LastStanding extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Last Standing';
        this.duration = 30000;
        this.shrinkingCircle = { x: 0, y: 0, radius: 0, maxRadius: 0 };
        this.minRadius = 120;
        this.shrinkRatePerMs = 0;
    }

    init() {
        this.shrinkingCircle.x = this.canvas.width / 2;
        this.shrinkingCircle.y = this.canvas.height / 2;
        this.shrinkingCircle.maxRadius = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.shrinkingCircle.radius = this.shrinkingCircle.maxRadius;
        this.shrinkRatePerMs = (this.shrinkingCircle.maxRadius - this.minRadius) / this.duration;

        // Reset players inside the safe circle
        this.players.forEach((player, index) => {
            const angle = (index / this.players.length) * Math.PI * 2;
            const radius = this.shrinkingCircle.radius * 0.6;
            player.reset(
                this.shrinkingCircle.x + Math.cos(angle) * radius,
                this.shrinkingCircle.y + Math.sin(angle) * radius
            );
        });
    }

    gameUpdate(deltaTime = 16.67) {
        // Shrink circle
        this.shrinkingCircle.radius -= this.shrinkRatePerMs * deltaTime;
        if (this.shrinkingCircle.radius < this.minRadius) {
            this.shrinkingCircle.radius = this.minRadius;
        }

        // Check if players are outside circle
        let aliveCount = 0;
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const dist = Math.hypot(player.x - this.shrinkingCircle.x, player.y - this.shrinkingCircle.y);
            if (dist > this.shrinkingCircle.radius) {
                player.alive = false;
            } else {
                this.addPointsPerSecond(index, 3, deltaTime);
                aliveCount += 1;
            }
        });

        if (aliveCount <= 1) {
            this.isComplete = true;
        }
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