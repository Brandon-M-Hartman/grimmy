import { Application } from "../application";
import { Game } from "../game";
import { PlayerToken } from "../playertoken";
import { Role, roleData } from "../role";
import { Screen } from "../screen";
import { Utils } from "../utils";
import { TokenDisplayScreen } from "./tokendisplay";

export class TokenSelectScreen extends Screen {
    roles:Array<Role> = [Role.WASHERWOMAN, Role.SCARLET_WOMAN, Role.IMP, Role.BUTLER, Role.EMPATH, Role.SLAYER];
    tokenBag:Array<PlayerToken> = [];
    selectionMade:boolean = false;

    playerInfo:HTMLDivElement;
    buttons:HTMLDivElement;
    tokens:HTMLDivElement;
    nameButton:HTMLButtonElement;
    nextButton:HTMLButtonElement;
    finishButton:HTMLButtonElement;

    constructor() {
        super();

        // TEMP
        this.roles.forEach(role => {
            const token:PlayerToken = new PlayerToken();
            token.setRole(role);
            Game.tokens.push(token);
        });

        // Shuffle tokens in bag
        this.tokenBag = Utils.shuffleArray(Game.tokens);

        // Create all the elements
        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const title = document.createElement('div');
        title.className = "title";
        title.textContent = "Select a token";
        container.appendChild(title);

        this.tokens = document.createElement('div');
        this.tokens.className = "token-container";
        container.appendChild(this.tokens);

        this.playerInfo = document.createElement('div');
        this.playerInfo.className = "player-info";
        container.appendChild(this.playerInfo);

        this.buttons = document.createElement('div');
        this.buttons.className = "buttons";
        container.appendChild(this.buttons);

        this.nameButton = document.createElement('button');
        this.nameButton.textContent = "Add name";
        this.buttons.appendChild(this.nameButton);

        this.nextButton = document.createElement('button');
        this.nextButton.textContent = "Next";
        this.buttons.appendChild(this.nextButton);

        this.finishButton = document.createElement('button');
        this.finishButton.textContent = "Finish";
        this.buttons.appendChild(this.finishButton);

        this.reset();
    }

    private reset():void {
        // Reset screen so new selection can be made
        this.selectionMade = false;
        while (this.tokens.firstChild) {
            this.tokens.removeChild(this.tokens.firstChild);
        }
        this.playerInfo.textContent = "";
        this.buttons.style.display = 'none';

        this.tokenBag.forEach(token => {
            const tokenWrapper = document.createElement('div');
            tokenWrapper.className = 'token-wrapper';
            this.tokens.appendChild(tokenWrapper);

            token = token.asDisplay(0.5).makeHidden();
            tokenWrapper.appendChild(token);
            tokenWrapper.onclick = () => {
                if (this.selectionMade) return;

                this.selectionMade = true;
                if (token.isHidden()) token.reveal();
                else Application.ui.pushScreen(new TokenDisplayScreen(token));
                this.updatePlayerInfo(token);
                this.buttons.style.display = 'flex';
                this.nextButton.style.display = this.tokenBag.length > 1 ? 'block' : 'none';
                this.finishButton.style.display = this.tokenBag.length == 1 ? 'block' : 'none';

                this.nameButton.onclick = (e) => {
                    e.stopPropagation();
                    const newName:string | null = window.prompt("Enter new name for player:", token.getPlayerName());
                    if (newName) token.setPlayerName(newName);
                    this.updatePlayerInfo(token);
                }

                this.nextButton.onclick = () => {
                    this.tokenBag.splice(this.tokenBag.indexOf(token), 1);
                    this.reset();
                }
            }
        });
    }

    private updatePlayerInfo(token:PlayerToken):void {
        this.playerInfo.textContent = (token.hasPlayerName() ? token.getPlayerName() : "Player") + " has selected " + Utils.capitalizeWords(roleData[token.getRole()!].name);
    }

}