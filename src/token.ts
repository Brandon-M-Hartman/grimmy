import { Assets, BlurFilter, Container, Graphics, Point, Sprite, Text } from "pixi.js";
import gsap from 'gsap';

export class Token extends Container {

	container:Container;
	dragging:boolean;
	dragOffset:Point;

	constructor() {
		super();
		console.log("Token created");

		this.container = new Container();
		this.dragging = false;
		this.dragOffset = new Point();

		(async () => {
			const backgroundImage = await Assets.load("/assets/token/background.png");
			const background:Sprite = new Sprite(backgroundImage);
			background.anchor.set(0.5);

			const iconImage = await Assets.load("/assets/token/monk.webp");
			const icon:Sprite = new Sprite(iconImage);
			icon.anchor.set(0.5);
			icon.scale = 0.4;
			
			const remindersTopImage = await Assets.load("/assets/token/top-1.webp");
			const remindersTop:Sprite = new Sprite(remindersTopImage);
			remindersTop.anchor.set(0.5);
			remindersTop.scale = 0.515;

			const remindersRightImage = await Assets.load("/assets/token/right-1.webp");
			const remindersRight:Sprite = new Sprite(remindersRightImage);
			remindersRight.anchor.set(0.5);
			remindersRight.scale = 0.515;

			const shadow:Graphics = new Graphics();
			shadow.circle(0, 0, 128);
			shadow.fill(0x000000);

			const blurFilter1 = new BlurFilter();
			shadow.filters = [blurFilter1];
			shadow.alpha = 0.1;
			
			
			this.container = new Container();

			this.addChild(shadow);
			this.addChild(this.container);

			this.container.addChild(background);
			this.container.addChild(icon);
			this.container.addChild(remindersTop);
			this.container.addChild(remindersRight);

			const text = "MONK";

			const radius = 105;
			const fontSize = 28;
			const fontStyle = {
				fontFamily: 'Tahoma',
				fontSize: fontSize,
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
		})();
	}

	pickup(e:PointerEvent): void {
		this.dragging = true;
		this.dragOffset = new Point(this.position.x - e.x, this.position.y - e.y);
		gsap.to(this.container, {
			duration: 0.2,
			y: -25,
			rotation: -0.1,
			ease: "power2.out",
		});
	}

	drag(e:PointerEvent): void {
		this.position.x = e.x + this.dragOffset.x;
		this.position.y = e.y + this.dragOffset.y;
	}

	drop(): void {
		this.dragging = false;
		gsap.to(this.container, {
			duration: 0.2,
			y: 0,
			rotation: 0,
			ease: "power2.in",
		});
	}
}