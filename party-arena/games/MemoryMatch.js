import { BaseGame } from '../core/BaseGame.js';

export class MemoryMatch extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Memory Match';
        this.duration = 30000;
        this.instructionsText = 'Watch the sequence twice, then step on the points in order.';
        this.sequences = [[], []];
        this.currentSequence = [];
        this.sequenceLength = 3;
        this.playerProgress = [];
        this.hitCooldown = [];
        this.sequenceRevealDuration = 2000;
        this.sequenceRepeatCount = 2;
        this.revealCyclesRemaining = 0;
    }

    init() {
        this.sequences = [[], []];
        this.currentSequence = [];
        this.playerProgress = [];
        this.hitCooldown = [];

        this.createSequence();

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -100 : 100),
                this.canvas.height / 2
            );
            this.playerProgress[i] = 0;
            this.hitCooldown[i] = 0;
        });
    }

    createSequence() {
        this.currentSequence = [];
        for (let i = 0; i < this.sequenceLength; i++) {
            this.currentSequence.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                shown: false
            });
        }
        this.sequenceStartTime = Date.now();
        this.revealCyclesRemaining = this.sequenceRepeatCount;
    }

    gameUpdate(deltaTime) {
        // Show sequence points
        const elapsed = Date.now() - this.sequenceStartTime;
        const showDuration = this.sequenceRevealDuration;
        const pointDuration = showDuration / this.currentSequence.length;
        const cycleDuration = showDuration;

        const activeCycle = Math.floor(elapsed / cycleDuration);
        const cycleTime = elapsed % cycleDuration;
        const showPoints = activeCycle < this.sequenceRepeatCount;

        this.currentSequence.forEach((point, index) => {
            const pointStart = index * pointDuration;
            const pointEnd = pointStart + pointDuration;

            if (showPoints && cycleTime >= pointStart && cycleTime < pointEnd) {
                point.shown = true;
            } else {
                point.shown = false;
            }
        });

        // Check if players are at sequence points (in order)
        if (elapsed > showDuration * this.sequenceRepeatCount) {
            this.players.forEach((player, playerIndex) => {
                if (!player.alive) return;
                this.hitCooldown[playerIndex] = Math.max(0, this.hitCooldown[playerIndex] - deltaTime);
                if (this.hitCooldown[playerIndex] > 0) return;

                const expectedIndex = this.playerProgress[playerIndex];
                const expectedPoint = this.currentSequence[expectedIndex];
                if (!expectedPoint) return;

                const dist = Math.hypot(player.x - expectedPoint.x, player.y - expectedPoint.y);
                if (dist < 30) {
                    this.playerProgress[playerIndex] += 1;
                    this.scores[playerIndex] += 25;
                    this.hitCooldown[playerIndex] = 300;

                    if (this.playerProgress[playerIndex] >= this.sequenceLength) {
                        this.scores[playerIndex] += 100;
                        this.playerProgress[playerIndex] = 0;
                        this.createSequence();
                        this.players.forEach((p, idx) => {
                            this.hitCooldown[idx] = 0;
                        });
                    }
                }
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