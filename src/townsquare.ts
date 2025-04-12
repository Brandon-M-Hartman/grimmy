import '@pixi/math-extras';
import { Container } from "pixi.js";
import { Token } from "./token";
import { Point } from '@pixi/core';
import { Role, roleData } from './role';
import { Viewport } from 'pixi-viewport';
import { PlayerToken } from './playertoken';
import { ReminderToken } from './remindertoken';

export class TownSquare extends Container {
	static enabled:boolean = true;

	background:Container = new Container();
	tokens:Container = new Container();
	draggingToken:Token | null = null;
	viewport:Viewport;

	constructor(viewport:Viewport) {
		super();

		this.viewport = viewport;

		this.addChild(this.background);
		this.addChild(this.tokens);

		this.setupBoard();
	}

	setupBoard():void {
		this.addPlayerToken(Role.MONK);
		this.addPlayerToken(Role.SOLDIER);
		this.addPlayerToken(Role.INVESTIGATOR);
		this.addPlayerToken(Role.UNDERTAKER);
	}

	addPlayerToken(role:Role):void {
		const token:Token = new PlayerToken(role);
		this.tokens.addChild(token);
		this.bindTokenEvents(token);
		this.addReminderTokens(role);
	}

	addReminderTokens(role:Role):void {
		for (let i = 0; i < roleData[role].reminders.length; i++) {
			const token:Token = new ReminderToken(role, i);
			this.tokens.addChild(token);
			this.bindTokenEvents(token);
		}
	}

	bindTokenEvents(token:Token):void {
		token.eventMode = 'static';
		token.cursor = 'pointer';
		token.on('dragstart', () => {
			if (!TownSquare.enabled) return;
			this.draggingToken = token;
			this.tokens.setChildIndex(token, this.tokens.children.length - 1);
			this.emit('tokendragstart');
		});
		token.on('dragend', () => {
			this.draggingToken = null;
		});
		token.on('focusstart', () => {
			this.emit('focused');
		});
		token.on('focusend', () => {
			this.emit('focuslost');
		});
	}

	onPointerMove(e:PointerEvent):void {
		const p:Point = this.toLocal(new Point(e.x, e.y));
		//const finalPoint:Point = new Point(e.x, e.y).subtract(new Point(this.viewport.width, this.viewport.height)).multiplyScalar(1/this.viewport.scale.x);
		if (this.draggingToken) this.draggingToken.drag(p);
	}

	enable():void {
		TownSquare.enabled = true;
	}

	disable():void {
		if (this.draggingToken) this.draggingToken.drop();
		TownSquare.enabled = false;
	}
}