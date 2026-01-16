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
        this.scoreRemainder = [0, 0];
        this.instructionsText = '';
        this.showInstructionsEnabled = false;
    }

    start() {
        this.startTime = Date.now();
        this.isComplete = false;
        this.scores = [0, 0];
        this.scoreRemainder = [0, 0];
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
                    player.update(inputState, deltaMs);
                    this.constrainPlayer(player);
                }
            });
        }

        if (this.players.every(player => !player.alive)) {
            this.isComplete = true;
            return;
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

    addPointsPerSecond(index, ratePerSecond, deltaTime) {
        const increment = (ratePerSecond * deltaTime) / 1000;
        const total = increment + this.scoreRemainder[index];
        const wholePoints = Math.floor(total);
        this.scoreRemainder[index] = total - wholePoints;
        this.scores[index] += wholePoints;
    }

    showInstructionsOverlay() {
        if (!this.showInstructionsEnabled || !this.instructionsText) {
            return;
        }
        if (document.getElementById('party-arena-instructions')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'party-arena-instructions';
        overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); color: white; display: flex; align-items: center; justify-content: center; font-family: Arial; z-index: 9999; text-align: center; padding: 24px;';
        overlay.innerHTML = `
            <div style="max-width: 520px; background: rgba(0,0,0,0.35); padding: 24px; border-radius: 16px;">
                <h2 style="margin-bottom: 12px;">${this.name}</h2>
                <p style="margin-bottom: 16px;">${this.instructionsText}</p>
                <button style="padding: 10px 16px; border: none; border-radius: 6px; background: #22c55e; color: white; font-weight: 600; cursor: pointer;">Start</button>
            </div>
        `;
        overlay.querySelector('button').addEventListener('click', () => {
            overlay.remove();
        });
        document.body.appendChild(overlay);
    }
}