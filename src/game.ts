import { Application } from "./application";
import { Role, RoleCategory } from "./role";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleSelectScreen } from "./screens/roleselect";

export class Game {
    static roles:Array<Role>;

    static setup():void {
        console.log("setup");
        Application.ui.pushScreen(new NumPlayersScreen((counts:Map<RoleCategory, number>) => {
            Application.ui.popScreen();
            Application.ui.pushScreen(new RoleSelectScreen((selectedRoles:any) => {
                this.roles = selectedRoles;
                console.log(this.roles);
            }, undefined, counts));
        }));
    }
}