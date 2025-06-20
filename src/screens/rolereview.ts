import { Game } from "../game";
import { PlayerToken } from "../playertoken";
import { Screen } from "../screen";

export class RoleReviewScreen extends Screen {
    constructor(onAddToBoard:Function, onHandOut:Function) {
        super();

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const title = document.createElement('div');
        title.className = "title";
        title.textContent = "Roles selected";
        container.appendChild(title);

        const tokens = document.createElement('div');
        tokens.className = "token-container";
        container.appendChild(tokens);

        Game.roles.forEach(role => {
            const tokenWrapper = document.createElement('div');
            tokenWrapper.className = 'token-wrapper';
            tokens.appendChild(tokenWrapper);

            const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
            token.setRole(role);
            tokenWrapper.appendChild(token);
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = "buttons";
        container.appendChild(buttonsContainer);

        const addToBoardButton = document.createElement('button');
        addToBoardButton.textContent = "Add to board";
        buttonsContainer.appendChild(addToBoardButton);
        addToBoardButton.onclick = () => onAddToBoard();

        const handOutButton = document.createElement('button');
        handOutButton.textContent = "Hand out";
        buttonsContainer.appendChild(handOutButton);
        handOutButton.onclick = () => onHandOut();
    }
}