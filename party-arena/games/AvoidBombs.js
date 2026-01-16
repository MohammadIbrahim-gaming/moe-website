import { BaseGame } from '../core/BaseGame.js';

export class AvoidBombs extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Avoid Bombs';
        this.duration = 30000;
        this.bombs = [];
        this.spawnTimer = 0;
        this.spawnInterval = 900;
    }

    init() {
        this.bombs = [];
        this.spawnTimer = 0;

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -50 : 50),
                this.canvas.height / 2 + (i < 2 ? -50 : 50)
            );
        });
    }

    gameUpdate(deltaTime) {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.bombs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 20,
                explosionTimer: 2000,
                exploded: false,
                explosionDuration: 3000
            });
        }

        // Update bombs
        this.bombs.forEach(bomb => {
            if (!bomb.exploded) {
                bomb.explosionTimer -= deltaTime;
                if (bomb.explosionTimer <= 0) {
                    bomb.exploded = true;
                    bomb.explosionRadius = 80;
                }
            } else {
                bomb.explosionDuration -= deltaTime;
            }
        });

        // Check bomb collisions
        this.bombs.forEach(bomb => {
            if (bomb.exploded) {
                this.players.forEach((player, index) => {
                    if (!player.alive) return;
                    const dist = Math.hypot(player.x - bomb.x, player.y - bomb.y);
                    if (dist < bomb.explosionRadius) {
                        player.alive = false;
                    }
                });
            }
        });

        // Remove old bombs after explosion window
        this.bombs = this.bombs.filter(bomb => !bomb.exploded || bomb.explosionDuration > 0);

        // Score for staying alive (scaled per second)
        this.players.forEach((player, index) => {
            if (player.alive) {
                this.addPointsPerSecond(index, 3, deltaTime);
            }
        });
    }

    gameDraw() {
        // Draw bombs
        this.bombs.forEach(bomb => {
            if (!bomb.exploded) {
                this.ctx.fillStyle = 'red';
                this.ctx.beginPath();
                this.ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('💣', bomb.x, bomb.y + 6);
            } else {
                // Draw explosion
                this.ctx.fillStyle = `rgba(255, ${255 - bomb.explosionRadius}, 0, 0.5)`;
                this.ctx.beginPath();
                this.ctx.arc(bomb.x, bomb.y, bomb.explosionRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
}