import { Application } from "./application";
import { Role, roleData, RoleInfo } from "./role";
import { TokenDisplayScreen } from "./screens/tokendisplay";
import { TokenOptionsScreen } from "./screens/tokenoptions";
import { Token } from "./token";

export class PlayerToken extends Token {

	dead:boolean;
	
	private roleInfo:RoleInfo | null;
    private playerRole:Role;
	private icon:HTMLImageElement;
	private topElement:HTMLImageElement;
	private leftElement:HTMLImageElement;
	private rightElement:HTMLImageElement;
	private setupElement:HTMLImageElement;
	private playerName:string;
	private nameTag:HTMLElement;

    constructor(role:Role) {
        super();

		this.playerName = "";
    	this.playerRole = role;
		this.dead = false;
		this.roleInfo = null;

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

		this.setRole(role);

		const shroud = document.createElement("img");
		shroud.src = 'assets/token/shroud.webp';
		shroud.className = "shroud";
		shroud.draggable = false;
		this.container.appendChild(shroud);
		
		this.nameTag = document.createElement("span");
		this.nameTag.className = "player-name";
		this.container.appendChild(this.nameTag);
		this.setPlayerName("");
	}

	getRole():Role {
		return this.playerRole;
	}

	setRole(role:Role):void {
		this.roleInfo = roleData[role];
		this.icon.src = 'assets/token/' + role + '.webp';
		this.setText(this.roleInfo.name.toUpperCase());

		this.setupElement.style.visibility = this.roleInfo.setup ? 'visible' : 'hidden';
		this.topElement.src = 'assets/token/top-' + this.roleInfo.top + '.webp';
		this.topElement.style.visibility = this.roleInfo.top > 0 ? 'visible' : 'hidden';
		this.leftElement.src = 'assets/token/left-' + this.roleInfo.left + '.webp';
		this.leftElement.style.visibility = this.roleInfo.left > 0 ? 'visible' : 'hidden';
		this.rightElement.src = 'assets/token/right-' + this.roleInfo.right + '.webp';
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
	}

	public unshroud() {
		this.dead = false;
		this.classList.remove('dead');
	}

	public toggleShroud() {
		if (!this.dead) this.shroud();
		else this.unshroud();
	}

	public setPlayerName(name:string) {
		this.playerName = name;		
		this.nameTag.textContent = this.playerName;
		this.nameTag.style.visibility = this.playerName.length == 0 ? 'hidden' : 'visible';
	}

	public getPlayerName():string {
		return this.playerName;
	}	

	public asDisplay(scale:number):PlayerToken {
		this.classList.add('display');
		this.style.scale = `${scale}`;
		return this;
	}

}