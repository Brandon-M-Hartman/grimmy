import { Role, roleData, RoleInfo } from "./role";
import { Token } from "./token";

export class ReminderToken extends Token {

    type:Role;
    roleInfo:RoleInfo;

    constructor(type:Role, index:number) {
        super();

        this.type = type;
        this.roleInfo = roleData[type];
        this.setText(roleData[type].reminders[index]);

        const icon = document.createElement("img");
        icon.src = 'assets/token/' + this.type + '.webp';
        icon.className = "icon";
        icon.draggable = false;
        this.container.appendChild(icon);
    }
}