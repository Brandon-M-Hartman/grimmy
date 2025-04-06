import { Assets, BlurFilter, Container, Graphics, Point, Sprite, Text } from "pixi.js";
import gsap from 'gsap';

export class Token extends Container {

	container:Container = new Container();
	dragging:boolean = false;
	dragOffset:Point = new Point();

	constructor() {
		super();
		
		Assets.add({
			alias: 'icon',
			src: 'assets/token/monk.webp',
			data: { scaleMode: 'linear' },
		});
		Assets.add({
			alias: 'background',
			src: 'assets/token/background.png',
			data: { scaleMode: 'linear' },
		});
		Assets.add({
			alias: 'remindersTop',
			src: 'assets/token/top-1.webp',
			data: { scaleMode: 'linear' },
		});
		Assets.add({
			alias: 'remindersRight',
			src: 'assets/token/right-1.webp',
			data: { scaleMode: 'linear' },
		});

		const texturesPromise = Assets.load(['icon', 'background', 'remindersTop', 'remindersRight']);

		texturesPromise.then((textures) => {

			const background:Sprite = Sprite.from(textures.background);
			background.anchor.set(0.5);

			const icon:Sprite = Sprite.from(textures.icon);
			icon.anchor.set(0.5);
			
			const remindersTop:Sprite = Sprite.from(textures.remindersTop);
			remindersTop.anchor.set(0.5);
			remindersTop.scale = 0.515;

			const remindersRight:Sprite = Sprite.from(textures.remindersRight);
			remindersRight.anchor.set(0.5);
			remindersRight.scale = 0.515;

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
			this.container.addChild(remindersTop);
			this.container.addChild(remindersRight);

			const text = "MONK";

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

	pickup(position:Point): void {
		this.dragging = true;
		this.dragOffset = new Point(this.position.x - position.x, this.position.y - position.y);
		gsap.killTweensOf(this.container);
		gsap.to(this.container, {
			duration: 0.35,
			y: -25,
			rotation: -0.05,
			ease: "power2.out",
		});
	}

	drag(position:Point): void {
		this.position.x = position.x + this.dragOffset.x;
		this.position.y = position.y + this.dragOffset.y;
	}

	drop(): void {
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