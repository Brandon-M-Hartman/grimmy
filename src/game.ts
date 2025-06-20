import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { Role, RoleCategory } from "./role";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleReviewScreen } from "./screens/rolereview";
import { RoleSelectScreen } from "./screens/roleselect";

export class Game {
    static roles:Array<Role> = [];
    static tokens:Array<PlayerToken> = [];

    static setup(onComplete:Function):void {
        console.log("setup");
        Application.ui.pushScreen(new NumPlayersScreen((counts:Map<RoleCategory, number>) => {
            Application.ui.popScreen();
            Application.ui.pushScreen(new RoleSelectScreen((selectedRoles:any) => {
                this.roles = selectedRoles;
                Application.ui.popScreen();
                Application.ui.pushScreen(new RoleReviewScreen(() => {
                    Application.ui.popScreen();
                    onComplete();
                }, () => {
                    Application.ui.popScreen();
                }));
            }, undefined, counts));
        }));
    }
}