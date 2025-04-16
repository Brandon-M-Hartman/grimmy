

export class Token extends HTMLElement {

	dragging:boolean = false;
	mouseDown:boolean = false;

	constructor() {
		super();

		const img = document.createElement("img");
		img.src = "assets/token/background.png";
		img.draggable = false;
		this.appendChild(img);
	}

	// protected addSprites():void {
	// 	this.token = Sprite.from(Assets.get('token.background'));
	// 	this.token.anchor.set(0.5);

	// 	const shadow:Graphics = new Graphics();
	// 	shadow.circle(0, 0, this.getTokenRadius() * 2);
	// 	shadow.fill(0x000000);

	// 	const blurFilter1 = new BlurFilter();
	// 	shadow.filters = [blurFilter1];
	// 	shadow.alpha = 0.4;
	// 	shadow.filterArea = new Rectangle(-100, -100, 200, 200);
		
	// 	this.container = new Container();

	// 	this.container.addChild(this.token);
	// }

	// addEvents():void {
	// 	const DRAG_THRESHOLD:number = 12;

	// 	this.on('pointerdown', (e) => {
	// 		console.log("pressed token");
	// 		this.mousePos.set(e.x, e.y);
	// 		this.mouseDown = true;
	// 		this.emit('focusstart');
	// 	});

	// 	this.on('globalpointermove', (e) => {
	// 		if (this.mouseDown && !this.dragging && TownSquare.enabled) {
	// 			const deltaX = e.x - this.mousePos.x;
	// 			const deltaY = e.y - this.mousePos.y;
	// 			if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
	// 				this.pickup(new Point(e.x, e.y));
	// 			}
	// 		}
	// 	});

	// 	this.on('pointerup', () => {
	// 		this.mouseDown = false;
	// 		this.drop();
	// 		this.emit('focusend');
	// 	});
	// }

	// pickup(pos:Point):void {
	// 	this.emit('dragstart');
	// 	this.dragging = true;
	// 	const globalPos:Point = this.getGlobalPosition();
	// 	this.dragOffset = new Point(globalPos.x - pos.x, globalPos.y - pos.y);
	// 	gsap.killTweensOf(this.container);
	// 	gsap.to(this.container, {
	// 		duration: 0.35,
	// 		y: -25,
	// 		rotation: -0.05,
	// 		ease: "power2.out",
	// 	});
	// }

	// drag(pos:Point):void {
	// 	this.position.x = pos.x + this.dragOffset.x;
	// 	this.position.y = pos.y + this.dragOffset.y;
	// }

	// drop():void {
	// 	this.emit('dragend');
	// 	this.dragging = false;
	// 	gsap.killTweensOf(this.container);
	// 	gsap.to(this.container, {
	// 		duration: 0.2,
	// 		y: 0,
	// 		rotation: 0,
	// 		ease: "power2.in",
	// 	});
	// }

	protected getTokenRadius():number {
		return 115;
	}

	protected makeText(text:string):void {
		const xmlns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(xmlns, "svg");
		svg.setAttribute("width", "300");
		svg.setAttribute("height", "300");
		svg.setAttribute("viewBox", "0 0 300 300");

		// Create <defs> with <path>
		const radius = this.getTokenRadius();
		const defs = document.createElementNS(xmlns, "defs");
		const path = document.createElementNS(xmlns, "path");
		path.setAttribute("id", "circlePath");
		path.setAttribute(
			"d",
			`M 150,150 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius*2},0 a ${radius},${radius} 0 1,1 -${radius*2},0`
		);
		defs.appendChild(path);
		svg.appendChild(defs);

		// Create <text> and <textPath>
		const textElement = document.createElementNS(xmlns, "text");
		textElement.setAttribute("fill", "black");
		textElement.setAttribute("font-size", "26");
		textElement.setAttribute("text-anchor", "middle");
		textElement.setAttribute("transform", "rotate(90 150 150)");

		const textPath = document.createElementNS(xmlns, "textPath");
		textPath.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#circlePath");
		textPath.setAttribute("startOffset", "50%");
		textPath.setAttribute("side", "right");
		textPath.textContent = text;

		textElement.appendChild(textPath);
		svg.appendChild(textElement);

		this.appendChild(svg);
	}
}