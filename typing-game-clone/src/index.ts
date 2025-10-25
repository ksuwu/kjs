// Lightweight main entry: wire DOM elements to the Game class.
import Game from './game';

const game = new Game();

function startGame() {
    game.start();
}

// If there is a start button, hook it up; otherwise start immediately.
const startBtn = document.getElementById('startButton');
if (startBtn) {
    startBtn.addEventListener('click', startGame);
} else {
    // auto-start for convenience
    startGame();
}