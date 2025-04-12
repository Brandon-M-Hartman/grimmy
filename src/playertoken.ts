import { Role, RoleInfo, roleData } from "./role";
import { Token } from "./token";
import { Assets, Sprite } from "pixi.js";

export class PlayerToken extends Token {

    type:Role;
    role:RoleInfo;

    constructor(type:Role) {
        super();

        this.type = type;

		this.role = roleData[type];
		console.log(this.role);
        
		this.addSprites();
    }

    addSprites():void {
        super.addSprites();

        const icon:Sprite = Sprite.from(Assets.get('icon.' + this.type));
		icon.anchor.set(0.5);
		this.container.addChild(icon);

        if (this.role.top > 0) {
        	const remindersTop:Sprite = Sprite.from(Assets.get('top.' + this.role.top));
        	remindersTop.anchor.set(0.5);
        	remindersTop.scale = 0.515;
        	this.container.addChild(remindersTop);
        }

        if (this.role.left > 0) {
        	const remindersLeft:Sprite = Sprite.from(Assets.get('left.' + this.role.left));
        	remindersLeft.anchor.set(0.5);
        	remindersLeft.scale = 0.515;
        	this.container.addChild(remindersLeft);
        }

        if (this.role.right > 0) {
        	const remindersRight:Sprite = Sprite.from(Assets.get('right.' + this.role.right));
        	remindersRight.anchor.set(0.5);
        	remindersRight.scale = 0.515;
        	this.container.addChild(remindersRight);
        }

        if (this.role.setup) {
        	const remindersSetup:Sprite = Sprite.from(Assets.get('setup'));
        	remindersSetup.anchor.set(0.5);
        	remindersSetup.scale = 0.515;
        	this.container.addChild(remindersSetup);
        }

        this.makeText(this.role.name.toUpperCase());
    }

}