import { BaseGame } from '../core/BaseGame.js';

export class PushOut extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Push Out';
        this.duration = 30000;
        this.instructionsText = 'Push the other player off the shrinking platform to win.';
        this.platform = { x: 0, y: 0, width: 0, height: 0 };
        this.platformShrinkRate = 0.2;
        this.minPlatformPadding = 220;
    }

    init() {
        const margin = 100;
        this.platform = {
            x: margin,
            y: margin,
            width: this.canvas.width - margin * 2,
            height: this.canvas.height - margin * 2
        };

        // Reset players on platform
        this.players.forEach((player, i) => {
            player.reset(
                this.platform.x + this.platform.width / 2 + (i % 2 === 0 ? -50 : 50),
                this.platform.y + this.platform.height / 2 + (i < 2 ? -50 : 50)
            );
        });
    }

    gameUpdate(deltaTime) {
        // Shrink platform over time
        const shrinkAmount = this.platformShrinkRate;
        const maxPadding = this.minPlatformPadding;
        const minWidth = this.canvas.width - maxPadding * 2;
        const minHeight = this.canvas.height - maxPadding * 2;
        const shrinkMultiplier = this.isSuddenDeath ? 2 : 1;
        if (this.platform.width > minWidth) {
            this.platform.x += shrinkAmount * shrinkMultiplier;
            this.platform.width -= shrinkAmount * 2 * shrinkMultiplier;
        }
        if (this.platform.height > minHeight) {
            this.platform.y += shrinkAmount * shrinkMultiplier;
            this.platform.height -= shrinkAmount * 2 * shrinkMultiplier;
        }

        // Check if players are pushed off platform
        this.players.forEach((player, index) => {
            if (!player.alive) return;

            const onPlatform = player.x >= this.platform.x && 
                              player.x <= this.platform.x + this.platform.width &&
                              player.y >= this.platform.y && 
                              player.y <= this.platform.y + this.platform.height;

            if (!onPlatform) {
                player.alive = false;
            } else {
                // Check collisions with other players
                this.players.forEach((otherPlayer, otherIndex) => {
                    if (index === otherIndex || !otherPlayer.alive) return;
                    const dist = Math.hypot(player.x - otherPlayer.x, player.y - otherPlayer.y);
                    if (dist < player.radius + otherPlayer.radius) {
                        // Push effect
                        const angle = Math.atan2(player.y - otherPlayer.y, player.x - otherPlayer.x);
                        const pushForce = this.isSuddenDeath ? 4.5 : 3.5;
                        player.x += Math.cos(angle) * pushForce;
                        player.y += Math.sin(angle) * pushForce;
                    }
                });
            }

            // Score for staying on platform (scaled per second)
            if (player.alive) {
                this.addPointsPerSecond(index, 3, deltaTime);
            }
        });
    }

    gameDraw() {
        // Draw platform
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        this.ctx.fillRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
    }
}