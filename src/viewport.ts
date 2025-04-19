import gsap from "gsap";

export class Viewport {

    public scale:number = 1.0;
    public x:number = 0;
    public y:number = 0;
    public enabled:boolean = true;

    private app:HTMLElement;
    private background:HTMLElement;
    private board:HTMLElement;
    private targetScale:number = 0.65;
    private targetX:number = 0;
    private targetY:number = 0;

    constructor() {
        this.background = document.getElementById('background')!;
        this.app = document.getElementById('app')!;
        this.board = document.getElementById('board')!;

        this.targetX = window.innerWidth/2;
        this.targetY = window.innerHeight/2;
        this.x = this.targetX;
        this.y = this.targetY;
        this.updateTransform();
        this.zoom(-0.1, this.targetX, this.targetY);
    }

	updateTransform = () => {
		this.board.style.transform = `scale(${this.scale})`;
		this.board.style.left = `${this.x}px`;
		this.board.style.top = `${this.y}px`;

		// Match background to "logical" board position, scaled
		this.background.style.backgroundPosition = `${this.x}px ${this.y}px`;
		this.background.style.backgroundSize = `${this.scale * 10}%`;
	}

    pan = (x:number, y:number) => {
        if (!this.enabled) return;

        gsap.killTweensOf(this);
		const newX = this.x + x;
		const newY = this.y + y;

		this.board.style.left = `${newX}px`;
		this.board.style.top = `${newY}px`;
		this.background.style.backgroundPosition = `${newX}px ${newY}px`;
    }

    endpan = (x:number, y:number) => {
        if (!this.enabled) return;

        this.x += x;
		this.y += y;
		this.targetX = this.x;
		this.targetY = this.y;
        this.updateTransform();
    }

    zoom = (amount:number, centerX:number, centerY:number) => {
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
		gsap.to(this, { scale: this.targetScale, duration: 0.5, ease: "power2.out", onUpdate:this.updateTransform });
		gsap.to(this, { x: this.targetX, duration: 0.5, ease: "power2.out", onUpdate:this.updateTransform });
		gsap.to(this, { y: this.targetY, duration: 0.5, ease: "power2.out", onUpdate:this.updateTransform });
    }

    pinchZoom = (scale:number, centerX:number, centerY:number) => {
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
        
        this.updateTransform();
    }

    getScale():number {
        return this.scale
    }
}