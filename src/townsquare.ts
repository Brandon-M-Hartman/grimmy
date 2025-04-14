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
	playerTokens:Array<PlayerToken>;
	reminderTokens:Array<ReminderToken>;

	constructor(viewport:Viewport) {
		super();

		this.playerTokens = [];
		this.reminderTokens = [];
		this.viewport = viewport;

		this.addChild(this.background);
		this.addChild(this.tokens);

		this.setupBoard();
		this.arrangeTokens();
	}

	setupBoard():void {
		this.addPlayerToken(Role.MONK);
		this.addPlayerToken(Role.SOLDIER);
		this.addPlayerToken(Role.RAVENKEEPER);
		this.addPlayerToken(Role.LIBRARIAN);
		this.addPlayerToken(Role.INVESTIGATOR);
		this.addPlayerToken(Role.RECLUSE);
		this.addPlayerToken(Role.SAINT);
		this.addPlayerToken(Role.IMP);
		this.addPlayerToken(Role.POISONER);
	}

	addPlayerToken(role:Role):void {
		const token:PlayerToken = new PlayerToken(role);
		this.tokens.addChild(token);
		this.bindTokenEvents(token);
		this.addReminderTokens(role);
		this.playerTokens.push(token);
	}

	addReminderTokens(role:Role):void {
		for (let i = 0; i < roleData[role].reminders.length; i++) {
			const token:ReminderToken = new ReminderToken(role, i);
			this.tokens.addChild(token);
			this.bindTokenEvents(token);
			this.reminderTokens.push(token);
		}
	}

	arrangeTokens():void {
		const dist:number = this.playerTokens.length * 70;

		// arrange player tokens in a circle
		for (let i = 0; i < this.playerTokens.length; i++)
		{
			const token:Token = this.playerTokens[i];
			const angle:number = Math.PI * 2 / this.playerTokens.length * i;
			token.position = new Point(Math.cos(angle) * dist, Math.sin(angle) * dist);
		}

		// arrange reminder tokens on the side
		for (let i = 0; i < this.reminderTokens.length; i++)
		{
			const token:Token = this.reminderTokens[i];
			token.position = new Point(dist + (i % 2) * 160 + 400, Math.floor(i/2) * 160 - dist/2);
		}
	}

	bindTokenEvents(token:Token):void {
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