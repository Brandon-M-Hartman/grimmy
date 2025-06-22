import { Application } from "../application";
import { Screen } from "../screen";
import { Utils } from "../utils";

export class CardsScreen extends Screen {
    container:HTMLDivElement;

    constructor() {
        super();

        this.container = document.createElement('div');
        this.container.classList.add("wrapper");
        this.contents.appendChild(this.container);

        this.makeCardButton("You are", "#f99252");
        this.makeCardButton("This is the Demon", "#cb4d68");
        this.makeCardButton("These are your Minions", "#11adc1");
        this.makeCardButton("These characters are not in play", "#1e8875");
        this.makeCardButton("This character selected you", "#393457");
        this.makeCardButton("This player is", "#f7e476");
        this.makeCardButton("Use your ability?", "#5bb361");
        this.makeCardButton("Make a choice", "#c92464");
        this.makeCardButton("Did you nominate today?", "#6a3771");
        this.makeCardButton("Did you vote today?", "#9b9c82");
    }

    makeCardButton(text:string, color:string):void {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.backgroundColor = color;
        if (Utils.isColorDark(color)) button.style.color = 'white';
        this.container.appendChild(button);

        button.onclick = (e) => {
            e.stopPropagation();
            this.showCard(text, color);
        }
    }

    showCard(text:string, color:string):void {
        const card = document.createElement('div');
        card.className = "card";
        card.textContent = text;
        card.style.backgroundColor = color;
        if (Utils.isColorDark(color)) card.style.color = 'white';
        this.container.appendChild(card);

        card.onclick = () => Application.ui.popScreen();
    }
}