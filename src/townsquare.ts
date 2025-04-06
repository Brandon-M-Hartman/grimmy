import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';



export class TownSquare extends Container {

	draggedElement:Token | null = null

	constructor() {
		super();

		this.addToken();
		this.addToken();
	}

	addToken():void {
		const token:Token = new Token();
		this.addChild(token);

		token.eventMode = 'static';
		token.cursor = 'pointer';
		token.on('pointerdown', (e) => {
			const finalPoint:Point = new Point(e.x, e.y).multiplyScalar(1/this.scale.x).subtract(this.position);
			token.pickup(finalPoint);
			this.swapChildren(token, this.getChildAt(this.children.length - 1));
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
}