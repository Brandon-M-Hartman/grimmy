import { Role, roleData, RoleInfo } from "./role";
import { Token } from "./token";

export class ReminderToken extends Token {

    type:Role;
    roleInfo:RoleInfo;
    text:string;

    constructor(type:Role, index:number) {
        super();

        this.type = type;
        this.roleInfo = roleData[type];
        this.text = roleData[type].reminders[index] as string;

        const icon = document.createElement("img");
        icon.src = 'assets/token/' + this.type + '.webp';
        icon.className = "icon";
        icon.draggable = false;
        this.container.appendChild(icon);
    }

    addLabel():void {
        this.makeText(this.text);
    }

    // type:Role;
    // text:string;

    // constructor(type:Role, index:number) {
    //     super();

    //     this.type = type;
    //     this.text = roleData[type].reminders[index] as string;
        
	// 	this.addSprites();
    // }

    // addSprites():void {
    //     super.addSprites();

    //     this.token.scale = 0.5;
    //     this.token.tint = 0x222266;

    //     const icon:Sprite = Sprite.from(Assets.get('icon.' + this.type));
    //     icon.anchor.set(0.5);
    //     icon.scale = 0.5;
    //     this.container.addChild(icon);

    //     this.makeText(this.text);
    // }

    // protected getTokenRadius():number {
    //     return 30;
    // }

    // protected getFontStyle():Partial<TextStyle> {
	// 	return {
	// 		fontFamily: 'Trade Gothic',
	// 		fontSize: 18,
	// 		fill: 0xffffff,
	// 	};
	// }
}