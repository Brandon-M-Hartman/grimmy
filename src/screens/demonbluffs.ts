import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Role } from "../role";
import { Screen } from "../screen";

export class DemonBluffsScreen extends Screen {
    constructor() {
        super();

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const heading = document.createElement('h1');
        heading.classList.add("heading");
        heading.textContent = "Demon Bluffs";
        container.appendChild(heading);

        const tokenContainer = document.createElement('div');
        tokenContainer.classList.add("token-container");
        container.appendChild(tokenContainer);
        
        var dt:PlayerToken = new PlayerToken().asDisplay(0.7);
        dt.setRole(Role.BUTLER);
        tokenContainer.appendChild(dt);

        var dt2:PlayerToken = new PlayerToken().asDisplay(0.7);
        dt2.setRole(Role.SLAYER);
        tokenContainer.appendChild(dt2);

        var dt3:PlayerToken = new PlayerToken().asDisplay(0.7);
        dt3.setRole(Role.WASHERWOMAN);
        tokenContainer.appendChild(dt3);

        this.onclick = () => {
            Application.ui.popScreen();
        };
    }
}