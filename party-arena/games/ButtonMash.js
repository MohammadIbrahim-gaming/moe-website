import { BaseGame } from '../core/BaseGame.js';

export class ButtonMash extends BaseGame {
    constructor(canvas, ctx, players, inputManager) {
        super(canvas, ctx, players, inputManager);
        this.name = 'Button Mash';
        this.duration = 20000;
        this.instructionsText = 'Mash your assigned key as fast as you can.';
        this.buttonPresses = [0, 0];
        this.lastKeyState = {};
        this.targetKeys = [];
        this.handlePlayerMovement = false; // Players don't move in this game
    }

    init() {
        this.buttonPresses = [0, 0];
        this.lastKeyState = {};
        
        // Fixed keys per player
        this.targetKeys = ['KeyW', 'ArrowUp'];

        // Reset players (they don't move in this game)
        this.players.forEach((player, i) => {
            player.reset(
                this.canvas.width / 2 + (i % 2 === 0 ? -100 : 100),
                this.canvas.height / 2 + (i < 2 ? -100 : 100)
            );
        });
    }

    gameUpdate() {
        const inputState = this.inputManager.getState();

        this.players.forEach((player, index) => {
            const targetKey = this.targetKeys[index];
            const wasPressed = this.lastKeyState[targetKey] || false;
            const isPressed = inputState[targetKey] || false;

            // Count button presses (key down events)
            if (isPressed && !wasPressed) {
                this.buttonPresses[index]++;
                this.scores[index] = this.buttonPresses[index];
            }

            this.lastKeyState[targetKey] = isPressed;
        });
    }

    gameDraw() {
        // Draw instructions
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        
        this.players.forEach((player, index) => {
            const targetKey = this.targetKeys[index];
            const keyName = targetKey.replace('Key', '').replace('Arrow', '');
            const x = player.x;
            const y = player.y - player.radius - 40;

            this.ctx.fillStyle = player.color;
            this.ctx.fillText(`Mash: ${keyName}`, x, y);
            this.ctx.fillText(`${this.buttonPresses[index]}`, x, y + 30);
        });
    }
}