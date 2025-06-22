import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Role, RoleCategory } from "../role";
import { Screen } from "../screen";
import { RoleSelectScreen } from "./roleselect";

export class RoleReplacementScreen extends Screen {
    constructor(token:PlayerToken, onComplete?:Function) {
        super();

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const text = document.createElement('div');
        text.textContent = "Select a Townsfolk to replace the Drunk token.";
        text.className = "text";
        container.appendChild(text);

        container.appendChild(token.makeDisplay(0.75));
        token.style.cursor = 'pointer';

        const buttons = document.createElement('div');
        container.appendChild(buttons);

        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.style.display = 'none';
        buttons.appendChild(continueButton);

        token.onclick = () => {
            Application.ui.pushScreen(new RoleSelectScreen((role:Role) => {
                Application.ui.popScreen();
                token.setPerceivedRole(role);
                continueButton.style.display = 'block';
            }, [RoleCategory.TOWNSFOLK]));
        }

        continueButton.onclick = () => {
            if (onComplete) onComplete();
        }
    }
}