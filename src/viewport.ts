import gsap from "gsap";

export class Viewport {
    
    private app:HTMLElement;
    private board:HTMLElement;
    private scale:number = 1.0;
    private targetScale:number = 0.65;
    private x:number = 0;
    private y:number = 0;
    private targetX:number = 0;
    private targetY:number = 0;

    constructor() {
        this.app = document.getElementById('app')!;
        this.board = document.getElementById('board')!;
        this.board.style.transformOrigin = "top left";

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
		this.app.style.backgroundPosition = `${this.x}px ${this.y}px`;
		this.app.style.backgroundSize = `${this.scale * 50}%`;
	}

    pan = (x:number, y:number) => {
        gsap.killTweensOf(this);
		const newX = this.x + x;
		const newY = this.y + y;

		this.board.style.left = `${newX}px`;
		this.board.style.top = `${newY}px`;
		this.app.style.backgroundPosition = `${newX}px ${newY}px`;
    }

    endpan = (x:number, y:number) => {
        this.x += x;
		this.y += y;
		this.targetX = this.x;
		this.targetY = this.y;
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