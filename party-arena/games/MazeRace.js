import { BaseGame } from '../core/BaseGame.js';

export class MazeRace extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Maze Race';
        this.duration = 30000;
        this.maze = [];
        this.cellSize = 30;
        this.mazeWidth = 0;
        this.mazeHeight = 0;
        this.finish = { x: 0, y: 0 };
    }

    init() {
        this.mazeWidth = Math.floor(this.canvas.width / this.cellSize);
        this.mazeHeight = Math.floor(this.canvas.height / this.cellSize);
        this.generateMaze();

        // Set finish at opposite corner
        this.finish = {
            x: (this.mazeWidth - 1) * this.cellSize + this.cellSize / 2,
            y: (this.mazeHeight - 1) * this.cellSize + this.cellSize / 2
        };

        // Reset players at start
        this.players.forEach((player, i) => {
            player.reset(
                this.cellSize / 2 + (i % 2 === 0 ? -10 : 10),
                this.cellSize / 2 + (i < 2 ? -10 : 10)
            );
        });
    }

    generateMaze() {
        // Simple maze generation
        this.maze = [];
        for (let y = 0; y < this.mazeHeight; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.mazeWidth; x++) {
                this.maze[y][x] = (x === 0 || x === this.mazeWidth - 1 || 
                                   y === 0 || y === this.mazeHeight - 1 ||
                                   (x % 3 === 0 && y % 3 === 0 && Math.random() > 0.3)) ? 1 : 0;
            }
        }
    }

    gameUpdate() {
        // Check collisions with walls
        this.players.forEach((player, index) => {
            if (!player.alive) return;

            const gridX = Math.floor(player.x / this.cellSize);
            const gridY = Math.floor(player.y / this.cellSize);

            if (gridX >= 0 && gridX < this.mazeWidth && gridY >= 0 && gridY < this.mazeHeight) {
                if (this.maze[gridY][gridX] === 1) {
                    // Push player back
                    const cellCenterX = gridX * this.cellSize + this.cellSize / 2;
                    const cellCenterY = gridY * this.cellSize + this.cellSize / 2;
                    const angle = Math.atan2(player.y - cellCenterY, player.x - cellCenterX);
                    player.x = cellCenterX + Math.cos(angle) * (this.cellSize / 2 + player.radius);
                    player.y = cellCenterY + Math.sin(angle) * (this.cellSize / 2 + player.radius);
                }
            }

            // Check finish
            const distToFinish = Math.hypot(player.x - this.finish.x, player.y - this.finish.y);
            if (distToFinish < 30) {
                this.scores[index] = 1000;
                player.alive = false;
            } else {
                // Score based on progress
                const progress = 1 - (Math.hypot(player.x - this.finish.x, player.y - this.finish.y) / 
                                     Math.hypot(this.canvas.width, this.canvas.height));
                this.scores[index] = Math.floor(progress * 100);
            }
        });
    }

    gameDraw() {
        // Draw maze
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (this.maze[y][x] === 1) {
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        // Draw finish
        this.ctx.fillStyle = 'gold';
        this.ctx.beginPath();
        this.ctx.arc(this.finish.x, this.finish.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'orange';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
}