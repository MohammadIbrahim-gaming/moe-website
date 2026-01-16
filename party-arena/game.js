window.PARTY_ARENA_LOADED = false;

import { GameManager } from './core/GameManager.js';
import { InputManager } from './core/InputManager.js';
import { Player } from './core/Player.js';

// Import all 20 mini-games
import { ColorCapture } from './games/ColorCapture.js';
import { KingOfTheHill } from './games/KingOfTheHill.js';
import { LastStanding } from './games/LastStanding.js';
import { CollectCoins } from './games/CollectCoins.js';
import { AvoidBombs } from './games/AvoidBombs.js';
import { RaceToFinish } from './games/RaceToFinish.js';
import { Tag } from './games/Tag.js';
import { TerritoryControl } from './games/TerritoryControl.js';
import { Survival } from './games/Survival.js';
import { CollectItems } from './games/CollectItems.js';
import { PushOut } from './games/PushOut.js';
import { CaptureFlag } from './games/CaptureFlag.js';
import { Sumo } from './games/Sumo.js';
import { Snakes } from './games/Snakes.js';
import { DodgeWalls } from './games/DodgeWalls.js';
import { Platformer } from './games/Platformer.js';
import { MazeRace } from './games/MazeRace.js';
import { TargetPractice } from './games/TargetPractice.js';
import { ButtonMash } from './games/ButtonMash.js';
import { MemoryMatch } from './games/MemoryMatch.js';

function showInitError(message) {
    const existing = document.getElementById('party-arena-init-error');
    if (existing) {
        existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'party-arena-init-error';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); color: white; display: flex; align-items: center; justify-content: center; font-family: Arial; z-index: 9999; text-align: center; padding: 24px;';
    overlay.innerHTML = `
        <div style="max-width: 520px;">
            <h2 style="margin-bottom: 12px;">Game failed to load</h2>
            <p style="margin-bottom: 16px;">${message}</p>
            <button style="padding: 10px 16px; border: none; border-radius: 6px; background: #22c55e; color: white; font-weight: 600; cursor: pointer;">Reload</button>
        </div>
    `;
    overlay.querySelector('button').addEventListener('click', () => window.location.reload());
    document.body.appendChild(overlay);
}

