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

        const buttons = document.createElement('div');
        buttons.className = "buttons-container";
        container.appendChild(buttons);

        const newGameButton = document.createElement('button');
        newGameButton.textContent = "Start new game";
        buttons.appendChild(newGameButton);
        newGameButton.onclick = () => {
            Application.ui.popScreen();
            Application.startNewGame();
        }

        const lockTokensButton = document.createElement('button');
        lockTokensButton.textContent = "Lock player tokens";
        buttons.appendChild(lockTokensButton);

        const supportButton = document.createElement('button');
        supportButton.textContent = "Support this tool on Ko-fi";
        buttons.appendChild(supportButton);
    }
}