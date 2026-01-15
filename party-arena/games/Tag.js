import { BaseGame } from '../core/BaseGame.js';

export class Tag extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Tag';
        this.duration = 30000;
        this.it = 0; // Player who is "it"
        this.tagCooldown = [0, 0];
        this.cooldownTime = 1000;
    }

    init() {
        this.it = Math.floor(Math.random() * this.players.length);
        this.tagCooldown = [0, 0];

        // Reset players
        this.players.forEach((player, i) => {
            const angle = (i / this.players.length) * Math.PI * 2;
            player.reset(
                this.canvas.width / 2 + Math.cos(angle) * 150,
                this.canvas.height / 2 + Math.sin(angle) * 150
            );
        });
    }

    gameUpdate(deltaTime) {
        // Update cooldowns
        this.tagCooldown = this.tagCooldown.map(cd => Math.max(0, cd - deltaTime));

        // Check tag collisions
        const itPlayer = this.players[this.it];
        if (itPlayer.alive) {
            this.players.forEach((player, index) => {
                if (index === this.it || !player.alive || this.tagCooldown[index] > 0) return;
                
                const dist = Math.hypot(player.x - itPlayer.x, player.y - itPlayer.y);
                if (dist < player.radius + itPlayer.radius + 5) {
                    // Tagged!
                    this.it = index;
                    this.tagCooldown[index] = this.cooldownTime;
                    this.scores[this.it] -= 50; // Being "it" is bad
                }
            });
        }

        // Score for not being "it"
        this.players.forEach((player, index) => {
            if (player.alive && index !== this.it) {
                this.scores[index] += 1;
            }
        });
    }

    gameDraw() {
        // Highlight "it" player
        const itPlayer = this.players[this.it];
        if (itPlayer && itPlayer.alive) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.arc(itPlayer.x, itPlayer.y, itPlayer.radius + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fillStyle = 'red';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('IT', itPlayer.x, itPlayer.y - itPlayer.radius - 15);
        }
    }
}