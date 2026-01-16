import { BaseGame } from '../core/BaseGame.js';

export class CollectItems extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Collect Items';
        this.duration = 30000;
        this.instructionsText = 'Collect items for points. Stars are worth the most.';
        this.items = [];
        this.maxItems = 10;
        this.itemTypes = ['coin', 'gem', 'star'];
    }

    init() {
        this.items = [];
        for (let i = 0; i < this.maxItems; i++) {
            this.spawnItem();
        }

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -100 : 100),
                this.canvas.height / 2 + (i < 2 ? -100 : 100)
            );
        });
    }

    spawnItem() {
        const type = this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
        let value = 5;
        if (type === 'gem') value = 15;
        if (type === 'star') value = 25;

        this.items.push({
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: Math.random() * (this.canvas.height - 40) + 20,
            radius: 10,
            type,
            value
        });
    }

    gameUpdate() {
        // Check item collection
        this.items = this.items.filter(item => {
            let collected = false;
            this.players.forEach((player, index) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - item.x, player.y - item.y);
                if (dist < player.radius + item.radius) {
                    this.scores[index] += item.value;
                    collected = true;
                }
            });
            return !collected;
        });

        // Spawn new items
        while (this.items.length < this.maxItems) {
            this.spawnItem();
        }
    }

    gameDraw() {
        // Draw items
        this.items.forEach(item => {
            if (item.type === 'coin') {
                this.ctx.fillStyle = 'gold';
            } else if (item.type === 'gem') {
                this.ctx.fillStyle = 'purple';
            } else {
                this.ctx.fillStyle = 'yellow';
            }
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}