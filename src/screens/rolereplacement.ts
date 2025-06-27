import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Role, RoleCategory } from "../role";
import { Screen } from "../screen";
import { RoleSelectScreen } from "./roleselect";

export class RoleReplacementScreen extends Screen {

    replacementRole:Role|null = null;

    constructor(role:Role, onComplete?:(role:Role) => void) {
        super();

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const text = document.createElement('div');
        text.textContent = "Select a Townsfolk to replace the Drunk token.";
        text.className = "text";
        container.appendChild(text);

        const token:PlayerToken = new PlayerToken().makeDisplay(0.7);
        token.setRole(role);
        token.style.cursor = 'pointer';
        container.appendChild(token);

        const buttons = document.createElement('div');
        container.appendChild(buttons);

        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.style.display = 'none';
        buttons.appendChild(continueButton);

        token.onclick = () => {
            Application.ui.pushScreen(new RoleSelectScreen((roles:Array<Role>) => {
                Application.ui.popScreen();
                this.replacementRole = roles[0];
                token.setPerceivedRole(roles[0]);
                if (this.replacementRole) continueButton.style.display = 'block';
            }, [RoleCategory.TOWNSFOLK]));
        }

        continueButton.onclick = () => {
            if (onComplete) onComplete(this.replacementRole!);
        }
    }
}