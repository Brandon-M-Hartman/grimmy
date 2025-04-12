import { Assets, Sprite, TextStyle } from "pixi.js";
import { Role, roleData } from "./role";
import { Token } from "./token";

export enum Reminder {
    IMP_DEAD,
    MONK_PROTECTED
}

export class ReminderToken extends Token {

    type:Role;
    text:string;

    constructor(type:Role, index:number) {
        super();

        this.type = type;
        this.text = roleData[type].reminders[index] as string;
        
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

        this.makeText(this.text);
    }

    protected getTokenRadius():number {
        return 30;
    }

    protected getFontStyle():Partial<TextStyle> {
		return {
			fontFamily: 'Trade Gothic',
			fontSize: 18,
			fill: 0xffffff,
		};
	}
}