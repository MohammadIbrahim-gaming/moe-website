export class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isPressed(keyCode) {
        return this.keys[keyCode] || false;
    }

    getState() {
        return this.keys;
    }
}