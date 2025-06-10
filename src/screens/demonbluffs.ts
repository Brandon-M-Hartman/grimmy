import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Role } from "../role";
import { Screen } from "../screen";
import { RoleSelectScreen } from "./roleselect";

export class DemonBluffsScreen extends Screen {
    static bluffs:Array<Role | null> = [null, null, null];
    container:HTMLDivElement | null = null;

    constructor() {
        super();

        this.build();

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
                let token:PlayerToken = new PlayerToken().asDisplay(0.7);
                token.setRole(DemonBluffsScreen.bluffs[i]);
                tokenContainer.appendChild(token);

                token.addEventListener("click", (e) => {
                    e.stopPropagation();
                    Application.ui.pushScreen(new RoleSelectScreen((role:Role) => {
                        Application.ui.popScreen();
                        DemonBluffsScreen.bluffs[i] = role;
                        this.build();
                    }));
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
                    Application.ui.pushScreen(new RoleSelectScreen((role:Role) => {
                        Application.ui.popScreen();
                        DemonBluffsScreen.bluffs[i] = role;
                        this.build();
                    }));
                });
            }
        }
    }
}