import { BaseGame } from '../core/BaseGame.js';

export class DodgeWalls extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Dodge Walls';
        this.duration = 30000;
        this.walls = [];
        this.wallTimer = 0;
        this.wallInterval = 3000;
        this.gapSize = 160;
        this.wallThickness = 30;
        this.maxActiveWalls = 4;
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

            if (this.walls.length < this.maxActiveWalls) {
                const hasHorizontal = this.walls.some(wall => wall.axis === 'h');
                const hasVertical = this.walls.some(wall => wall.axis === 'v');
                let axis = Math.random() < 0.5 ? 'h' : 'v';
                if (axis === 'h' && hasHorizontal && !hasVertical) axis = 'v';
                if (axis === 'v' && hasVertical && !hasHorizontal) axis = 'h';

                const gapHalf = this.gapSize / 2;
                const speed = Math.random() < 0.5 ? 3 : -3;

                if (axis === 'h') {
                    const y = Math.random() * (this.canvas.height - this.wallThickness);
                    const gapCenter = Math.random() * (this.canvas.width - this.gapSize) + gapHalf;
                    const leftWidth = Math.max(0, gapCenter - gapHalf);
                    const rightX = gapCenter + gapHalf;
                    const rightWidth = Math.max(0, this.canvas.width - rightX);

                    if (leftWidth > 0) {
                        this.walls.push({
                            x: 0,
                            y,
                            width: leftWidth,
                            height: this.wallThickness,
                            speed,
                            axis: 'h'
                        });
                    }

                    if (rightWidth > 0) {
                        this.walls.push({
                            x: rightX,
                            y,
                            width: rightWidth,
                            height: this.wallThickness,
                            speed,
                            axis: 'h'
                        });
                    }
                } else {
                    const x = Math.random() * (this.canvas.width - this.wallThickness);
                    const gapCenter = Math.random() * (this.canvas.height - this.gapSize) + gapHalf;
                    const topHeight = Math.max(0, gapCenter - gapHalf);
                    const bottomY = gapCenter + gapHalf;
                    const bottomHeight = Math.max(0, this.canvas.height - bottomY);

                    if (topHeight > 0) {
                        this.walls.push({
                            x,
                            y: 0,
                            width: this.wallThickness,
                            height: topHeight,
                            speed,
                            axis: 'v'
                        });
                    }

                    if (bottomHeight > 0) {
                        this.walls.push({
                            x,
                            y: bottomY,
                            width: this.wallThickness,
                            height: bottomHeight,
                            speed,
                            axis: 'v'
                        });
                    }
                }
            }
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

        // Score for survival (scaled per second)
        this.players.forEach((player, index) => {
            if (player.alive) {
                this.addPointsPerSecond(index, 3, deltaTime);
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