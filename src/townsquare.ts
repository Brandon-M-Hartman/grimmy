
import { Token } from "./token";
import { PlayerToken } from './playertoken';
import { ReminderToken } from './remindertoken';
import { Role } from "./role";
import { Game } from "./game";
import { LocalStorageService } from "./localstorage";
import { DemonBluffsScreen } from "./screens/demonbluffs";
import { firstNightTasks, NightOrderTaskType, otherNightTasks } from "./screens/nightorder";

export class TownSquare extends HTMLElement {
	static enabled:boolean = true;

	draggingToken:Token | null = null;
	tokens:Array<Token> = [];
	playerTokens:Array<PlayerToken> = [];
	reminderTokens:Array<ReminderToken> = [];

	constructor() {
		super();

		this.clear();
	}

	setupBoard():void {
		this.tokens.forEach(token => {
			if (token instanceof PlayerToken) this.addPlayerToken(token);
			else if (token instanceof ReminderToken) this.addReminderToken(token);
		});

		this.updateNightOrderBadges();
	}

	addPlayerToken(token:PlayerToken):void {
		token.onRoleChanged = (role:Role | null) => {
			this.saveBoardState();
			if (role) {
				const reminderTokens:Array<ReminderToken> = Game.createReminderTokensForRole(role);
				reminderTokens.forEach(token => {
					this.addReminderToken(token);
					this.tokens.push(token);
				});
			}
		}

		token.onStateChanged = () => {
			this.saveBoardState();
			this.updateNightOrderBadges();
		}

		token = token.makeFunctional();
		this.appendChild(token);
		this.playerTokens.push(token);
		this.bindTokenEvents(token);
		
		token.bindEvents();
		token.setMovable(!Game.lockPlayerTokens);
		token.onclick = null;
	}

	addReminderToken(token:ReminderToken):void {
		this.appendChild(token);
		this.reminderTokens.push(token);
		this.bindTokenEvents(token);
		token.bindEvents();
	}

	removeToken(token:Token):void {
		this.removeChild(token);
		this.tokens.splice(this.tokens.indexOf(token), 1);
		this.saveBoardState();
	}

	reorderTokens():void {
		for (let i = 0; i < this.tokens.length; i++) {
			this.tokens[i].style.zIndex = i.toString();
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
			if (token.role == Role.DRUNK) reminders.splice(reminders.indexOf(token), 1);
		});

		// arrange reminder tokens on the side
		for (let i = 0; i < reminders.length; i++)
		{
			const token:ReminderToken = reminders[i];
			token.setPosition(dist + (i % 2) * 160 + 400, Math.floor(i/2) * 160 - dist/2);
		}

		// place drunk reminder token on drunk player token
		const drunkToken:PlayerToken | null = this.getTokenForRole(Role.DRUNK);
		if (drunkToken)
		{
			const dir = { x: drunkToken.pos.x, y: drunkToken.pos.y };
			const len = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
			dir.x /= len;
			dir.y /= len;
			this.getReminderTokensForRole(Role.DRUNK)[0].setPosition(drunkToken.pos.x - dir.x * 180, drunkToken.pos.y - dir.y * 180);
		}
	}

	bindTokenEvents(token:Token):void {
		token.addEventListener("token-drag-start", () => {
			this.draggingToken = token;
			const index = this.tokens.indexOf(token);
			this.tokens.splice(index, 1);
			this.tokens.push(token);
			this.reorderTokens();
			this.dispatchEvent(new CustomEvent("start-dragging-token", { detail: token }));
		});
		token.addEventListener("token-drag-end", (e) => {
			this.draggingToken = null;
			this.dispatchEvent(new CustomEvent("stop-dragging-token", { detail: { token: token, pos: (<CustomEvent>e).detail }}));
			this.saveBoardState();
		});
		token.addEventListener("token-dragging", (e) => {
			this.dispatchEvent(new CustomEvent("dragging-token", { detail: { token: token, pos: (<CustomEvent>e).detail }}));
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

	saveBoardState():void {
		const storage = LocalStorageService.getInstance();
		const tokenArray:Array<string> = [];
		this.tokens.forEach(token => tokenArray.push(JSON.stringify(token)));
		storage.setItem('tokens', tokenArray);
	}

	getTokenForRole(role:Role):PlayerToken | null {
        let playerToken:PlayerToken | null = null;
        this.getPlayerTokens().forEach(token => {
            if (token.getPerceivedRole() == role || token.getRole() == role) playerToken = token;
        });
        return playerToken;
    }

	getReminderTokensForRole(role:Role):Array<ReminderToken> {
        const tokens:Array<ReminderToken> = [];
        this.getReminderTokens().forEach(token => {
            if (token.getRole() == role) tokens.push(token);
        });
        return tokens;
    }

	isRoleAlive(role:Role):boolean {
		let alive:boolean = false;
		this.getPlayerTokens().forEach(token => {
			if (token.getPerceivedRole() == role && !token.isDead()) alive = true;
		});
		return alive;
	}
	
	isRoleInUse(role:Role):boolean {
		let result:boolean = false;
		this.getPlayerTokens().forEach(token => {
			if (token.getPerceivedRole() == role || token.getRole() == role) result = true;
		});
		if (DemonBluffsScreen.bluffs.includes(role)) result = true;
		return result;
	}

	updateTokenMovable():void {
        this.tokens.forEach(token => {
            if (token instanceof PlayerToken) token.setMovable(!Game.lockPlayerTokens && !Game.spectateMode);
			else token.setMovable(!Game.spectateMode);

			if (Game.spectateMode) token.classList.add('spectate');
			else token.classList.remove('spectate');
        });        
    }

	getPlayerTokens():Array<PlayerToken> {
		const playerTokens:Array<PlayerToken> = [];
		this.tokens.forEach(token => {
			if (token instanceof PlayerToken) playerTokens.push(token);
		});
		return playerTokens;
	}

	getReminderTokens():Array<ReminderToken> {
		const reminderTokens:Array<ReminderToken> = [];
		this.tokens.forEach(token => {
			if (token instanceof ReminderToken) reminderTokens.push(token);
		});
		return reminderTokens;
	}

	getDraggingToken():Token | null {
		return this.draggingToken;
	}

	updateNightOrderBadges():void {
		this.getPlayerTokens().forEach(token => {
			token.setFirstNightOrder(0);
			token.setOtherNightOrder(0);
		});

		let firstNightOrder:number = 1;
		firstNightTasks.forEach(task => {
			if (task.type == NightOrderTaskType.ROLE && this.isRoleInUse(task.role!)) {
				this.getTokenForRole(task.role!)?.setFirstNightOrder(firstNightOrder);
				firstNightOrder++;
			}
		});

		let otherNightOrder:number = 1;
		otherNightTasks.forEach(task => {
			if (task.type == NightOrderTaskType.ROLE && this.isRoleAlive(task.role!)) {
				this.getTokenForRole(task.role!)?.setOtherNightOrder(otherNightOrder);
				otherNightOrder++;
			}
		});
	}
}