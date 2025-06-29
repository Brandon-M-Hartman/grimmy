import { Application } from "../application";
import { Game } from "../game";
import { Screen } from "../screen";

export class MenuScreen extends Screen {
    constructor() {
        super();

        this.contents.onclick = () => {
            Application.ui.popScreen();
        };

        const iconSize:number = 30;

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const buttons = document.createElement('div');
        buttons.className = "buttons-container";
        container.appendChild(buttons);

        const newGameButton = document.createElement('button');
        newGameButton.textContent = "Start new game";
        buttons.appendChild(newGameButton);

        const newGameIcon:HTMLElement = document.createElement('div');
        newGameIcon.innerHTML = `<span class="iconify" data-icon="carbon:new-tab" data-width="${iconSize}"></span>`;
        newGameButton.appendChild(newGameIcon);

        newGameButton.onclick = (e) => {
            e.stopPropagation();
            Application.ui.popScreen();
            Application.startNewGame();
        }

        const lockTokensButton = document.createElement('button');
        lockTokensButton.textContent = Game.lockPlayerTokens ? "Unlock player tokens" : "Lock player tokens";
        buttons.appendChild(lockTokensButton);
        lockTokensButton.onclick = (e) => {
            e.stopPropagation();
            Game.togglePlayerTokenLock();
            Application.ui.popScreen();
        }

        const lockIcon:HTMLElement = document.createElement('div');
        lockIcon.innerHTML = `<span class="iconify" data-icon="material-symbols:${Game.lockPlayerTokens ? 'lock-open' : 'lock'}" data-width="${iconSize}"></span>`;
        lockTokensButton.appendChild(lockIcon);

        const supportButton = document.createElement('button');
        supportButton.textContent = "Support this tool";
        buttons.appendChild(supportButton);
        supportButton.onclick = () => {
            window.open('https://ko-fi.com/miltage', '_blank');
        }

        const supportLogo = document.createElement('img');
        supportLogo.src = "assets/ko-fi.png";
        supportButton.appendChild(supportLogo);
    }
}