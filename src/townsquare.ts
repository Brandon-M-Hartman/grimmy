import '@pixi/math-extras';
import { Assets, Container, Texture, TilingSprite } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';

export class TownSquare extends Container {

	background:Container = new Container();
	tokens:Container = new Container();
	draggedElement:Token | null = null

	constructor() {
		super();

		this.addChild(this.background);
		this.addChild(this.tokens);

		this.setupTilingBackground();
		this.addToken();
		this.addToken();
	}

	addToken():void {
		const token:Token = new Token();
		this.tokens.addChild(token);

		token.eventMode = 'static';
		token.cursor = 'pointer';
		token.on('pointerdown', (e) => {
			const finalPoint:Point = new Point(e.x, e.y).multiplyScalar(1/this.scale.x).subtract(this.position);
			token.pickup(finalPoint);
			this.tokens.swapChildren(token, this.tokens.getChildAt(this.tokens.children.length - 1));
			this.draggedElement = token;
		}).on('pointerup', () => {
			token.drop();
			this.draggedElement = null;
		});
	}

	onPointerMove(e:PointerEvent):void {
		const finalPoint:Point = new Point(e.x, e.y).multiplyScalar(1/this.scale.x).subtract(this.position);
		if (this.draggedElement) this.draggedElement.drag(finalPoint);
	}

	async setupTilingBackground():Promise<void> {
		const texture:Texture = await Assets.load('assets/felt.jpg');
		const tilingBackground = new TilingSprite({
			texture,
			width: 3200,
			height: 3200,
		});
		tilingBackground.position = new Point(-2000, -2000);
		tilingBackground.scale = 1.25;
		this.background.addChild(tilingBackground);
	}
}