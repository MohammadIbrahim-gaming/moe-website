export class BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.players = players;
        this.inputManager = inputManager;
        this.name = 'Base Game';
        this.duration = 30000; // 30 seconds default
        this.startTime = 0;
        this.isComplete = false;
        this.scores = [0, 0]; // 2 players
    }

    start() {
        this.startTime = Date.now();
        this.isComplete = false;
        this.scores = [0, 0, 0, 0];
        this.init();
    }

    init() {
        // Override in subclasses
    }

    update(deltaTime) {
        if (this.isComplete) return;

        const elapsed = Date.now() - this.startTime;
        if (elapsed >= this.duration) {
            this.isComplete = true;
            return;
        }

        // Convert deltaTime from milliseconds to seconds if needed (it's already in ms from RAF)
        const deltaMs = deltaTime || 16.67; // Default to ~60fps if deltaTime not provided

        // Update players (can be overridden by games that handle movement differently)
        if (this.handlePlayerMovement !== false) {
            const inputState = this.inputManager.getState();
            this.players.forEach(player => {
                if (player.alive) {
                    player.update(inputState);
                    this.constrainPlayer(player);
                }
            });
        }

        this.gameUpdate(deltaTime);
    }

    constrainPlayer(player) {
        player.x = Math.max(player.radius, Math.min(this.canvas.width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(this.canvas.height - player.radius, player.y));
    }

    gameUpdate(deltaTime) {
        // Override in subclasses
    }

    draw() {
        this.gameDraw();
        
        // Draw players
        this.players.forEach(player => {
            player.draw(this.ctx);
        });
    }

    gameDraw() {
        // Override in subclasses
    }

    get timeRemaining() {
        return Math.max(0, (this.duration - (Date.now() - this.startTime)) / 1000);
    }

    getScores() {
        return this.scores;
    }
}