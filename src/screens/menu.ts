import { Application } from "../application";
import { Game } from "../game";
import { Screen } from "../screen";

export class MenuScreen extends Screen {
    constructor() {
        super();

        this.contents.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const buttons = document.createElement('div');
        buttons.className = "buttons-container";
        container.appendChild(buttons);

        const newGameButton = new MenuButton("carbon:new-tab", "Set up game");
        buttons.appendChild(newGameButton);
        newGameButton.onclick = (e) => {
            e.stopPropagation();
            Application.ui.popScreen();
            Application.startNewGame();
        }

        const clearBoardButton = new MenuButton("majesticons:eraser", "Clear board");
        buttons.appendChild(clearBoardButton);
        clearBoardButton.onclick = (e) => {
            e.stopPropagation();
            Application.townSquare.clear();
            Application.ui.popScreen();
        }

        const lockTokensButton = new MenuButton(Game.lockPlayerTokens ? "material-symbols:lock-open" : "material-symbols:lock", 
            Game.lockPlayerTokens ? "Unlock player tokens" : "Lock player tokens");
        buttons.appendChild(lockTokensButton);
        lockTokensButton.onclick = (e) => {
            e.stopPropagation();
            Game.togglePlayerTokenLock();
            Application.ui.popScreen();
        }

        const supportButton = new MenuButton("assets/ko-fi.png", "Support this tool");
        buttons.appendChild(supportButton);
        supportButton.onclick = () => {
            window.open('https://ko-fi.com/miltage', '_blank');
        }
    }
}

class MenuButton extends HTMLButtonElement {

    constructor(icon:string, text:string) {
        super();

        if (icon.includes("assets")) {
            const imgElement = document.createElement('img');
            imgElement.src = icon;
            imgElement.className = "icon";
            this.appendChild(imgElement);
        }
        else {
            const iconElement = document.createElement('div');
            iconElement.innerHTML = `<span class="iconify" data-icon="${icon}" data-width="30"></span>`;
            iconElement.className = "icon";
            this.appendChild(iconElement);
        }

        const textElement = document.createElement('div');
        textElement.textContent = text;
        this.appendChild(textElement);
    }
}

customElements.define('menu-button', MenuButton, { extends: 'button' });