function initializeGame() {
    console.log('Initializing game...');
    
    // Declare variables in outer scope so functions can access them
    let canvas, ctx;
    let gameManager;
    let inputManager;
    let players = [];
    let menuScreen, gameScreen, roundTransition, gameOverScreen;
    
    try {
        // Initialize game
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1200;
        canvas.height = 800;

        // Screen elements
        menuScreen = document.getElementById('menu-screen');
        gameScreen = document.getElementById('game-screen');
        roundTransition = document.getElementById('round-transition');
        gameOverScreen = document.getElementById('game-over-screen');

        // Menu buttons
        const startButton = document.getElementById('start-game');
        const playAgainButton = document.getElementById('play-again');
        const backToMenuButton = document.getElementById('back-to-menu');

        if (startButton) {
            startButton.addEventListener('click', () => {
                console.log('Start button clicked');
                startGame();
            });
        } else {
            console.error('Start button not found!');
        }
        if (playAgainButton) {
            playAgainButton.addEventListener('click', startGame);
        }
        if (backToMenuButton) {
            backToMenuButton.addEventListener('click', () => {
                gameOverScreen.classList.remove('active');
                menuScreen.classList.add('active');
            });
        }
        
        window.PARTY_ARENA_LOADED = true;
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        showInitError(`Error loading game: ${error.message}`);
        return;
    }

    // All available games
    const allGames = [
        ColorCapture,
        KingOfTheHill,
        LastStanding,
        CollectCoins,
        AvoidBombs,
        RaceToFinish,
        Tag,
        TerritoryControl,
        Survival,
        CollectItems,
        PushOut,
        CaptureFlag,
        Sumo,
        Snakes,
        DodgeWalls,
        Platformer,
        MazeRace,
        TargetPractice,
        ButtonMash,
        MemoryMatch
    ];

    function startGame() {
        console.log('Starting game...');
        try {
            // Hide menu, show game
            menuScreen.classList.remove('active');
            gameOverScreen.classList.remove('active');
            gameScreen.classList.add('active');

            // Get player names
            const playerNames = [
                document.getElementById('player1-name').value || 'Player 1',
                document.getElementById('player2-name').value || 'Player 2'
            ];

            const playerAvatars = [
                document.getElementById('player1-avatar')?.value || '😎',
                document.getElementById('player2-avatar')?.value || '🦊'
            ];

            // Create players (2 players only)
            players = [
                new Player(0, playerNames[0], { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', boost: 'KeyQ' }, '#FF6B6B', playerAvatars[0]),
                new Player(1, playerNames[1], { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', boost: 'Slash' }, '#4ECDC4', playerAvatars[1])
            ];

            // Initialize input manager
            inputManager = new InputManager();

            // Initialize game manager
            gameManager = new GameManager(canvas, ctx, players, allGames, {
                onRoundComplete: showRoundTransition,
                onGameComplete: showGameOver,
                onUpdateUI: updateUI
            }, inputManager);

            // Start game loop
            gameManager.start();
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Error starting game: ' + error.message);
        }
    }

    function showRoundTransition(scores) {
        gameScreen.classList.remove('active');
        roundTransition.classList.add('active');

        const roundScoresDiv = document.getElementById('round-scores');
        roundScoresDiv.innerHTML = '<h3>Round Scores:</h3>';
        
        players.forEach((player, index) => {
            const score = scores[index] || 0;
            const div = document.createElement('div');
            div.textContent = `${player.name}: +${score} points`;
            div.style.color = player.color;
            roundScoresDiv.appendChild(div);
        });

        let countdown = 3;
        const countdownEl = document.getElementById('countdown');
        countdownEl.textContent = `Next round in: ${countdown}`;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownEl.textContent = `Next round in: ${countdown}`;
            } else {
                clearInterval(countdownInterval);
                roundTransition.classList.remove('active');
                gameScreen.classList.add('active');
                gameManager.nextRound();
            }
        }, 1000);
    }

    function showGameOver(finalScores) {
        gameScreen.classList.remove('active');
        gameOverScreen.classList.add('active');

        const finalScoresDiv = document.getElementById('final-scores');
        finalScoresDiv.innerHTML = '';

        // Sort players by score
        const sortedPlayers = players.map((p, i) => ({
            player: p,
            score: finalScores[i] || 0
        })).sort((a, b) => b.score - a.score);

        // Show winner
        const winnerDiv = document.createElement('div');
        winnerDiv.className = 'winner';
        winnerDiv.textContent = `🏆 Winner: ${sortedPlayers[0].player.name} with ${sortedPlayers[0].score} points!`;
        finalScoresDiv.appendChild(winnerDiv);

        // Show all scores
        sortedPlayers.forEach(({ player, score }) => {
            const div = document.createElement('div');
            div.className = 'final-score-item';
            div.textContent = `${player.name}: ${score} points`;
            div.style.color = player.color;
            finalScoresDiv.appendChild(div);
        });
    }

    function updateUI(round, timer, gameTitle, scores) {
        const roundInfo = document.getElementById('round-info');
        const timerEl = document.getElementById('timer');
        const gameTitleEl = document.getElementById('game-title');
        
        if (roundInfo) roundInfo.textContent = `Round ${round} / 15`;
        if (timerEl) timerEl.textContent = Math.ceil(timer);
        if (gameTitleEl) gameTitleEl.textContent = gameTitle;

        // Update scores for 2 players
        players.forEach((player, index) => {
            const scoreEl = document.getElementById(`score-p${index + 1}`);
            if (scoreEl) {
                scoreEl.textContent = `${player.name}: ${scores[index] || 0}`;
                scoreEl.style.color = player.color;
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}