import { Assets, Sprite } from "pixi.js";
import { ReminderData, Role, roleData } from "./role";
import { Token } from "./token";

export enum Reminder {
    IMP_DEAD,
    MONK_PROTECTED
}

export class ReminderToken extends Token {

    type:Role;
    data:ReminderData;

    constructor(type:Role, index:number) {
        super();

        this.type = type;
        this.data = roleData[type].reminders[index] as ReminderData;
        console.log(this.data);
        
		this.addSprites();
    }

    addSprites():void {
        super.addSprites();

        this.token.scale = 0.5;
        this.token.tint = 0x222266;

        const icon:Sprite = Sprite.from(Assets.get('icon.' + this.type));
        icon.anchor.set(0.5);
        icon.scale = 0.5;
        this.container.addChild(icon);

        this.makeText(this.data.text);
    }

    protected getTokenRadius():number {
        return 30;
    }

    protected getFontStyle():Object {
		return {
			fontFamily: 'Trade Gothic',
			fontSize: 18,
			fill: 0xffffff,
		};
	}
}