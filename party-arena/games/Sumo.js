import { BaseGame } from '../core/BaseGame.js';

export class Sumo extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Sumo';
        this.duration = 30000;
        this.ring = { x: 0, y: 0, radius: 0 };
    }

    init() {
        this.ring = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: Math.min(this.canvas.width, this.canvas.height) * 0.35
        };

        // Reset players in ring
        this.players.forEach((player, i) => {
            const angle = (i / this.players.length) * Math.PI * 2;
            player.reset(
                this.ring.x + Math.cos(angle) * (this.ring.radius * 0.5),
                this.ring.y + Math.sin(angle) * (this.ring.radius * 0.5)
            );
        });
    }

    gameUpdate() {
        // Check if players are pushed out of ring
        this.players.forEach((player, index) => {
            if (!player.alive) return;

            const dist = Math.hypot(player.x - this.ring.x, player.y - this.ring.y);
            if (dist > this.ring.radius) {
                player.alive = false;
            } else {
                // Collision with other players
                this.players.forEach((otherPlayer, otherIndex) => {
                    if (index === otherIndex || !otherPlayer.alive) return;
                    const dist = Math.hypot(player.x - otherPlayer.x, player.y - otherPlayer.y);
                    if (dist < player.radius + otherPlayer.radius) {
                        // Push effect
                        const angle = Math.atan2(player.y - otherPlayer.y, player.x - otherPlayer.x);
                        const pushForce = 3;
                        player.x += Math.cos(angle) * pushForce;
                        player.y += Math.sin(angle) * pushForce;
                    }
                });
            }

            // Score for staying in ring
            if (player.alive) {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Draw ring
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(this.ring.x, this.ring.y, this.ring.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.1)';
        this.ctx.fill();
    }
}