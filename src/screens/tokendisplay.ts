import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { roleData } from "../role";
import { Screen } from "../screen";

export class TokenDisplayScreen extends Screen {
    constructor(token:PlayerToken) {
        super();

        var container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        var tokenContainer = document.createElement('div');
        tokenContainer.classList.add("token-container");
        container.appendChild(tokenContainer);

        var dt:PlayerToken = new PlayerToken().makeDisplay(1.0);
        dt.setRole(token.getPerceivedRole());
        tokenContainer.appendChild(dt);

        if (token.getRole()) {            
            var roleDescription = document.createElement('div');
            roleDescription.className = "role-description";
            roleDescription.textContent = roleData[token.getPerceivedRole()!].description;
            container.appendChild(roleDescription);
        }

        this.onclick = () => {
            Application.ui.popScreen();
        };
    }
}