import Hammer from "hammerjs";
import { Application } from "./application";

export enum TokenType {
	UNKNOWN,
	PLAYER,
	REMINDER
}

export class Token extends HTMLElement {

	public pos = { x: 0, y: 0 };
	public type:TokenType = TokenType.UNKNOWN;
	
	private dragEnabled:boolean = true;
	private dragging:boolean = false;
	protected container:HTMLElement;
	protected background:HTMLImageElement;
	protected textPath:SVGTextPathElement;

	constructor() {
		super();

		this.classList.add("token");

		this.container = document.createElement("div");
		this.container.className = "container";
		this.appendChild(this.container);

		this.background = document.createElement("img");
		this.background.className = "background";
		this.background.src = "assets/token/background.png";
		this.background.draggable = false;
		this.container.appendChild(this.background);

		this.textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
	}

	bindEvents():void {
		const hitArea = document.createElement("div");
		hitArea.className = "hit-area";
		this.container.appendChild(hitArea);
		
		const hammer = new Hammer(hitArea);
		hammer.get('pan').set({ threshold: 0 });
		hammer.get('tap').set({ enable: true });

		const board = document.getElementById('board')!;

		let tapTime:NodeJS.Timeout;
		hammer.on('tap', (e) => {
			clearTimeout(tapTime);
			tapTime = setTimeout(() => {
				if (e.tapCount == 1) this.onTokenTapped();
				else if (e.tapCount == 2) this.onTokenDoubleTapped();
			}, 200);
		});

		hammer.on('panstart', () => {
			this.dragging = true;

			if (this.dragEnabled) {
				const rect = this.getBoundingClientRect();
				const boardRect = board.getBoundingClientRect();
				this.pos.x = (rect.left - boardRect.x) / Application.viewport.scale;
				this.pos.y = (rect.top - boardRect.y) / Application.viewport.scale;
				this.classList.add("dragging");
				this.dispatchEvent(new CustomEvent("token-drag-start"));
			}
		});

		hammer.on('panmove', (e) => {
			// if token cannot be dragged, pan the viewport instead
			if (!this.dragEnabled) {
				Application.viewport.pan(e.deltaX, e.deltaY);
				return;
			}
			
			const deltaX = e.deltaX / Application.viewport.scale;
			const deltaY = e.deltaY / Application.viewport.scale;

			const newX = this.pos.x + deltaX;
			const newY = this.pos.y + deltaY;

			this.style.left = `${newX}px`;
			this.style.top = `${newY}px`;
			this.dispatchEvent(new CustomEvent("token-dragging", { detail: { x: newX, y: newY }}));
		});

		hammer.on('panend', (e) => {
			// if token cannot be dragged, pan the viewport instead
			if (!this.dragEnabled) {
				Application.viewport.endpan(e.deltaX, e.deltaY);
				return;
			}
		
			const deltaX = e.deltaX / Application.viewport.scale;
			const deltaY = e.deltaY / Application.viewport.scale;
		
			this.pos.x += deltaX;
			this.pos.y += deltaY;
		
			this.style.left = `${this.pos.x}px`;
			this.style.top = `${this.pos.y}px`;
		
			this.dragging = false;
			this.classList.remove("dragging");
			this.dispatchEvent(new CustomEvent("token-drag-end", { detail: { x: this.pos.x, y: this.pos.y }}));
		});
	}

	setPosition(x:number, y:number):void {
		this.pos.x = x;
		this.pos.y = y;
		this.style.left = `${x}px`;
		this.style.top = `${y}px`;
	}

	setMovable(movable:boolean):void {
		this.dragEnabled = movable;
		if (movable) this.classList.remove("immovable");
		else this.classList.add("immovable");
	}

	protected getTokenRadius():number {
		return 115;
	}

	protected makeText():void {
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
			`M 150,150 m ${radius},0 a ${radius},${radius} 0 1,0 -${radius*2},0 a ${radius},${radius} 0 1,0 ${radius*2},0`
		  );
		defs.appendChild(path);
		svg.appendChild(defs);

		// Create <text> and <textPath>
		const textElement = document.createElementNS(xmlns, "text");
		textElement.setAttribute("fill", "black");
		textElement.setAttribute("font-size", "26");
		textElement.setAttribute("text-anchor", "middle");
		textElement.setAttribute("transform", "rotate(270 150 150)");

		this.textPath.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#circlePath");
		this.textPath.setAttribute("startOffset", "50%");

		textElement.appendChild(this.textPath);
		svg.appendChild(textElement);

		this.container.appendChild(svg);
	}

	protected setText(text:string):void {
		this.textPath.textContent = text;
	}

	protected onTokenTapped():void {
		this.dispatchEvent(new Event("tapped"));
		// override in child class
	}

	protected onTokenDoubleTapped():void {
		this.dispatchEvent(new Event("double-tapped"));
		// override in child class
	}

	connectedCallback() {
		this.makeText();
	}

	getDragging():boolean {
		return this.dragging;
	}
}