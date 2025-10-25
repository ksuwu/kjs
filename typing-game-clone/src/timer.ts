// This file manages the game timer, including starting, stopping, and displaying the time remaining.

// Timer now records start/end Date objects and calls onTimeUp(start, end) when time runs out.
class Timer {
    private timeRemaining: number;
    private timerId: number | null = null;
    private onTimeUp: (start: Date, end: Date) => void;
    private startTime: Date | null = null;
    private endTime: Date | null = null;

    constructor(onTimeUp: (start: Date, end: Date) => void, initialTime: number = 60) {
        this.timeRemaining = initialTime;
        this.onTimeUp = onTimeUp;
    }

    start(initialTime?: number) {
        if (typeof initialTime === 'number') this.timeRemaining = initialTime;
        this.startTime = new Date();
        this.endTime = null;

        this.updateDisplay();

        this.stop();
        this.timerId = window.setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateDisplay();
            } else {
                this.stop();
                this.endTime = new Date();
                // call the callback with start and end
                this.onTimeUp(this.startTime as Date, this.endTime);
            }
        }, 1000);
    }

    stop() {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    reset(newTime: number) {
        this.stop();
        this.timeRemaining = newTime;
        this.startTime = null;
        this.endTime = null;
        this.updateDisplay();
    }

    getStartTime(): Date | null {
        return this.startTime;
    }

    getEndTime(): Date | null {
        return this.endTime;
    }

    private updateDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `Time Remaining: ${this.timeRemaining} seconds`;
        }
        // Also update any HUD time display
        const timeRemainingHud = document.querySelector('.hud .time');
        if (timeRemainingHud) {
            (timeRemainingHud as HTMLElement).textContent = `Time Remaining: ${this.timeRemaining}s`;
        }
    }
}

export default Timer;