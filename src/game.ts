import { Application } from "./application";
import { LocalStorageService } from "./localstorage";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { Role, RoleCategory, roleData } from "./role";
import { Edition, DEFAULT_EDITION, EDITIONS } from "./editions";
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
    static currentEdition:Edition = DEFAULT_EDITION;

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

            if (Game.roles.includes("drunk")) this.replaceDrunkToken(onComplete);
            else this.reviewRoles(onComplete);
        }, undefined, counts));
    }

    static replaceDrunkToken(onComplete:() => void) {
        const drunkToken:PlayerToken = Application.townSquare.getTokenForRole("drunk")!;
        Application.ui.pushScreen(new RoleReplacementScreen("drunk", (replacementRole:Role) => {
            Application.ui.popScreen();
            drunkToken.setPerceivedRole(replacementRole);
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
        // create reminder tokens
        this.roles.forEach(role => {
            Application.townSquare.tokens = Application.townSquare.tokens.concat(this.createReminderTokensForRole(role));
        });
    }

    static createReminderTokensForRole(role:Role):Array<ReminderToken> {
        const createdTokens:Array<ReminderToken> = [];
        for (let i = 0; i < roleData[role].reminders.length; i++) {
            createdTokens.push(new ReminderToken(role, i));
        }
        return createdTokens;
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

    static setEdition(editionId: string):void {
        if (EDITIONS[editionId]) {
            this.currentEdition = EDITIONS[editionId];
            const storage = LocalStorageService.getInstance();
            storage.setItem('currentEdition', editionId);
        }
    }

    static getRolesByCategory(category: RoleCategory): Array<Role> {
        return this.currentEdition.roles.filter(role => {
            const roleInfo = roleData[role];
            if (!roleInfo) return false;
            
            switch (category) {
                case RoleCategory.TOWNSFOLK:
                    return roleInfo.alignment === 0 && roleInfo.category === 'townsfolk';
                case RoleCategory.OUTSIDER:
                    return roleInfo.alignment === 0 && roleInfo.category === 'outsider';
                case RoleCategory.MINION:
                    return roleInfo.alignment === 1 && roleInfo.category === 'minion';
                case RoleCategory.DEMON:
                    return roleInfo.alignment === 1 && roleInfo.category === 'demon';
                default:
                    return false;
            }
        });
    }

    static hasRole(role: Role): boolean {
        return this.currentEdition.roles.includes(role);
    }
}