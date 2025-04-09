import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';
import { RoleId } from './role';

export class TownSquare extends Container {

	background:Container = new Container();
	tokens:Container = new Container();
	selectedToken:Token | null = null
	draggingBoard:boolean = false;
	movingToken:boolean = false;
	interactionEnabled:boolean = true;
	tokenMoveTimer:NodeJS.Timeout = setTimeout(() => {}, 0);

	constructor() {
		super();

		this.addChild(this.background);
		this.addChild(this.tokens);

		this.addToken("monk");
		this.addToken("chef");
		this.addToken("slayer");
	}

	addToken(role:RoleId):void {
		const token:Token = new Token(role);
		this.tokens.addChild(token);

		token.eventMode = 'static';
		token.cursor = 'pointer';
		token.on('pointerdown', (e) => {
			this.tokenMoveTimer = setTimeout(() => this.pickupToken(token, new Point(e.x, e.y)), 200);
			this.selectedToken = token;
			e.stopPropagation();
		}).on('pointerup', (e) => {
			token.drop();
			this.selectedToken = null;
			this.movingToken = false;
			e.stopPropagation();
		});
	}

	onPointerMove(e:PointerEvent):void {
		const finalPoint:Point = new Point(e.x, e.y).multiplyScalar(1/this.scale.x).subtract(this.position);
		if (this.selectedToken && this.movingToken) this.selectedToken.drag(finalPoint);
	}

	hasSelectedToken():boolean {
		return this.selectedToken != null;
	}

	cancelMove():void {
		clearTimeout(this.tokenMoveTimer);
	}

	pickupToken(token:Token, p:Point):void {
		if (!this.interactionEnabled) return;
		const finalPoint:Point = p.multiplyScalar(1/this.scale.x).subtract(this.position);
		token.pickup(finalPoint);
		this.tokens.swapChildren(token, this.tokens.getChildAt(this.tokens.children.length - 1));
		this.movingToken = true;
	}
}