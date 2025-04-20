
import { Token } from "./token";
import { PlayerToken } from './playertoken';
import { ReminderToken } from './remindertoken';
import { Role, roleData } from "./role";

export class TownSquare extends HTMLElement {
	static enabled:boolean = true;

	draggingToken:boolean = false;
	tokens:Array<Token>;
	playerTokens:Array<PlayerToken>;
	reminderTokens:Array<ReminderToken>;

	constructor() {
		super();

		this.tokens = [];
		this.playerTokens = [];
		this.reminderTokens = [];
	}

	setupBoard():void {
		this.addPlayerToken(Role.MONK);
		this.addPlayerToken(Role.SOLDIER);
		this.addPlayerToken(Role.UNDERTAKER);
		this.addPlayerToken(Role.LIBRARIAN);
		this.addPlayerToken(Role.INVESTIGATOR);
		this.addPlayerToken(Role.MAYOR);
		this.addPlayerToken(Role.SAINT);
		this.addPlayerToken(Role.IMP);
		this.addPlayerToken(Role.POISONER);
	}

	addPlayerToken(role:Role):void {
		const token:PlayerToken = new PlayerToken();

		token.onrolechanged = () => {
			this.addReminderTokens(token);
		}

		this.appendChild(token);
		this.tokens.push(token);
		this.playerTokens.push(token);
		this.bindTokenEvents(token);
		
		token.bindEvents();
		token.setRole(role);
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

	// onPointerMove(e:PointerEvent):void {
	// 	const p:Point = this.toLocal(new Point(e.x, e.y));
	// 	if (this.draggingToken) this.draggingToken.drag(p);
	// }

	// enable():void {
	// 	TownSquare.enabled = true;
	// }

	// disable():void {
	// 	if (this.draggingToken) this.draggingToken.drop();
	// 	TownSquare.enabled = false;
	// }

	// getTownCenter():Point {
	// 	// calculate town center from average position of player tokens
	// 	let center:Point = new Point();
	// 	for (let i = 0; i < this.playerTokens.length; i++)
	// 	{
	// 		center = center.add(this.playerTokens[i].position);
	// 	}
	// 	center = center.multiplyScalar(1/this.playerTokens.length);
	// 	return center;
	// }
}