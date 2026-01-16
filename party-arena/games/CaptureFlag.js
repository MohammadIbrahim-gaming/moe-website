import { BaseGame } from '../core/BaseGame.js';

export class CaptureFlag extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Capture Flag';
        this.duration = 30000;
        this.flags = [];
        this.playerHasFlag = [-1, -1];
    }

    init() {
        // Create flags (2 flags for 2 players)
        this.flags = [
            { x: 100, y: 100, captured: false, owner: -1 },
            { x: this.canvas.width - 100, y: this.canvas.height - 100, captured: false, owner: -1 }
        ];

        this.playerHasFlag = [-1, -1];

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -50 : 50),
                this.canvas.height / 2
            );
        });
    }

    gameUpdate(deltaTime) {
        // Check flag capture
        this.flags.forEach((flag, flagIndex) => {
            if (flag.captured) return;

            this.players.forEach((player, playerIndex) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - flag.x, player.y - flag.y);
                if (dist < player.radius + 20) {
                    flag.captured = true;
                    flag.owner = playerIndex;
                    this.playerHasFlag[playerIndex] = flagIndex;
                }
            });
        });

        // Score for captured flags (scaled per second)
        this.players.forEach((player, index) => {
            if (this.playerHasFlag[index] >= 0) {
                this.addPointsPerSecond(index, 4, deltaTime);
            }
        });
    }

    gameDraw() {
        // Draw flags
        this.flags.forEach(flag => {
            if (!flag.captured) {
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(flag.x, flag.y, 20, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            } else {
                // Draw flag on player
                const player = this.players[flag.owner];
                if (player && player.alive) {
                    this.ctx.fillStyle = player.color;
                    this.ctx.beginPath();
                    this.ctx.arc(player.x, player.y - player.radius - 15, 12, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });
    }
}