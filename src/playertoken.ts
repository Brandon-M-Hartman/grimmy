import { Application } from "./application";
import { Role, roleData, RoleInfo } from "./role";
import { TokenDisplayScreen } from "./screens/tokendisplay";
import { TokenOptionsScreen } from "./screens/tokenoptions";
import { Token, TokenType } from "./token";

export class PlayerToken extends Token {

	onRoleChanged:(role:Role | null) => void;
	onStateChanged:() => void;
	onReminderTokensCreated:() => void;
	
	private dead:boolean;
	private roleInfo:RoleInfo | null;
    private playerRole:Role | null;
	private perceivedRole:Role | null;
	private icon:HTMLImageElement;
	private topElement:HTMLImageElement;
	private leftElement:HTMLImageElement;
	private rightElement:HTMLImageElement;
	private setupElement:HTMLImageElement;
	private nightOrderBadgeFirst:HTMLDivElement;
	private nightOrderBadgeOther:HTMLDivElement;
	private playerName:string;
	private nameTag:HTMLElement;
	private selected:boolean;

    constructor() {
        super();

		this.type = TokenType.PLAYER;
		this.playerName = "";
		this.dead = false;
		this.playerRole = null;
		this.perceivedRole = null;
		this.roleInfo = null;
		this.onRoleChanged = () => {};
		this.onReminderTokensCreated = () => {};
		this.onStateChanged = () => {};
		this.selected = false;

		this.icon = document.createElement("img");
		this.icon.className = "icon";
		this.icon.draggable = false;
		this.container.appendChild(this.icon);

		this.setupElement = document.createElement("img");
		this.setupElement.src = 'assets/token/setup.webp';
		this.setupElement.className = "reminder";
		this.container.appendChild(this.setupElement);

		this.topElement = document.createElement("img");
		this.topElement.className = "reminder";
		this.container.appendChild(this.topElement);

		this.leftElement = document.createElement("img");
		this.leftElement.className = "reminder";
		this.container.appendChild(this.leftElement);

		this.rightElement = document.createElement("img");
		this.rightElement.className = "reminder";
		this.container.appendChild(this.rightElement);

		const shroud = document.createElement("img");
		shroud.src = 'assets/token/shroud.webp';
		shroud.className = "shroud";
		shroud.draggable = false;
		this.container.appendChild(shroud);
		
		this.nameTag = document.createElement("span");
		this.nameTag.className = "player-name";
		this.container.appendChild(this.nameTag);
		this.setPlayerName("");

		this.nightOrderBadgeFirst = document.createElement('div');
		this.nightOrderBadgeFirst.className = "badge firstNightOrder";
		this.nightOrderBadgeFirst.textContent = "0";
		this.container.appendChild(this.nightOrderBadgeFirst);

		this.nightOrderBadgeOther = document.createElement('div');
		this.nightOrderBadgeOther.className = "badge otherNightOrder";
		this.nightOrderBadgeOther.textContent = "0";
		this.container.appendChild(this.nightOrderBadgeOther);
	}

	getRole():Role | null {
		return this.playerRole;
	}

	setRole(role:Role | null):void {
		this.playerRole = role;

		if (!role) {
			this.roleInfo = null;
			this.icon.style.visibility = 'hidden';
			this.setupElement.style.visibility = 'hidden';
			this.topElement.style.visibility = 'hidden';
			this.leftElement.style.visibility = 'hidden';
			this.rightElement.style.visibility = 'hidden';
			return;
		}

		this.updateRoleInfo(role);
	}

	getPerceivedRole():Role | null {
		return this.perceivedRole ? this.perceivedRole : this.playerRole;
	}

	setPerceivedRole(role:Role | null):void {
		this.perceivedRole = role;
		if (role) this.updateRoleInfo(role);
	}

	private updateRoleInfo(role:Role):void {
		this.onRoleChanged(role);

		this.roleInfo = roleData[this.getPerceivedRole()!];
		this.icon.src = 'assets/token/' + role + '.webp';
		this.icon.style.visibility = 'visible';
		this.setText(this.roleInfo.name.toUpperCase());

		this.setupElement.style.visibility = this.roleInfo.setup ? 'visible' : 'hidden';
		this.topElement.src = this.roleInfo.top > 0 ? 'assets/token/top-' + this.roleInfo.top + '.webp' : '';
		this.topElement.style.visibility = this.roleInfo.top > 0 ? 'visible' : 'hidden';
		this.leftElement.src = this.roleInfo.left ? 'assets/token/left-' + this.roleInfo.left + '.webp' : '';
		this.leftElement.style.visibility = this.roleInfo.left > 0 ? 'visible' : 'hidden';
		this.rightElement.src = this.roleInfo.right > 0 ? 'assets/token/right-' + this.roleInfo.right + '.webp' : '';
		this.rightElement.style.visibility = this.roleInfo.right > 0 ? 'visible' : 'hidden';
	}

    protected onTokenTapped():void {
		Application.ui.pushScreen(new TokenOptionsScreen(this));
	}

	protected onTokenDoubleTapped():void {
		Application.ui.pushScreen(new TokenDisplayScreen(this));
	}

	public shroud() {
		this.dead = true;
		this.classList.add('dead');
		this.onStateChanged();
	}

	public unshroud() {
		this.dead = false;
		this.classList.remove('dead');
		this.onStateChanged();
	}

	public toggleShroud() {
		if (!this.dead) this.shroud();
		else this.unshroud();
	}

	public isDead():boolean {
		return this.dead;
	}

	public setPlayerName(name:string) {
		this.playerName = name;		
		this.nameTag.textContent = this.playerName;
		this.nameTag.style.visibility = this.playerName.length == 0 ? 'hidden' : 'visible';
		this.onStateChanged();
	}

	public getPlayerName():string {
		return this.playerName;
	}
	
	public hasPlayerName():boolean {
		return this.playerName.length > 0;
	}

	public makeDisplay(scale:number):PlayerToken {
		this.classList.add('display');
		this.style.scale = `${scale}`;
		this.nameTag.style.display = 'none';
		this.onclick = null;
		return this;
	}

	public makeFunctional():PlayerToken {
		this.classList.remove('display');
		this.style.scale = `1`;
		this.nameTag.style.display = 'block';
		this.onclick = null;
		return this;
	}

	public makeHidden():PlayerToken {
		this.classList.add('hidden');
		return this;
	}

	public isHidden():boolean {
		return this.classList.contains('hidden');
	}

	public reveal():void {
		this.classList.remove('hidden');
	}

	public isSelected():boolean {
		return this.selected;
	}

	public setSelected(selected:boolean) {
		this.selected = selected;
		if (selected) {
			this.classList.add('selected');
			this.classList.remove('unselected');
		}
		else
		{
			this.classList.add('unselected');
			this.classList.remove('selected');
		}
	}

	static from(object:PlayerToken):PlayerToken {
		// Create new player token and assign values from object
		const token:PlayerToken = new PlayerToken();
		token.setRole(object.playerRole);
		if (object.perceivedRole) token.setPerceivedRole(object.perceivedRole);
		token.setPosition(object.pos.x, object.pos.y);
		if (object.dead) token.shroud();
		token.setPlayerName(object.playerName);

		return token;
	}

}