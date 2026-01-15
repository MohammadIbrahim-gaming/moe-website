import { BaseGame } from '../core/BaseGame.js';

export class KingOfTheHill extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'King of the Hill';
        this.duration = 30000;
        this.hill = { x: 0, y: 0, radius: 60 };
    }

    init() {
        this.hill.x = this.canvas.width / 2;
        this.hill.y = this.canvas.height / 2;

        // Reset players around edges
        this.players.forEach((player, i) => {
            const angle = (i / this.players.length) * Math.PI * 2;
            player.reset(
                this.hill.x + Math.cos(angle) * 200,
                this.hill.y + Math.sin(angle) * 200
            );
        });
    }

    gameUpdate() {
        // Check who's on the hill
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const dist = Math.hypot(player.x - this.hill.x, player.y - this.hill.y);
            if (dist < this.hill.radius) {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Draw hill
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.hill.x, this.hill.y, this.hill.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'gold';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('👑', this.hill.x, this.hill.y + 8);
    }
}