import { BaseGame } from '../core/BaseGame.js';

export class Platformer extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Platformer';
        this.duration = 30000;
        this.platforms = [];
        this.gravity = 0.3;
        this.jumpPower = -8;
        this.playerVelocities = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        this.handlePlayerMovement = false; // This game handles player movement itself
    }

    init() {
        // Create platforms
        this.platforms = [
            { x: 0, y: this.canvas.height - 50, width: this.canvas.width, height: 50 },
            { x: 200, y: this.canvas.height - 200, width: 150, height: 20 },
            { x: 500, y: this.canvas.height - 300, width: 150, height: 20 },
            { x: 800, y: this.canvas.height - 200, width: 150, height: 20 },
            { x: 400, y: this.canvas.height - 400, width: 200, height: 20 }
        ];

        this.playerVelocities = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                100 + i * 50,
                this.canvas.height - 100
            );
        });
    }

    gameUpdate() {
        const inputState = this.inputManager.getState();

        this.players.forEach((player, index) => {
            if (!player.alive) return;

            const vel = this.playerVelocities[index];

            // Horizontal movement
            if (inputState[player.controls.left]) vel.x = -player.speed;
            else if (inputState[player.controls.right]) vel.x = player.speed;
            else vel.x *= 0.8;

            // Jump
            if (inputState[player.controls.up] && this.isOnGround(player, index)) {
                vel.y = this.jumpPower;
            }

            // Apply gravity
            vel.y += this.gravity;

            // Update position
            player.x += vel.x;
            player.y += vel.y;

            // Platform collision
            this.platforms.forEach(platform => {
                const playerBounds = player.getBounds();
                if (playerBounds.x < platform.x + platform.width &&
                    playerBounds.x + playerBounds.width > platform.x &&
                    playerBounds.y < platform.y + platform.height &&
                    playerBounds.y + playerBounds.height > platform.y &&
                    vel.y > 0) {
                    player.y = platform.y - player.radius;
                    vel.y = 0;
                }
            });

            // Boundary check
            if (player.y > this.canvas.height) {
                player.alive = false;
            }

            // Score for staying alive
            if (player.alive) {
                this.scores[index] += 1;
            }
        });
    }

    isOnGround(player, index) {
        const vel = this.playerVelocities[index];
        if (vel.y > 0) return false;

        const testY = player.y + player.radius + 1;
        return this.platforms.some(platform => {
            return player.x >= platform.x && player.x <= platform.x + platform.width &&
                   testY >= platform.y && testY <= platform.y + platform.height;
        });
    }

    gameDraw() {
        // Draw platforms
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
    }
}