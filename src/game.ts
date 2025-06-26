import { Application } from "./application";
import { LocalStorageService } from "./localstorage";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { Role, RoleCategory, roleData } from "./role";
import { DemonBluffsScreen } from "./screens/demonbluffs";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleReplacementScreen } from "./screens/rolereplacement";
import { RoleReviewScreen } from "./screens/rolereview";
import { RoleSelectScreen } from "./screens/roleselect";
import { TokenSelectScreen } from "./screens/tokenselect";
import { Token } from "./token";

export class Game {
    static lockPlayerTokens:boolean = false;
    static spectateMode:boolean = false;
    static roles:Array<Role> = [];

    static setup(onComplete:() => void):void {
        // clear any existing roles/tokens
        this.roles = [];
        DemonBluffsScreen.clearBluffs();

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

            if (Game.roles.includes(Role.DRUNK)) this.replaceDrunkToken(onComplete);
            else this.reviewRoles(onComplete);
        }, undefined, counts));
    }

    static replaceDrunkToken(onComplete:() => void) {
        const drunkToken:PlayerToken = Application.townSquare.getTokenForRole(Role.DRUNK)!;
        Application.ui.pushScreen(new RoleReplacementScreen(drunkToken, () => {
            Application.ui.popScreen();
            this.reviewRoles(onComplete);
        }));
    }

    static reviewRoles(onComplete:() => void) {
        Application.ui.pushScreen(new RoleReviewScreen(() => {
            // Add to board
            Application.ui.popScreen();
            this.createReminderTokensForRoles();
            onComplete();
        }, () => {
            // Hand out
            Application.ui.popScreen();
            Application.ui.pushScreen(new TokenSelectScreen((drawnTokens:Array<PlayerToken>) => {
                Application.ui.popScreen();
                Application.townSquare.tokens = drawnTokens;
                this.createReminderTokensForRoles();
                onComplete();
            }));
        }));
    }

    static createTokensFromRoles():void {
        const tokens:Array<Token> = [];
        this.roles.forEach(role => {
            const token:PlayerToken = new PlayerToken();
            token.setRole(role);
            tokens.push(token);
        });
        Application.townSquare.tokens = tokens;
    }

    static createReminderTokensForRoles():void {
        // then create reminder tokens
        this.roles.forEach(role => {
            for (let i = 0; i < roleData[role].reminders.length; i++) {
                const reminderToken:ReminderToken = new ReminderToken(role, i);
                reminderToken.bindEvents();
                Application.townSquare.tokens.push(reminderToken);
            }
        });
    }

    static togglePlayerTokenLock():void {
        this.lockPlayerTokens = !this.lockPlayerTokens;
        Application.townSquare.updateTokenMovable();
        const storage = LocalStorageService.getInstance();
        storage.setItem('lockPlayerTokens', this.lockPlayerTokens);
    }

    static setPlayerTokenLock(lock:boolean):void {
        this.lockPlayerTokens = lock;
         Application.townSquare.updateTokenMovable();
    }

    static toggleSpectateMode():void {
        this.spectateMode = !this.spectateMode;
         Application.townSquare.updateTokenMovable();
    }
}