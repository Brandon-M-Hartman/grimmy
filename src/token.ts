import { Assets, BlurFilter, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import gsap from 'gsap';
import '@pixi/math-extras';
import { Point } from '@pixi/core';
import { TownSquare } from "./townsquare";

export class Token extends Container {

	container:Container = new Container();
	dragging:boolean = false;
	dragOffset:Point = new Point();
	mousePos:Point = Point.prototype;
	mouseDown:boolean = false;
	token:Sprite = new Sprite();

	constructor() {
		super();

		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.addEvents();
	}

	protected addSprites():void {
		this.token = Sprite.from(Assets.get('token.background'));
		this.token.anchor.set(0.5);

		const shadow:Graphics = new Graphics();
		shadow.circle(0, 0, this.getTokenRadius() * 2);
		shadow.fill(0x000000);

		const blurFilter1 = new BlurFilter();
		shadow.filters = [blurFilter1];
		shadow.alpha = 0.3;
		
		this.container = new Container();

		this.addChild(shadow);
		this.addChild(this.container);

		this.container.addChild(this.token);
	}

	addEvents():void {
		const DRAG_THRESHOLD:number = 12;

		this.on('pointerdown', (e) => {
			console.log("pressed token");
			this.mousePos.set(e.x, e.y);
			this.mouseDown = true;
			this.emit('focusstart');
		});

		this.on('globalpointermove', (e) => {
			if (this.mouseDown && !this.dragging && TownSquare.enabled) {
				const deltaX = e.x - this.mousePos.x;
				const deltaY = e.y - this.mousePos.y;
				if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
					this.pickup(new Point(e.x, e.y));
				}
			}
		});

		this.on('pointerup', () => {
			this.mouseDown = false;
			this.drop();
			this.emit('focusend');
		});
	}

	pickup(pos:Point):void {
		this.emit('dragstart');
		this.dragging = true;
		const globalPos:Point = this.getGlobalPosition();
		this.dragOffset = new Point(globalPos.x - pos.x, globalPos.y - pos.y);
		gsap.killTweensOf(this.container);
		gsap.to(this.container, {
			duration: 0.35,
			y: -25,
			rotation: -0.05,
			ease: "power2.out",
		});
	}

	drag(pos:Point):void {
		this.position.x = pos.x + this.dragOffset.x;
		this.position.y = pos.y + this.dragOffset.y;
	}

	drop():void {
		this.emit('dragend');
		this.dragging = false;
		gsap.killTweensOf(this.container);
		gsap.to(this.container, {
			duration: 0.2,
			y: 0,
			rotation: 0,
			ease: "power2.in",
		});
	}

	protected getTokenRadius():number {
		return 60;
	}

	protected getFontStyle():Partial<TextStyle> {
		return {
			fontFamily: 'IMFell',
			fontSize: 26,
			fill: 0x000000,
		};
	}

	protected makeText(text:string):void {
		const radius:number = this.getTokenRadius() * 2 - 12;

		const characters: Text[] = [];
		let totalArcLength = 0;
		const characterSpacing = 1.25;

		for (let i = 0; i < text.length; i++) {
			const char = new Text({ text: text[i], style: this.getFontStyle() });
			characters.push(char);
			totalArcLength += char.width;
		}

		const arcAngle = totalArcLength / radius * characterSpacing;
		const startAngle = Math.PI / 2 + arcAngle / 2; // bottom center start
		let currentAngle = startAngle;

		for (const char of characters) {
			const charArc = char.width / radius * characterSpacing;
			const angle = currentAngle - charArc / 2;

			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;

			char.anchor.set(0.5, 0.5);
			char.x = x;
			char.y = y;

			char.rotation = angle - Math.PI / 2;

			this.container.addChild(char);

			currentAngle -= charArc;
		}
	}
}