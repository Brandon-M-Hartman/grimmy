
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
		token.onclick = null;
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

		// if the player's role is different from their perceived role, add the reminder tokens for perceived role too
		if (token.getRole() != token.getPerceivedRole()) {
			for (let i = 0; i < roleData[token.getPerceivedRole()!].reminders.length; i++) {
				const reminderToken:ReminderToken = new ReminderToken(token.getPerceivedRole()!, i);
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

		const reminders:Array<ReminderToken> = [...this.reminderTokens];
		reminders.forEach(token => {
			if (token.type == Role.DRUNK) reminders.splice(reminders.indexOf(token), 1);
		});

		// arrange reminder tokens on the side
		for (let i = 0; i < reminders.length; i++)
		{
			const token:ReminderToken = reminders[i];
			token.setPosition(dist + (i % 2) * 160 + 400, Math.floor(i/2) * 160 - dist/2);
		}

		// place drunk reminder token on drunk player token
		const drunkToken:PlayerToken | null = Game.getTokenForRole(Role.DRUNK);
		if (drunkToken)
		{
			const dir = { x: drunkToken.pos.x, y: drunkToken.pos.y };
			const len = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
			dir.x /= len;
			dir.y /= len;
			drunkToken.reminderTokens[0].setPosition(drunkToken.pos.x - dir.x * 180, drunkToken.pos.y - dir.y * 180);
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