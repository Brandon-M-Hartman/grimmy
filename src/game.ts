import { Application } from "./application";
import { LocalStorageService } from "./localstorage";
import { PlayerToken } from "./playertoken";
import { Role, RoleCategory } from "./role";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleReplacementScreen } from "./screens/rolereplacement";
import { RoleReviewScreen } from "./screens/rolereview";
import { RoleSelectScreen } from "./screens/roleselect";
import { TokenSelectScreen } from "./screens/tokenselect";

export class Game {
    static lockPlayerTokens:boolean = false;
    static spectateMode:boolean = false;
    static roles:Array<Role> = [];
    static tokens:Array<PlayerToken> = [];

    static setup(onComplete:() => void):void {
        // clear any existing roles/tokens
        this.roles = [];
        this.tokens = [];

        Application.ui.pushScreen(new NumPlayersScreen((counts:Map<RoleCategory, number>) => {
            Application.ui.popScreen();
            Game.selectRoles(counts, onComplete);
        }));
    }

    static selectRoles(counts:Map<RoleCategory, number>, onComplete:() => void) {
        Application.ui.pushScreen(new RoleSelectScreen((selectedRoles:Array<Role>) => {
            Game.roles = selectedRoles;
            Game.createTokensFromRoles();
            Application.ui.popScreen();

            if (Game.roles.includes(Role.DRUNK)) this.replaceDrunkRole(onComplete);
            else this.reviewRoles(onComplete);
        }, undefined, counts));
    }

    static replaceDrunkRole(onComplete:() => void) {
        const drunkToken:PlayerToken = this.getTokenForRole(Role.DRUNK)!;
        Application.ui.pushScreen(new RoleReplacementScreen(drunkToken, () => {
            Application.ui.popScreen();
            this.reviewRoles(onComplete);
        }));
    }

    static reviewRoles(onComplete:() => void) {
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
    }

    static createTokensFromRoles():void {
        this.roles.forEach(role => {
            const token:PlayerToken = new PlayerToken();
            token.setRole(role);
            this.tokens.push(token);
        });
    }

    static getTokenForRole(role:Role):PlayerToken | null {
        let playerToken:PlayerToken | null = null;
        this.tokens.forEach(token => {
            if (token.getRole() == role) playerToken = token;
        });
        return playerToken;
    }

    static isRoleAlive(role:Role):boolean {
        let alive:boolean = false;
        this.tokens.forEach(token => {
            if (token.getPerceivedRole() == role && !token.isDead()) alive = true;
        });
        return alive;
    }

    static isRoleInUse(role:Role):boolean {
        let result:boolean = false;
        this.tokens.forEach(token => {
            if (token.getPerceivedRole() == role || token.getRole() == role) result = true;
        });
        return result;
    }

    static togglePlayerTokenLock():void {
        this.lockPlayerTokens = !this.lockPlayerTokens;
        this.updateTokenMovable();
        const storage = LocalStorageService.getInstance();
        storage.setItem('lockPlayerTokens', this.lockPlayerTokens);
    }

    static setPlayerTokenLock(lock:boolean):void {
        this.lockPlayerTokens = lock;
        this.updateTokenMovable();
    }

    static toggleSpectateMode():void {
        this.spectateMode = !this.spectateMode;
        this.updateTokenMovable();
    }

    static updateTokenMovable():void {
        this.tokens.forEach(token => {
            token.setMovable(!this.lockPlayerTokens && !this.spectateMode);
            token.reminderTokens.forEach(token => {
                token.setMovable(!this.spectateMode);
            });
        });        
    }
}