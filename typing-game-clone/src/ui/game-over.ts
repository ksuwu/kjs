export class GameOver {
    private finalScore: number;
    private startTime: Date;
    private endTime: Date;
    constructor(finalScore: number, startTime: Date, endTime: Date) {
        this.finalScore = finalScore;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public display(): void {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over-screen';
        gameOverScreen.innerHTML = `
            <h1>Game Over!</h1>
            <p>Your final score: ${this.finalScore}</p>
            <p>Time Period: ${this.startTime.toLocaleTimeString()} - ${this.endTime.toLocaleTimeString()}</p>
            <button id="restart-button">Restart</button>
            <button id="exit-button">Exit</button>
        `;

        document.body.appendChild(gameOverScreen);

        document.getElementById('restart-button')?.addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('exit-button')?.addEventListener('click', () => {
            this.exitGame();
        });
    }

    private restartGame(): void {
        // Simple restart: reload the page which will re-initialize the app.
        window.location.reload();
    }

    private exitGame(): void {
        // Logic to exit the game
        window.location.reload();
    }

    private removeGameOverScreen(): void {
        const gameOverScreen = document.querySelector('.game-over-screen');
        if (gameOverScreen) {
            document.body.removeChild(gameOverScreen);
        }
    }
}