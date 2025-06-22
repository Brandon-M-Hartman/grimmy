
import { Token } from "./token";
import { PlayerToken } from './playertoken';
import { ReminderToken } from './remindertoken';
import { Role, roleData } from "./role";
import { Game } from "./game";

export class TownSquare extends HTMLElement {
	static enabled:boolean = true;

	draggingToken:boolean = false;
	tokens:Array<Token> = [];
	playerTokens:Array<PlayerToken> = [];
	reminderTokens:Array<ReminderToken> = [];

	constructor() {
		super();

		this.clear();
	}

	setupBoard():void {
		Game.tokens.forEach(token => this.addPlayerToken(token));
	}

	addPlayerToken(token:PlayerToken):void {
		token.onrolechanged = (_role:Role) => {
			this.addReminderTokens(token);
		}

		token = token.makeFunctional();
		this.appendChild(token);
		this.tokens.push(token);
		this.playerTokens.push(token);
		this.bindTokenEvents(token);
		this.addReminderTokens(token);
		
		token.bindEvents();
		token.setMovable(!Game.lockPlayerTokens);
		//token.setMovable(false);
	}

	reorderTokens():void {
		for (let i = 0; i < this.tokens.length; i++) {
			this.tokens[i].style.zIndex = i.toString();
		}
	}

	addReminderTokens(token:PlayerToken):void {
		// remove old reminder tokens
		token.reminderTokens.forEach(reminderToken => {
			this.removeChild(reminderToken);
		});

		// clear references
		token.reminderTokens = [];
		
		// add new reminder tokens, if any
		if (token.getRole()) {
			for (let i = 0; i < roleData[token.getRole()!].reminders.length; i++) {
				const reminderToken:ReminderToken = new ReminderToken(token.getRole()!, i);
				reminderToken.bindEvents();
				this.appendChild(reminderToken);
				this.bindTokenEvents(reminderToken);
				this.tokens.push(reminderToken);
				this.reminderTokens.push(reminderToken);
				token.reminderTokens.push(reminderToken);
			}
		}
	}

	arrangeTokens():void {
		const dist:number = this.playerTokens.length * 70;

		// arrange player tokens in a circle
		for (let i = 0; i < this.playerTokens.length; i++)
		{
			const token:Token = this.playerTokens[i];
			const angle:number = Math.PI * 2 / this.playerTokens.length * i;
			token.setPosition(Math.cos(angle) * dist, Math.sin(angle) * dist);
		}

		// arrange reminder tokens on the side
		for (let i = 0; i < this.reminderTokens.length; i++)
		{
			const token:Token = this.reminderTokens[i];
			token.setPosition(dist + (i % 2) * 160 + 400, Math.floor(i/2) * 160 - dist/2);
		}
	}

	bindTokenEvents(token:Token):void {
		token.addEventListener("dragstart", () => {
			this.draggingToken = true;
			const index = this.tokens.indexOf(token);
			this.tokens.splice(index, 1);
			this.tokens.push(token);
			this.reorderTokens();
		});
		token.addEventListener("dragend", () => {
			this.draggingToken = false;
		});
	}

	clear():void {
		// empty arrays
		this.tokens = [];
		this.playerTokens = [];
		this.reminderTokens = [];

		// remove everything from board
		while (this.firstChild) this.removeChild(this.firstChild);
	}
}