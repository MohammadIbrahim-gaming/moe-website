import { BaseGame } from '../core/BaseGame.js';

export class CollectCoins extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Collect Coins';
        this.duration = 30000;
        this.instructionsText = 'Collect as many coins as you can. Each coin adds to your score.';
        this.coins = [];
        this.maxCoins = 15;
    }

    init() {
        this.coins = [];
        for (let i = 0; i < this.maxCoins; i++) {
            this.spawnCoin();
        }

        // Reset players
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -100 : 100),
                this.canvas.height / 2 + (i < 2 ? -100 : 100)
            );
        });
    }

    spawnCoin() {
        this.coins.push({
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: Math.random() * (this.canvas.height - 40) + 20,
            radius: 8,
            value: 5
        });
    }

    gameUpdate() {
        // Check coin collection
        this.coins = this.coins.filter(coin => {
            let collected = false;
            this.players.forEach((player, index) => {
                if (!player.alive) return;
                const dist = Math.hypot(player.x - coin.x, player.y - coin.y);
                if (dist < player.radius + coin.radius) {
                    this.scores[index] += coin.value;
                    collected = true;
                }
            });
            return !collected;
        });

        // Spawn new coins
        while (this.coins.length < this.maxCoins) {
            this.spawnCoin();
        }
    }

    gameDraw() {
        // Draw coins
        this.coins.forEach(coin => {
            this.ctx.fillStyle = 'gold';
            this.ctx.beginPath();
            this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'orange';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}