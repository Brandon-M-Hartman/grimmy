import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';
import { RoleId } from './role';

export class TownSquare extends Container {
	background:Container = new Container();
	tokens:Container = new Container();
	draggingToken:Token | null = null
	draggingBoard:boolean = false;

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
		token.on('dragstart', () => {
			this.draggingToken = token;
			this.emit('tokendragstart');
		});
		token.on('dragend', () => {
			this.draggingToken = null;
		});
	}

	onPointerMove(e:PointerEvent):void {
		const finalPoint:Point = new Point(e.x, e.y).subtract(this.position).multiplyScalar(1/this.scale.x);
		if (this.draggingToken) this.draggingToken.drag(finalPoint);
	}
}