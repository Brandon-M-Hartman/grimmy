import Hammer from "hammerjs";
import { Application } from "./application";

export class Token extends HTMLElement {

	public pos = { x: 0, y: 0 };
	
	private dragging:boolean = false;
	protected container:HTMLElement;
	protected background:HTMLImageElement;

	constructor() {
		super();

		this.className = "token";

		this.container = document.createElement("div");
		this.container.className = "container";
		this.appendChild(this.container);

		this.background = document.createElement("img");
		this.background.className = "background";
		this.background.src = "assets/token/background.png";
		this.background.draggable = false;
		this.container.appendChild(this.background);
	}

	bindEvents():void {
		const hitArea = document.createElement("span");
		this.container.appendChild(hitArea);

		const hammer = new Hammer(hitArea);
		hammer.get('press').set({ time: 200, threshold: 1 });
		hammer.get('pan').set({ threshold: 0 });

		hammer.on('tap', (_e) => {
			this.onTokenTapped();
		});

		hammer.on('press', (_e) => {
			console.log('long press on token!');
			const rect = this.getBoundingClientRect();
			this.pos.x = (rect.left - Application.viewport.x) / Application.viewport.scale;
			this.pos.y = (rect.top - Application.viewport.y) / Application.viewport.scale;
		});

		hammer.on('panstart', (_e) => {
			this.dragging = true;
			this.classList.add("dragging");
			this.dispatchEvent(new CustomEvent("dragstart"));
		});

		hammer.on('panmove', (e) => {
			if (!this.dragging) return;

			const deltaX = e.deltaX / Application.viewport.scale;
			const deltaY = e.deltaY / Application.viewport.scale;

			const newX = this.pos.x + deltaX;
			const newY = this.pos.y + deltaY;

			this.style.left = `${newX}px`;
			this.style.top = `${newY}px`;
		});

		hammer.on('panend', (e) => {
			if (!this.dragging) return;
		
			const deltaX = e.deltaX / Application.viewport.scale;
			const deltaY = e.deltaY / Application.viewport.scale;
		
			this.pos.x += deltaX;
			this.pos.y += deltaY;
		
			this.style.left = `${this.pos.x}px`;
			this.style.top = `${this.pos.y}px`;
		
			this.dragging = false;
			this.classList.remove("dragging");
			this.dispatchEvent(new CustomEvent("dragend"));
		});
	}

	setPosition(x:number, y:number) {
		this.pos.x = x;
		this.pos.y = y;
		this.style.left = `${x}px`;
		this.style.top = `${y}px`;
	}

	setDisplay(display:boolean):void {
		if (display) this.classList.add('display');
		else this.classList.remove('display');
	}

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

		this.container.appendChild(svg);
	}

	protected onTokenTapped():void {
		// override in child class
	}
}