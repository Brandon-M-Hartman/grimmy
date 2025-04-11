import { Assets, BlurFilter, Container, Graphics, Sprite, Text } from "pixi.js";
import gsap from 'gsap';
import { RoleData, Role } from "./role";
import data from '../data/roles.json';
import '@pixi/math-extras';
import { Point } from '@pixi/core';
import { TownSquare } from "./townsquare";

export class Token extends Container {

	container:Container = new Container();
	dragging:boolean = false;
	dragOffset:Point = new Point();
	mousePos:Point = Point.prototype;
	mouseDown:boolean = false;

	constructor(type:Role) {
		super();

		const roleData:RoleData = data;
		const role = roleData[type];
		console.log(type);

		this.addEvents();
		
		Assets.add({
			alias: 'icon.' + type,
			src: 'assets/token/' + type +'.webp',
			data: { scaleMode: 'linear' },
		});
		Assets.add({
			alias: 'background',
			src: 'assets/token/background.png',
			data: { scaleMode: 'linear' },
		});
		Assets.add({
			alias: 'setup',
			src: 'assets/token/setup.webp',
			data: { scaleMode: 'linear' },
		});

		if (role.top > 0) {
			Assets.add({
				alias: 'reminders.top.' + type,
				src: 'assets/token/top-' + role.top + '.webp',
				data: { scaleMode: 'linear' },
			});
		}

		if (role.left > 0) {
			Assets.add({
				alias: 'reminders.left.' + type,
				src: 'assets/token/left-' + role.left + '.webp',
				data: { scaleMode: 'linear' },
			});
		}

		if (role.right > 0) {
			Assets.add({
				alias: 'reminders.right.' + type,
				src: 'assets/token/right-' + role.right + '.webp',
				data: { scaleMode: 'linear' },
			});
		}

		const textures:Array<string> = ['icon.' + type, 'background', 'setup'];
		if (role.top > 0) textures.push('reminders.top.' + type);
		if (role.left > 0) textures.push('reminders.left.' + type);
		if (role.right > 0) textures.push('reminders.right.' + type);

		const texturesPromise = Assets.load(textures);

		texturesPromise.then((textures) => {

			const background:Sprite = Sprite.from(textures.background);
			background.anchor.set(0.5);

			const icon:Sprite = Sprite.from(textures['icon.' + type]);
			icon.anchor.set(0.5);

			const shadow:Graphics = new Graphics();
			shadow.circle(0, 0, 120);
			shadow.fill(0x000000);

			const blurFilter1 = new BlurFilter();
			shadow.filters = [blurFilter1];
			shadow.alpha = 0.3;
			
			this.container = new Container();

			this.addChild(shadow);
			this.addChild(this.container);

			this.container.addChild(background);
			this.container.addChild(icon);
			
			if (role.top > 0) {
				const remindersTop:Sprite = Sprite.from(textures['reminders.top.' + type]);
				remindersTop.anchor.set(0.5);
				remindersTop.scale = 0.515;
				this.container.addChild(remindersTop);
			}

			if (role.left > 0) {
				const remindersLeft:Sprite = Sprite.from(textures['reminders.left.' + type]);
				remindersLeft.anchor.set(0.5);
				remindersLeft.scale = 0.515;
				this.container.addChild(remindersLeft);
			}

			if (role.right > 0) {
				const remindersRight:Sprite = Sprite.from(textures['reminders.right.' + type]);
				remindersRight.anchor.set(0.5);
				remindersRight.scale = 0.515;
				this.container.addChild(remindersRight);
			}

			if (role.setup) {
				const remindersSetup:Sprite = Sprite.from(textures['setup']);
				remindersSetup.anchor.set(0.5);
				remindersSetup.scale = 0.515;
				this.container.addChild(remindersSetup);
			}

			const text = role.name.toUpperCase();

			const radius = 105;
			const fontStyle = {
				fontFamily: 'IMFell',
				fontSize: 28,
				fill: 0x000000,
			};

			const characters: Text[] = [];
			let totalArcLength = 0;
			const characterSpacing = 1.25;

			for (let i = 0; i < text.length; i++) {
				const char = new Text({ text: text[i], style: fontStyle});
				characters.push(char);
				totalArcLength += char.width;
			}

			// 2. Convert total arc length to radians
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
		});
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
}