import { Application } from "../application";
import { Screen } from "../screen";

export class MenuScreen extends Screen {
    constructor() {
        super();

        this.overlay.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const newGameButton = document.createElement('button');
        newGameButton.textContent = "Start new game";
        container.appendChild(newGameButton);

        const lockTokensButton = document.createElement('button');
        lockTokensButton.textContent = "Lock player tokens";
        container.appendChild(lockTokensButton);

        const supportButton = document.createElement('button');
        supportButton.textContent = "Support this tool on Ko-fi";
        container.appendChild(supportButton);
    }
}