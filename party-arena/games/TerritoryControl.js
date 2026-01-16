import { BaseGame } from '../core/BaseGame.js';

export class TerritoryControl extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Territory Control';
        this.duration = 30000;
        this.instructionsText = 'Move around to claim tiles. The more territory you control, the higher your score.';
        this.grid = [];
        this.gridSize = 20;
        this.cellSize = 0;
    }

    init() {
        this.cellSize = Math.min(this.canvas.width, this.canvas.height) / this.gridSize;
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = -1; // -1 = unclaimed
            }
        }

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -100 : 100),
                this.canvas.height / 2
            );
        });
    }

    gameUpdate() {
        // Update grid based on player positions
        this.players.forEach((player, playerIndex) => {
            if (!player.alive) return;
            const gridX = Math.floor(player.x / this.cellSize);
            const gridY = Math.floor(player.y / this.cellSize);
            if (gridX >= 0 && gridX < this.gridSize && gridY >= 0 && gridY < this.gridSize) {
                this.grid[gridY][gridX] = playerIndex;
            }
        });

        // Calculate scores as a percentage of the grid
        this.scores = [0, 0];
        const totalCells = this.gridSize * this.gridSize;
        const claimedCounts = [0, 0];
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] >= 0) {
                    claimedCounts[this.grid[y][x]] += 1;
                }
            }
        }
        this.scores[0] = Math.round((claimedCounts[0] / totalCells) * 100);
        this.scores[1] = Math.round((claimedCounts[1] / totalCells) * 100);
    }

    gameDraw() {
        // Draw grid
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const owner = this.grid[y][x];
                if (owner >= 0) {
                    this.ctx.fillStyle = this.players[owner].color;
                    this.ctx.globalAlpha = 0.3;
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    this.ctx.globalAlpha = 1.0;
                }
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
}