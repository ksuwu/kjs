// Core game: lightweight, DOM-driven so it works with the existing index.html structure.
import Timer from './timer';
import { HUD } from './ui/hud';
import { GameOver } from './ui/game-over';

class Game {
    private words: string[] = [];
    private currentWordIndex: number = 0;
    public score: number = 0;
    private timer: Timer;
    private hud: HUD;
    private isGameOver: boolean = false;

    constructor() {
        // onTimeUp receives start and end times
        this.timer = new Timer((start, end) => this.onTimeUp(start, end), 60);
        this.hud = new HUD();
        this.loadWords();
        this.setupInput();
    }

    private loadWords() {
        // small default list; can be expanded
        this.words = ['apple', 'banana', 'cherry', 'date', 'fig', 'grape', 'kiwi', 'orange', 'lemon', 'melon'];
    }

    public start() {
        this.isGameOver = false;
        this.score = 0;
        this.currentWordIndex = 0;
        this.hud.updateScore(this.score);
        this.displayCurrentWord();
        this.timer.start(60);
    }

    private displayCurrentWord() {
        const display = document.getElementById('word-display');
        if (!display) return;
        if (this.currentWordIndex < this.words.length) {
            display.textContent = this.words[this.currentWordIndex];
        } else {
            display.textContent = '';
        }
    }

    private setupInput() {
        const input = document.getElementById('user-input') as HTMLInputElement | null;
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value.length === 0) return;
                this.onInput(value);
                input.value = '';
            }
        });
    }

    private onInput(value: string) {
        if (this.isGameOver) return;
        const current = this.words[this.currentWordIndex];
        if (!current) return;
        if (value === current) {
            this.score++;
            this.currentWordIndex++;
            this.hud.updateScore(this.score);
            this.displayCurrentWord();
        }
    }

    private onTimeUp(start: Date, end: Date) {
        this.endGame(start, end);
    }

    private endGame(start: Date, end: Date) {
        this.isGameOver = true;
        this.timer.stop();
        const gameOver = new GameOver(this.score, start, end);
        gameOver.display();
    }
}

export default Game;