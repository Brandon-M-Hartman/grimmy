import { Role, roleData, RoleInfo } from "./role";
import { Token, TokenType } from "./token";

export class ReminderToken extends Token {

    role:Role;
    roleInfo:RoleInfo;
    index:number;

    constructor(role:Role, index:number) {
        super();

        this.type = TokenType.REMINDER;
        this.role = role;
        this.index = index;
        this.roleInfo = roleData[role];
        this.setText(roleData[role].reminders[index]);

        const icon = document.createElement("img");
        icon.src = 'assets/token/' + this.role + '.webp';
        icon.className = "icon";
        icon.draggable = false;
        this.container.appendChild(icon);
    }

    getRole():Role {
        return this.role;
    }

    getIndex():number {
        return this.index;
    }

    static from(object:ReminderToken):ReminderToken {
		// Create new player token and assign values from object
		const token:ReminderToken = new ReminderToken(object.role, object.index);
		token.setPosition(object.pos.x, object.pos.y);

		return token;
	}
}