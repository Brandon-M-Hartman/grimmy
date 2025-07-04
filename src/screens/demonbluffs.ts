import { Application } from "../application";
import { LocalStorageService } from "../localstorage";
import { PlayerToken } from "../playertoken";
import { Role, RoleCategory } from "../role";
import { Screen } from "../screen";
import { RoleSelectScreen } from "./roleselect";

export class DemonBluffsScreen extends Screen {
    static bluffs:Array<Role | null> = [null, null, null];
    container:HTMLDivElement | null = null;

    constructor() {
        super();

        this.build();

        this.overlay.onclick = () => {
            Application.ui.popScreen();
        };

        this.contents.onclick = () => {
            Application.ui.popScreen();
        };
    }

    build = () => {
        if (this.container) {
            this.contents.removeChild(this.container);
        }

        this.container = document.createElement('div');
        this.container.classList.add("wrapper");
        this.contents.appendChild(this.container);

        const heading = document.createElement('h1');
        heading.classList.add("heading");
        heading.textContent = "Demon Bluffs";
        this.container.appendChild(heading);

        const tokenContainer = document.createElement('div');
        tokenContainer.classList.add("token-container");
        this.container.appendChild(tokenContainer);
        
        for (let i = 0; i < 3; i++) {
            if (DemonBluffsScreen.bluffs[i]) {
                const token:PlayerToken = new PlayerToken().makeDisplay(0.7);
                token.setRole(DemonBluffsScreen.bluffs[i]);
                tokenContainer.appendChild(token);

                token.addEventListener("click", (e) => {
                    e.stopPropagation();
                    Application.ui.pushScreen(new RoleSelectScreen((roles:Array<Role>) => {
                        Application.ui.popScreen();
                        DemonBluffsScreen.bluffs[i] = roles[0];
                        DemonBluffsScreen.saveToStorage();
                        this.build();
                    }, [RoleCategory.TOWNSFOLK, RoleCategory.OUTSIDER]));
                });
            }
            else {
                const tokenPlaceholder = document.createElement('div');
                tokenPlaceholder.classList.add("token-placeholder");
                tokenPlaceholder.style.scale = (0.7).toString();
                tokenPlaceholder.innerHTML = "<div class='plus'></div>"
                tokenContainer.appendChild(tokenPlaceholder);

                tokenPlaceholder.addEventListener("click", (e) => {
                    e.stopPropagation();
                    Application.ui.pushScreen(new RoleSelectScreen((roles:Array<Role>) => {
                        Application.ui.popScreen();
                        DemonBluffsScreen.bluffs[i] = roles[0];
                        DemonBluffsScreen.saveToStorage();
                        this.build();
                    }, [RoleCategory.TOWNSFOLK, RoleCategory.OUTSIDER]));
                });
            }
        }
    }

    static clearBluffs():void {
        DemonBluffsScreen.bluffs = [null, null, null];
        DemonBluffsScreen.saveToStorage();
    }

    static saveToStorage():void {
        const storage = LocalStorageService.getInstance();
        storage.setItem('demonBluffs', DemonBluffsScreen.bluffs);
    }
}