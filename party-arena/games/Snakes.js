import { BaseGame } from '../core/BaseGame.js';

export class Snakes extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Snakes';
        this.duration = 30000;
        this.trails = [[], [], [], []];
        this.trailLength = 30;
    }

    init() {
        this.trails = [[], [], [], []];

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -100 : 100),
                this.canvas.height / 2 + (i < 2 ? -100 : 100)
            );
        });
    }

    gameUpdate() {
        // Update trails
        this.players.forEach((player, index) => {
            if (!player.alive) return;

            this.trails[index].push({ x: player.x, y: player.y });
            if (this.trails[index].length > this.trailLength) {
                this.trails[index].shift();
            }

            // Check collision with own trail
            for (let i = 0; i < this.trails[index].length - 5; i++) {
                const point = this.trails[index][i];
                const dist = Math.hypot(player.x - point.x, player.y - point.y);
                if (dist < player.radius) {
                    player.alive = false;
                    break;
                }
            }

            // Check collision with other trails
            this.trails.forEach((trail, trailIndex) => {
                if (trailIndex === index) return;
                trail.forEach(point => {
                    const dist = Math.hypot(player.x - point.x, player.y - point.y);
                    if (dist < player.radius) {
                        player.alive = false;
                    }
                });
            });

            // Score for survival
            if (player.alive) {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Draw trails
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const trail = this.trails[index];
            this.ctx.strokeStyle = player.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            if (trail.length > 0) {
                this.ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) {
                    this.ctx.lineTo(trail[i].x, trail[i].y);
                }
            }
            this.ctx.stroke();
        });
    }
}