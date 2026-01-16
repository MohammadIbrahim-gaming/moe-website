import { BaseGame } from '../core/BaseGame.js';

export class RaceToFinish extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Race to Finish';
        this.duration = 20000;
        this.finishLine = { x: 0, y: 0 };
        this.checkpoints = [];
        this.playerProgress = [0, 0];
    }

    init() {
        // Create finish line at top
        this.finishLine.x = this.canvas.width / 2;
        this.finishLine.y = 50;

        // Create checkpoints
        this.checkpoints = [
            { x: this.canvas.width / 2, y: this.canvas.height - 50 },
            { x: this.canvas.width / 2, y: this.canvas.height * 0.7 },
            { x: this.canvas.width / 2, y: this.canvas.height * 0.4 }
        ];

        // Reset players at start
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -30 : 30),
                this.canvas.height - 50
            );
            this.playerProgress[i] = 0;
        });
    }

    gameUpdate() {
        // Check checkpoint progress
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            
            // Check distance to finish
            const distToFinish = Math.hypot(player.x - this.finishLine.x, player.y - this.finishLine.y);
            if (distToFinish < 30) {
                this.scores[index] = 200;
                player.alive = false;
            }

            // Update progress based on Y position
            const progress = 1 - (player.y / this.canvas.height);
            this.playerProgress[index] = Math.max(this.playerProgress[index], progress);
            this.scores[index] = Math.floor(this.playerProgress[index] * 100);
        });
    }

    gameDraw() {
        // Draw finish line
        this.ctx.strokeStyle = 'gold';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.finishLine.x - 100, this.finishLine.y);
        this.ctx.lineTo(this.finishLine.x + 100, this.finishLine.y);
        this.ctx.stroke();
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏁 FINISH', this.finishLine.x, this.finishLine.y - 10);

        // Draw checkpoints
        this.checkpoints.forEach(checkpoint => {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(checkpoint.x, checkpoint.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}