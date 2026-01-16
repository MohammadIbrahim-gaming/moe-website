import { BaseGame } from '../core/BaseGame.js';

export class LastStanding extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Last Standing';
        this.duration = 30000;
        this.instructionsText = "Stay inside the shrinking circle. Player 1 shoots with 'E', Player 2 shoots with Right Shift.";
        this.shrinkingCircle = { x: 0, y: 0, radius: 0, maxRadius: 0 };
        this.minRadius = 120;
        this.shrinkRatePerMs = 0;
        this.projectiles = [];
        this.lastShotTime = [0, 0];
        this.shotCooldown = 400;
    }

    init() {
        this.shrinkingCircle.x = this.canvas.width / 2;
        this.shrinkingCircle.y = this.canvas.height / 2;
        this.shrinkingCircle.maxRadius = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.shrinkingCircle.radius = this.shrinkingCircle.maxRadius;
        this.shrinkRatePerMs = (this.shrinkingCircle.maxRadius - this.minRadius) / this.duration;
        this.projectiles = [];
        this.lastShotTime = [0, 0];

        // Reset players inside the safe circle
        this.players.forEach((player, index) => {
            const angle = (index / this.players.length) * Math.PI * 2;
            const radius = this.shrinkingCircle.radius * 0.6;
            player.reset(
                this.shrinkingCircle.x + Math.cos(angle) * radius,
                this.shrinkingCircle.y + Math.sin(angle) * radius
            );
        });
    }

    gameUpdate(deltaTime = 16.67) {
        const inputState = this.inputManager.getState();

        // Shooting
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
        const speedBoost = this.isSuddenDeath ? 1.4 : 1;
        this.projectiles.forEach(projectile => {
            projectile.x += Math.cos(projectile.angle) * projectile.speed * speedBoost;
            projectile.y += Math.sin(projectile.angle) * projectile.speed * speedBoost;
        });

        // Remove off-screen projectiles
        this.projectiles = this.projectiles.filter(p =>
            p.x > -50 && p.x < this.canvas.width + 50 &&
            p.y > -50 && p.y < this.canvas.height + 50
        );

        // Projectile hits
        this.projectiles = this.projectiles.filter(projectile => {
            let hit = false;
            this.players.forEach((player, playerIndex) => {
                if (playerIndex === projectile.owner || !player.alive) return;
                const dist = Math.hypot(player.x - projectile.x, player.y - projectile.y);
                if (dist < player.radius + projectile.radius) {
                    player.alive = false;
                    hit = true;
                }
            });
            return !hit;
        });

        // Shrink circle
        this.shrinkingCircle.radius -= this.shrinkRatePerMs * deltaTime;
        if (this.shrinkingCircle.radius < this.minRadius) {
            this.shrinkingCircle.radius = this.minRadius;
        }

        // Check if players are outside circle
        let aliveCount = 0;
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            const dist = Math.hypot(player.x - this.shrinkingCircle.x, player.y - this.shrinkingCircle.y);
            if (dist > this.shrinkingCircle.radius) {
                player.alive = false;
            } else {
                this.addPointsPerSecond(index, 3, deltaTime);
                aliveCount += 1;
            }
        });

        if (aliveCount <= 1) {
            this.isComplete = true;
        }
    }

    gameDraw() {
        // Draw shrinking circle
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(this.shrinkingCircle.x, this.shrinkingCircle.y, this.shrinkingCircle.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw projectiles
        this.projectiles.forEach(projectile => {
            this.ctx.fillStyle = this.players[projectile.owner].color;
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}