import { Application } from "./application";
import { Role, roleData, RoleInfo } from "./role";
import { TokenDisplayScreen } from "./screens/tokendisplay";
import { TokenOptionsScreen } from "./screens/tokenoptions";
import { Token } from "./token";

export class PlayerToken extends Token {

    type:Role;
    roleInfo:RoleInfo;
	dead:boolean;
	
	private playerName:string;
	private nameTag:HTMLElement;

    constructor(type:Role) {
        super();

		this.playerName = "";
		this.dead = false;
    	this.type = type;
		this.roleInfo = roleData[type];

		const icon = document.createElement("img");
		icon.src = 'assets/token/' + this.type + '.webp';
		icon.className = "icon";
		icon.draggable = false;
		this.container.appendChild(icon);

        if (this.roleInfo.setup) this.addSetupReminder();
        if (this.roleInfo.top > 0) this.addTopReminder(this.roleInfo.top);
        if (this.roleInfo.left > 0) this.addLeftReminder(this.roleInfo.left);
        if (this.roleInfo.right > 0) this.addRightReminder(this.roleInfo.right);

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

    connectedCallback() {
		this.makeText(this.roleInfo.name.toUpperCase());
	}

    protected onTokenTapped():void {
		Application.ui.pushScreen(new TokenOptionsScreen(this));
	}

	protected onTokenDoubleTapped():void {
		Application.ui.pushScreen(new TokenDisplayScreen(this));
	}

    private addSetupReminder():void {
        const icon = document.createElement("img");
		icon.src = 'assets/token/setup.webp';
		icon.className = "reminder";
		icon.draggable = false;
		this.container.appendChild(icon);
    }

    private addTopReminder(num:number):void {
        const icon = document.createElement("img");
		icon.src = 'assets/token/top-' + num + '.webp';
		icon.className = "reminder";
		icon.draggable = false;
		this.container.appendChild(icon);
    }

    private addLeftReminder(num:number):void {
        const icon = document.createElement("img");
		icon.src = 'assets/token/left-' + num + '.webp';
		icon.className = "reminder";
		icon.draggable = false;
		this.container.appendChild(icon);
    }

    private addRightReminder(num:number):void {
        const icon = document.createElement("img");
		icon.src = 'assets/token/right-' + num + '.webp';
		icon.className = "reminder";
		icon.draggable = false;
		this.container.appendChild(icon);
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

}