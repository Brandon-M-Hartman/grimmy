import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Screen } from "../screen"
import { TokenDisplayScreen } from "./tokendisplay";

export class TokenOptionsScreen extends Screen {
    constructor(token:PlayerToken) {
        super();

        var container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        var buttons = document.createElement('div');
        buttons.classList.add("buttons-container");
        container.appendChild(buttons);

        var tokenContainer = document.createElement('div');
        tokenContainer.classList.add("token-container");
        container.appendChild(tokenContainer);

        var dt:PlayerToken = new PlayerToken(token.type);
        tokenContainer.appendChild(dt);
        dt.setDisplay(true);

        var showButton:HTMLButtonElement = document.createElement('button');
        buttons.appendChild(showButton);
        showButton.textContent = 'Show';

        var shroudButton:HTMLButtonElement = document.createElement('button');
        buttons.appendChild(shroudButton);
        shroudButton.textContent = token.dead ? 'Unshroud' : 'Shroud';

        var changeRoleButton:HTMLButtonElement = document.createElement('button');
        buttons.appendChild(changeRoleButton);
        changeRoleButton.textContent = 'Change role';

        var changeNameButton:HTMLButtonElement = document.createElement('button');
        buttons.appendChild(changeNameButton);
        changeNameButton.textContent = 'Change name';

        var upsideDownButton:HTMLButtonElement = document.createElement('button');
        buttons.appendChild(upsideDownButton);
        upsideDownButton.textContent = 'Turn upside down';

        this.contents.onclick = () => {
            Application.ui.popScreen();
        }

        // button events

        showButton.onclick = (e) => {
            e.stopPropagation();
            Application.ui.popScreen();
            Application.ui.pushScreen(new TokenDisplayScreen(token));
        };

        shroudButton.onclick = (e) => {
            e.stopPropagation();
            token.toggleShroud();
            Application.ui.popScreen();
        };
    }
}