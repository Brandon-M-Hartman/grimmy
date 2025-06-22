import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { roleData } from "../role";
import { Screen } from "../screen";

export class TokenDisplayScreen extends Screen {
    constructor(token:PlayerToken) {
        super();

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const tokenContainer = document.createElement('div');
        tokenContainer.classList.add("token-container");
        container.appendChild(tokenContainer);

        const dt:PlayerToken = new PlayerToken().makeDisplay(1.0);
        dt.setRole(token.getPerceivedRole());
        tokenContainer.appendChild(dt);

        if (token.getRole()) {            
            const roleDescription = document.createElement('div');
            roleDescription.className = "role-description";
            roleDescription.textContent = roleData[token.getPerceivedRole()!].description;
            container.appendChild(roleDescription);
        }

        this.onclick = () => {
            Application.ui.popScreen();
        };
    }
}