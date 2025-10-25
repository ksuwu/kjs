export class HUD {
    private score: number;
    private timeRemaining: number;
    private gameState: GameState | string;
    private startTime: Date | null = null;
    private endTime: Date | null = null;

    constructor() {
        this.score = 0;
        this.timeRemaining = 60; // Default time in seconds
    this.gameState = 'PAUSED';
    }

    public updateScore(newScore: number): void {
        this.score = newScore;
        this.render();
    }

    public updateTime(time: number): void {
        this.timeRemaining = time;
        this.render();
    }

    public setGameState(state: GameState | string): void {
        this.gameState = state;
        this.render();
    }

    public setStartTime(t: Date) {
        this.startTime = t;
        this.render();
    }

    public setEndTime(t: Date) {
        this.endTime = t;
        this.render();
    }

    private render(): void {
        const hudElement = document.getElementById('hud');
        if (hudElement) {
            const startStr = this.startTime ? this.startTime.toLocaleTimeString() : '--';
            const endStr = this.endTime ? this.endTime.toLocaleTimeString() : '--';
            hudElement.innerHTML = `
                <div class="hud">
                    <div class="score">Score: ${this.score}</div>
                    <div class="time">Time Remaining: ${this.timeRemaining}s</div>
                    <div class="period">Time Period: ${startStr} - ${endStr}</div>
                    <div class="state">State: ${this.gameState}</div>
                </div>
            `;
        }
    }
}