import gsap from "gsap";

export class Viewport {

    public scale:number = 1.0;
    public x:number = 0;
    public y:number = 0;
    public enabled:boolean = true;
    public onPanned:(x:number, y:number) => void;

    private app:HTMLElement;
    private background:HTMLElement;
    private board:HTMLElement;
    private targetScale:number = 0.65;
    private targetX:number = 0;
    private targetY:number = 0;
    private pinchScaled:boolean = false;

    constructor() {
        this.background = document.getElementById('background')!;
        this.app = document.getElementById('app')!;
        this.board = document.getElementById('board')!;
        this.onPanned = () => {};

        this.targetX = window.innerWidth/2;
        this.targetY = window.innerHeight/2;
        this.x = this.targetX;
        this.y = this.targetY;
        this.updateTransform();
        this.zoom(-0.1, this.targetX, this.targetY);
    }

	updateTransform():void {
		this.board.style.transform = `scale(${this.scale})`;
		this.board.style.left = `${this.x}px`;
		this.board.style.top = `${this.y}px`;

		// Match background to "logical" board position, scaled
		this.background.style.backgroundPosition = `${this.x}px ${this.y}px`;
		this.background.style.backgroundSize = `${this.scale * 15}%`;

        this.onPanned(this.x, this.y);
	}

    pan(x:number, y:number):void {
        if (!this.enabled) return;

        gsap.killTweensOf(this);
		const newX = this.x + x;
		const newY = this.y + y;

		this.board.style.left = `${newX}px`;
		this.board.style.top = `${newY}px`;
		this.background.style.backgroundPosition = `${newX}px ${newY}px`;

        this.onPanned(newX, newY);
    }

    endpan(x:number, y:number):void {
        if (!this.enabled) return;

        if (this.pinchScaled) {
            this.pinchScaled = false;
            return;
        }

        this.x += x;
		this.y += y;
		this.targetX = this.x;
		this.targetY = this.y;

        this.onPanned(this.x, this.y);
    }

    zoom(amount:number, centerX:number, centerY:number):void {
        if (!this.enabled) return;

        const rect = this.app.getBoundingClientRect();
		const mouseX = centerX - rect.left;
		const mouseY = centerY - rect.top;

		const prevScale = this.targetScale;
		this.targetScale += amount;
		this.targetScale = Math.min(Math.max(0.2, this.targetScale), 1.0);

		// Calculate scale delta
		const scaleFactor = this.targetScale / prevScale;
		this.targetX = mouseX - (mouseX - this.targetX) * scaleFactor;
		this.targetY = mouseY - (mouseY - this.targetY) * scaleFactor;

		gsap.killTweensOf(this);
		gsap.to(this, { scale: this.targetScale, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
		gsap.to(this, { x: this.targetX, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
		gsap.to(this, { y: this.targetY, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
    }

    pinchZoom(scale:number, centerX:number, centerY:number):void {
        if (!this.enabled) return;

        this.pinchScaled = true;

        const rect = this.app.getBoundingClientRect();
		const mouseX = centerX - rect.left;
		const mouseY = centerY - rect.top;

        const prevScale = this.scale;
		this.targetScale = Math.min(Math.max(0.2, scale), 1.0);
        this.scale = this.targetScale;
        
		// Calculate scale delta
		const scaleFactor = this.targetScale / prevScale;
		this.targetX = mouseX - (mouseX - this.targetX) * scaleFactor;
		this.targetY = mouseY - (mouseY - this.targetY) * scaleFactor;
        this.x = this.targetX;
        this.y = this.targetY;
        
        requestAnimationFrame(() => this.updateTransform());
    }

    getScale():number {
        return this.scale
    }

    recenter():void {
        this.targetX = window.innerWidth/2;
        this.targetY = window.innerHeight/2;

		gsap.to(this, { scale: 0.5, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
		gsap.to(this, { x: this.targetX, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
		gsap.to(this, { y: this.targetY, duration: 0.7, ease: "power2.out", onUpdate:() => this.updateTransform() });
    }

    convertToScreen(pos:{ x:number, y:number }):{ x:number, y:number } {
        const screenX = (pos.x * this.scale) + this.x;
        const screenY = (pos.y * this.scale) + this.y;
        return { x: screenX, y: screenY };
    }

    convertToBoard(pos:{ x:number, y:number }):{ x:number, y:number } {
        const boardX = (pos.x - this.x) / this.scale;
        const boardY = (pos.y - this.y) / this.scale;
        return { x: boardX, y: boardY };
    }
}