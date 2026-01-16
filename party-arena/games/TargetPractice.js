import { BaseGame } from '../core/BaseGame.js';

export class TargetPractice extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Target Practice';
        this.duration = 30000;
        this.targets = [];
        this.maxTargets = 8;
        this.projectiles = [];
    }

    init() {
        this.targets = [];
        this.projectiles = [];

        for (let i = 0; i < this.maxTargets; i++) {
            this.spawnTarget();
        }

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -100 : 100),
                this.canvas.height / 2 + (i < 2 ? -100 : 100)
            );
        });
    }

    spawnTarget() {
        this.targets.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50,
            radius: 25,
            value: 10
        });
    }

    gameUpdate() {
        // Spawn projectiles when players move
        const inputState = this.inputManager.getState();
        this.players.forEach((player, index) => {
            if (!player.alive) return;
            if (inputState[player.controls.up] || inputState[player.controls.down] ||
                inputState[player.controls.left] || inputState[player.controls.right]) {
                if (Math.random() < 0.05) {
                    this.projectiles.push({
                        x: player.x,
                        y: player.y,
                        angle: player.angle,
                        speed: 5,
                        owner: index,
                        radius: 5
                    });
                }
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

        // Check target hits
        this.targets = this.targets.filter(target => {
            let hit = false;
            this.projectiles.forEach((projectile, projIndex) => {
                const dist = Math.hypot(projectile.x - target.x, projectile.y - target.y);
                if (dist < target.radius) {
                    this.scores[projectile.owner] += target.value;
                    hit = true;
                    this.projectiles.splice(projIndex, 1);
                }
            });
            return !hit;
        });

        // Spawn new targets
        while (this.targets.length < this.maxTargets) {
            this.spawnTarget();
        }
    }

    gameDraw() {
        // Draw targets
        this.targets.forEach(target => {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
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