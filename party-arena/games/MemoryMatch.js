import { BaseGame } from '../core/BaseGame.js';

export class MemoryMatch extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Memory Match';
        this.duration = 30000;
        this.sequences = [[], []];
        this.currentSequence = [];
        this.sequenceLength = 3;
        this.playerPositions = [];
    }

    init() {
        this.sequences = [[], []];
        this.currentSequence = [];
        this.playerPositions = [];

        // Create sequence of positions to remember
        for (let i = 0; i < this.sequenceLength; i++) {
            this.currentSequence.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                shown: false,
                timeShown: 0
            });
        }

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -100 : 100),
                this.canvas.height / 2
            );
            this.playerPositions[i] = [];
        });
    }

    gameUpdate(deltaTime) {
        // Show sequence points
        const elapsed = Date.now() - this.startTime;
        const showDuration = 2000;
        const pointDuration = showDuration / this.currentSequence.length;

        this.currentSequence.forEach((point, index) => {
            const pointStart = index * pointDuration;
            const pointEnd = pointStart + pointDuration;
            const timeInSequence = elapsed % showDuration;

            if (timeInSequence >= pointStart && timeInSequence < pointEnd) {
                point.shown = true;
            } else {
                point.shown = false;
            }
        });

        // Check if players are at sequence points
        if (elapsed > showDuration) {
            this.currentSequence.forEach((point, pointIndex) => {
                this.players.forEach((player, playerIndex) => {
                    if (!player.alive) return;
                    const dist = Math.hypot(player.x - point.x, player.y - point.y);
                    if (dist < 30) {
                        if (!this.playerPositions[playerIndex].includes(pointIndex)) {
                            this.playerPositions[playerIndex].push(pointIndex);
                            if (this.playerPositions[playerIndex].length === this.sequenceLength) {
                                this.scores[playerIndex] += 100;
                                this.playerPositions[playerIndex] = [];
                            }
                        }
                    }
                });
            });
        }
    }

    gameDraw() {
        // Draw sequence points
        this.currentSequence.forEach((point, index) => {
            if (point.shown) {
                this.ctx.fillStyle = 'yellow';
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = 'orange';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                this.ctx.fillStyle = 'black';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText((index + 1).toString(), point.x, point.y + 6);
            } else {
                // Show as question mark when not visible
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
}