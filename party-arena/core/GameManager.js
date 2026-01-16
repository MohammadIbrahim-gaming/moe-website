import { InputManager } from './InputManager.js';

export class GameManager {
    constructor(canvas, ctx, players, gameClasses, callbacks, inputManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.players = players;
        this.gameClasses = gameClasses;
        this.callbacks = callbacks;
        this.inputManager = inputManager || new InputManager();

        this.currentRound = 0;
        this.totalRounds = 15;
        this.scores = [0, 0]; // 2 players
        this.currentGame = null;
        this.gameInstance = null;
        this.animationFrame = null;
        this.lastTime = 0;
        this.roundGameOrder = [];
    }

    start() {
        this.roundGameOrder = [...this.gameClasses].sort(() => Math.random() - 0.5);
        this.nextRound();
        this.gameLoop(0);
    }

    nextRound() {
        this.currentRound++;

        if (this.currentRound > this.totalRounds) {
            this.callbacks.onGameComplete(this.scores);
            return;
        }

        // Select a non-repeating game for this match
        const gameIndex = (this.currentRound - 1) % this.roundGameOrder.length;
        const GameClass = this.roundGameOrder[gameIndex];
        this.gameInstance = new GameClass(this.canvas, this.ctx, this.players, this.inputManager);

        // Reset players
        this.players.forEach(player => {
            player.alive = true;
        });

        // Start the game
        this.gameInstance.start();
    }

    gameLoop(timestamp) {
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }
        const deltaTime = Math.min(timestamp - this.lastTime, 100); // Cap at 100ms to prevent large jumps
        this.lastTime = timestamp;

        if (this.gameInstance && !this.gameInstance.isComplete) {
            // Update game
            this.gameInstance.update(deltaTime);

            // Draw game
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.gameInstance.draw();

            // Update UI
            if (this.callbacks.onUpdateUI) {
                this.callbacks.onUpdateUI(
                    this.currentRound,
                    this.gameInstance.timeRemaining,
                    this.gameInstance.name,
                    this.scores
                );
            }

            // Check if game is complete
            if (this.gameInstance.isComplete) {
                const roundScores = this.gameInstance.getScores();
                
                // Add round scores to total
                roundScores.forEach((score, index) => {
                    this.scores[index] += score;
                });

                // Show round transition
                setTimeout(() => {
                    this.callbacks.onRoundComplete(roundScores);
                }, 1000);
            }
        }

        this.animationFrame = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}