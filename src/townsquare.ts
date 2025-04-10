import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';
import { RoleId } from './role';
import { Viewport } from 'pixi-viewport';

export class TownSquare extends Container {
	static interactionsPermitted:boolean = true;

	background:Container = new Container();
	tokens:Container = new Container();
	draggingToken:Token | null = null;
	viewport:Viewport;

	constructor(viewport:Viewport) {
		super();

		this.viewport = viewport;

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
		token.on('dragstart', () => {
			if (!TownSquare.interactionsPermitted) return;
			this.draggingToken = token;
			this.emit('tokendragstart');
		});
		token.on('dragend', () => {
			this.draggingToken = null;
		});
	}

	onPointerMove(e:PointerEvent):void {
		const p:Point = this.toLocal(new Point(e.x, e.y));
		//const finalPoint:Point = new Point(e.x, e.y).subtract(new Point(this.viewport.width, this.viewport.height)).multiplyScalar(1/this.viewport.scale.x);
		if (this.draggingToken) this.draggingToken.drag(p);
	}

	enableInteractions():void {
		TownSquare.interactionsPermitted = true;
	}

	disableInteraction():void {
		if (this.draggingToken) this.draggingToken.drop();
		TownSquare.interactionsPermitted = false;
	}
}