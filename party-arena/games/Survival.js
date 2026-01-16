import { BaseGame } from '../core/BaseGame.js';

export class Survival extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Survival';
        this.duration = 30000;
        this.instructionsText = 'Survive as long as you can while enemies move toward you.';
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
    }

    init() {
        this.enemies = [];
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
            const side = Math.floor(Math.random() * 4);
            let x, y;
            if (side === 0) { x = 0; y = Math.random() * this.canvas.height; }
            else if (side === 1) { x = this.canvas.width; y = Math.random() * this.canvas.height; }
            else if (side === 2) { x = Math.random() * this.canvas.width; y = 0; }
            else { x = Math.random() * this.canvas.width; y = this.canvas.height; }

            this.enemies.push({
                x, y,
                radius: 12,
                speed: 1 + Math.random(),
                angle: Math.atan2(this.canvas.height / 2 - y, this.canvas.width / 2 - x)
            });
        }

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.x += Math.cos(enemy.angle) * enemy.speed;
            enemy.y += Math.sin(enemy.angle) * enemy.speed;
        });

        // Check collisions
        this.enemies = this.enemies.filter(enemy => {
            let hit = false;
            this.players.forEach((player, index) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (dist < player.radius + enemy.radius) {
                    player.alive = false;
                    hit = true;
                }
            });
            return !hit && enemy.x > -50 && enemy.x < this.canvas.width + 50 && 
                   enemy.y > -50 && enemy.y < this.canvas.height + 50;
        });

        // Score for survival (scaled per second)
        this.players.forEach((player, index) => {
            if (player.alive) {
                this.addPointsPerSecond(index, 3, deltaTime);
            }
        });
    }

    gameDraw() {
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}