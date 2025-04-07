import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';

export class TownSquare extends Container {

	background:Container = new Container();
	tokens:Container = new Container();
	selectedToken:Token | null = null
	draggingBoard:boolean = false;

	constructor() {
		super();

		this.addChild(this.background);
		this.addChild(this.tokens);

		this.addToken();
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
			this.selectedToken = token;
			e.stopPropagation();
		}).on('pointerup', (e) => {
			token.drop();
			this.selectedToken = null;
			e.stopPropagation();
		});
	}

	onPointerMove(e:PointerEvent):void {
		const finalPoint:Point = new Point(e.x, e.y).multiplyScalar(1/this.scale.x).subtract(this.position);
		if (this.selectedToken) this.selectedToken.drag(finalPoint);
	}

	hasSelectedToken():boolean {
		return this.selectedToken != null;
	}
}