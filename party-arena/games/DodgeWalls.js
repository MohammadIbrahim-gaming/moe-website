import { BaseGame } from '../core/BaseGame.js';

export class DodgeWalls extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Dodge Walls';
        this.duration = 30000;
        this.walls = [];
        this.wallTimer = 0;
        this.wallInterval = 3000;
    }

    init() {
        this.walls = [];
        this.wallTimer = 0;

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -50 : 50),
                this.canvas.height / 2 + (i < 2 ? -50 : 50)
            );
        });
    }

    gameUpdate(deltaTime) {
        this.wallTimer += deltaTime;
        if (this.wallTimer >= this.wallInterval) {
            this.wallTimer = 0;
            // Spawn wall from random side
            const side = Math.floor(Math.random() * 4);
            let wall;
            if (side === 0 || side === 1) {
                // Horizontal wall
                wall = {
                    x: 0,
                    y: Math.random() * this.canvas.height,
                    width: this.canvas.width,
                    height: 30,
                    speed: side === 0 ? 2 : -2
                };
            } else {
                // Vertical wall
                wall = {
                    x: Math.random() * this.canvas.width,
                    y: 0,
                    width: 30,
                    height: this.canvas.height,
                    speed: side === 2 ? 2 : -2
                };
            }
            this.walls.push(wall);
        }

        // Update walls
        this.walls.forEach(wall => {
            if (wall.width > wall.height) {
                wall.y += wall.speed;
            } else {
                wall.x += wall.speed;
            }
        });

        // Remove off-screen walls
        this.walls = this.walls.filter(wall => {
            return wall.x > -100 && wall.x < this.canvas.width + 100 &&
                   wall.y > -100 && wall.y < this.canvas.height + 100;
        });

        // Check collisions
        this.walls.forEach(wall => {
            this.players.forEach((player, index) => {
                if (!player.alive) return;
                const playerBounds = player.getBounds();
                if (playerBounds.x < wall.x + wall.width &&
                    playerBounds.x + playerBounds.width > wall.x &&
                    playerBounds.y < wall.y + wall.height &&
                    playerBounds.y + playerBounds.height > wall.y) {
                    player.alive = false;
                }
            });
        });

        // Score for survival
        this.players.forEach((player, index) => {
            if (player.alive) {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Draw walls
        this.walls.forEach(wall => {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            this.ctx.strokeStyle = 'darkred';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });
    }
}