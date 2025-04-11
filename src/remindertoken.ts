import { Token } from "./token";

export enum Reminder {
    IMP_DEAD,
    MONK_PROTECTED
}

export class ReminderToken extends Token {

    constructor() {
        super();
        
		this.addSprites();
    }

    addSprites():void {
        super.addSprites();

        this.token.scale = 0.5;
        this.token.tint = 0x222266;

        this.makeText("Reminder");
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