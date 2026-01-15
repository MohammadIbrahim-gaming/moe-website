import { BaseGame } from '../core/BaseGame.js';

export class ColorCapture extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Color Capture';
        this.duration = 25000;
        this.zones = [];
    }

    init() {
        // Create colored zones
        this.zones = [];
        const zoneCount = 8;
        for (let i = 0; i < zoneCount; i++) {
            this.zones.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                radius: 40,
                owner: -1,
                color: `hsl(${i * 45}, 70%, 50%)`
            });
        }

        // Reset players to center
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i === 0 ? -50 : 50),
                this.canvas.height / 2
            );
        });
    }

    gameUpdate() {
        // Check zone captures
        this.zones.forEach(zone => {
            this.players.forEach((player, playerIndex) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - zone.x, player.y - zone.y);
                if (dist < zone.radius) {
                    zone.owner = playerIndex;
                }
            });
        });

        // Update scores based on zone ownership
        this.scores = [0, 0];
        this.zones.forEach(zone => {
            if (zone.owner >= 0) {
                this.scores[zone.owner] += 10;
            }
        });
    }

    gameDraw() {
        // Draw zones
        this.zones.forEach(zone => {
            this.ctx.fillStyle = zone.owner >= 0 ? this.players[zone.owner].color : zone.color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}