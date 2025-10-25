// This file contains the overall game logic, including starting and stopping the game, and managing the game state.

import { Game } from './game';
import { Timer } from './timer';
import { Background } from './ui/background';
import { HUD } from './ui/hud';
import { GameOver } from './ui/game-over';

class Main {
    private game: Game;
    private timer: Timer;
    private background: Background;
    private hud: HUD;
    private gameOver: GameOver;

    constructor() {
        this.background = new Background();
        this.hud = new HUD();
        this.gameOver = new GameOver();
        this.game = new Game(this.hud, this.gameOver);
        this.timer = new Timer(this.hud, this.endGame.bind(this));
    }

    public startGame(): void {
        this.background.load();
        this.hud.reset();
        this.timer.start();
        this.game.start();
    }

    public endGame(): void {
        this.timer.stop();
        this.game.stop();
        this.gameOver.display(this.game.getScore());
    }
}

const main = new Main();
main.startGame();