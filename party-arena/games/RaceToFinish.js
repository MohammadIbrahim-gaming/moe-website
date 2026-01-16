import { BaseGame } from '../core/BaseGame.js';

export class RaceToFinish extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Race to Finish';
        this.duration = 20000;
        this.instructionsText = 'Race to the finish line by passing checkpoints in order. Dodge obstacles along the way.';
        this.finishLine = { x: 0, y: 0 };
        this.checkpoints = [];
        this.playerProgress = [0, 0];
        this.playerCheckpoint = [0, 0];
        this.obstacles = [];
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

        // Create obstacles
        this.obstacles = [];
        const obstacleCount = 6;
        for (let i = 0; i < obstacleCount; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 200) + 100,
                y: Math.random() * (this.canvas.height - 300) + 150,
                radius: 22
            });
        }

        // Reset players at start
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -30 : 30),
                this.canvas.height - 50
            );
            this.playerProgress[i] = 0;
            this.playerCheckpoint[i] = 0;
        });
    }

    gameUpdate() {
        // Check checkpoint progress
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            
            // Check obstacle collisions (slow down)
            this.obstacles.forEach(obstacle => {
                const dist = Math.hypot(player.x - obstacle.x, player.y - obstacle.y);
                if (dist < player.radius + obstacle.radius) {
                    const angle = Math.atan2(player.y - obstacle.y, player.x - obstacle.x);
                    player.x += Math.cos(angle) * 6;
                    player.y += Math.sin(angle) * 6;
                }
            });

            // Check checkpoints in order
            const nextCheckpointIndex = this.playerCheckpoint[index];
            if (nextCheckpointIndex < this.checkpoints.length) {
                const checkpoint = this.checkpoints[nextCheckpointIndex];
                const distToCheckpoint = Math.hypot(player.x - checkpoint.x, player.y - checkpoint.y);
                if (distToCheckpoint < 30) {
                    this.playerCheckpoint[index] += 1;
                }
            }

            // Check distance to finish
            const distToFinish = Math.hypot(player.x - this.finishLine.x, player.y - this.finishLine.y);
            if (distToFinish < 30 && this.playerCheckpoint[index] >= this.checkpoints.length) {
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

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            this.ctx.beginPath();
            this.ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}