import { BaseGame } from '../core/BaseGame.js';

export class CaptureFlag extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Capture Flag';
        this.duration = 30000;
        this.instructionsText = "Capture the opponent’s flag and return it to your base. Player 1 shoots with 'E' and Player 2 shoots with Right Shift.";
        this.flags = [];
        this.playerHasFlag = [-1, -1];
        this.flagBases = [];
        this.projectiles = [];
        this.lastShotTime = [0, 0];
        this.shotCooldown = 400;
    }

    init() {
        // Create flags (2 flags for 2 players)
        this.flagBases = [
            { x: 120, y: this.canvas.height - 120 },
            { x: this.canvas.width - 120, y: 120 }
        ];
        this.flags = [
            { x: this.flagBases[0].x, y: this.flagBases[0].y, captured: false, owner: -1 },
            { x: this.flagBases[1].x, y: this.flagBases[1].y, captured: false, owner: -1 }
        ];

        this.playerHasFlag = [-1, -1];
        this.projectiles = [];
        this.lastShotTime = [0, 0];

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.flagBases[i].x + (i === 0 ? 40 : -40),
                this.flagBases[i].y + (i === 0 ? -40 : 40)
            );
        });
    }

    gameUpdate(deltaTime) {
        const inputState = this.inputManager.getState();

        // Shoot projectiles
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const shootKey = index === 0 ? 'KeyE' : 'ShiftRight';
            const now = Date.now();
            if (inputState[shootKey] && now - this.lastShotTime[index] > this.shotCooldown) {
                this.lastShotTime[index] = now;
                this.projectiles.push({
                    x: player.x,
                    y: player.y,
                    angle: player.angle,
                    speed: 7,
                    owner: index,
                    radius: 5
                });
            }
        });

        // Update projectiles
        this.projectiles.forEach(projectile => {
            projectile.x += Math.cos(projectile.angle) * projectile.speed;
            projectile.y += Math.sin(projectile.angle) * projectile.speed;
        });

        // Remove off-screen projectiles
        this.projectiles = this.projectiles.filter(p =>
            p.x > -50 && p.x < this.canvas.width + 50 &&
            p.y > -50 && p.y < this.canvas.height + 50
        );

        // Handle projectile hits (flag reset only)
        this.projectiles = this.projectiles.filter(projectile => {
            let hit = false;
            this.players.forEach((player, playerIndex) => {
                if (playerIndex === projectile.owner || !player.alive) return;
                const dist = Math.hypot(player.x - projectile.x, player.y - projectile.y);
                if (dist < player.radius + projectile.radius) {
                    hit = true;
                    if (this.playerHasFlag[playerIndex] >= 0) {
                        const flagIndex = this.playerHasFlag[playerIndex];
                        this.flags[flagIndex].captured = false;
                        this.flags[flagIndex].owner = -1;
                        this.flags[flagIndex].x = this.flagBases[flagIndex].x;
                        this.flags[flagIndex].y = this.flagBases[flagIndex].y;
                        this.playerHasFlag[playerIndex] = -1;
                    }
                }
            });
            return !hit;
        });

        // Check flag capture
        this.flags.forEach((flag, flagIndex) => {
            if (flag.captured) return;

            this.players.forEach((player, playerIndex) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - flag.x, player.y - flag.y);
                if (dist < player.radius + 20) {
            if (playerIndex !== flagIndex) {
                        flag.captured = true;
                        flag.owner = playerIndex;
                        this.playerHasFlag[playerIndex] = flagIndex;
                    }
                }
            });
        });

        // Score when capturing and returning opposing flag
        this.players.forEach((player, index) => {
            const carryingFlag = this.playerHasFlag[index];
            if (carryingFlag >= 0) {
                const base = this.flagBases[index];
                const distToBase = Math.hypot(player.x - base.x, player.y - base.y);
                if (distToBase < 30) {
                    this.scores[index] += 20;
                    // Reset the captured flag
                    this.flags[carryingFlag].captured = false;
                    this.flags[carryingFlag].owner = -1;
                    this.flags[carryingFlag].x = this.flagBases[carryingFlag].x;
                    this.flags[carryingFlag].y = this.flagBases[carryingFlag].y;
                    this.playerHasFlag[index] = -1;
                }
            }
        });
    }

    gameDraw() {
        // Draw bases
        this.flagBases.forEach((base, index) => {
            this.ctx.strokeStyle = this.players[index].color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(base.x, base.y, 28, 0, Math.PI * 2);
            this.ctx.stroke();
        });

        // Draw flags
        this.flags.forEach((flag, flagIndex) => {
            if (!flag.captured) {
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(flag.x, flag.y, 20, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.font = '20px serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                const emoji = this.players[flagIndex]?.avatar || '🏁';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(emoji, flag.x, flag.y);
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

        // Draw projectiles
        this.projectiles.forEach(projectile => {
            this.ctx.fillStyle = this.players[projectile.owner].color;
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}