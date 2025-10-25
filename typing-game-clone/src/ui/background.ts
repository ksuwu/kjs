// Background UI: supports both canvas-based and DOM/CSS-based backgrounds.
class Background {
    private ctx: CanvasRenderingContext2D | null = null;
    private container: HTMLElement | null = null;

    constructor(arg?: HTMLCanvasElement | CanvasRenderingContext2D) {
        if (!arg) {
            // Nothing required — page-level CSS handles the visual background.
            this.container = document.body;
            return;
        }

        if ((arg as HTMLCanvasElement).getContext) {
            this.ctx = (arg as HTMLCanvasElement).getContext('2d');
        } else {
            this.ctx = arg as CanvasRenderingContext2D;
        }
    }

    // Called by the main loop if present; for DOM/CSS backgrounds this is a no-op.
    public draw() {
        if (this.ctx) {
            const c = this.ctx.canvas;
            // simple gradient as a fallback canvas background
            const g = this.ctx.createLinearGradient(0, 0, 0, c.height);
            g.addColorStop(0, '#a8f0ff');
            g.addColorStop(0.5, '#ffe6f2');
            g.addColorStop(1, '#fff7b2');
            this.ctx.fillStyle = g;
            this.ctx.fillRect(0, 0, c.width, c.height);
        }
    }
}

export default Background;