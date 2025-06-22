import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { Role, RoleCategory } from "./role";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleReviewScreen } from "./screens/rolereview";
import { RoleSelectScreen } from "./screens/roleselect";
import { TokenSelectScreen } from "./screens/tokenselect";

export class Game {
    static lockPlayerTokens:boolean = false;
    static roles:Array<Role> = [];
    static tokens:Array<PlayerToken> = [];

    static setup(onComplete:Function):void {
        // clear any existing roles/tokens
        this.roles = [];
        this.tokens = [];

        Application.ui.pushScreen(new NumPlayersScreen((counts:Map<RoleCategory, number>) => {
            Application.ui.popScreen();
            Application.ui.pushScreen(new RoleSelectScreen((selectedRoles:any) => {
                this.roles = selectedRoles;
                this.createTokensFromRoles();
                Application.ui.popScreen();
                Application.ui.pushScreen(new RoleReviewScreen(() => {
                    Application.ui.popScreen();
                    onComplete();
                }, () => {
                    Application.ui.popScreen();
                    Application.ui.pushScreen(new TokenSelectScreen((drawnTokens:Array<PlayerToken>) => {
                        Application.ui.popScreen();
                        this.tokens = drawnTokens;
                        onComplete();
                    }));
                }));
            }, undefined, counts));
        }));
    }

    static createTokensFromRoles():void {
        this.roles.forEach(role => {
            const token:PlayerToken = new PlayerToken();
            token.setRole(role);
            this.tokens.push(token);
        });
    }

    static isRoleAlive(role:Role):boolean {
        let alive:boolean = false;
        this.tokens.forEach(token => {
            if (token instanceof PlayerToken && token.getRole() == role && !token.isDead()) alive = true;
        });
        return alive;
    }

    static togglePlayerTokenLock():void {
        this.lockPlayerTokens = !this.lockPlayerTokens;
        this.tokens.forEach(token => {
            if (token instanceof PlayerToken) token.setMovable(!this.lockPlayerTokens);
        });
    }
}