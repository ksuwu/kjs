interface Word {
    text: string;
    isTyped: boolean;
}

interface GameState {
    score: number;
    timeRemaining: number;
    isGameOver: boolean;
    words: Word[];
}

interface Timer {
    startTime: number;
    duration: number;
    isRunning: boolean;
}

interface HUD {
    score: number;
    timeRemaining: number;
}

interface GameOver {
    finalScore: number;
    restart: () => void;
    exit: () => void;
}

interface Background {
    imageUrl: string;
    load: () => void;
    render: () => void;
}