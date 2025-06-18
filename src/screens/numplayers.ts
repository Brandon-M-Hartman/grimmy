import { Application } from "../application";
import { Screen } from "../screen";

export class NumPlayersScreen extends Screen {

    townsfolkCounts: { [key: number]: number } = {
        5: 3,
        6: 3,
        7: 5,
        8: 5,
        9: 5,
        10: 7,
        11: 7,
        12: 7,
        13: 9,
        14: 9,
        15: 9
    };

    outsiderCounts: { [key: number]: number } = {
        5: 0,
        6: 1,
        7: 0,
        8: 1,
        9: 2,
        10: 0,
        11: 1,
        12: 2,
        13: 0,
        14: 1,
        15: 2
    };

    minionCounts: { [key: number]: number } = {
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 2,
        11: 2,
        12: 2,
        13: 3,
        14: 3,
        15: 3
    };


    slider:HTMLInputElement;
    playerCount:HTMLDivElement;
    townsfolkCount:HTMLDivElement;
    outsiderCount:HTMLDivElement;
    minionCount:HTMLDivElement;
    demonCount:HTMLDivElement;

    constructor() {
        super();

        this.overlay.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const heading = document.createElement('h1');
        heading.classList.add("heading");
        heading.textContent = "Select number of players";
        container.appendChild(heading);

        const controls = document.createElement('div');
        controls.className = "controls";
        container.appendChild(controls);

        this.playerCount = document.createElement('div');
        this.playerCount.className = "control";
        controls.appendChild(this.playerCount);

        const sliderContainer = document.createElement('div');
        sliderContainer.className = "control";
        controls.appendChild(sliderContainer);

        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = '5';
        this.slider.max = '20';
        this.slider.value = '8';
        sliderContainer.appendChild(this.slider);
        this.slider.oninput = this.update;

        this.townsfolkCount = document.createElement('div');
        this.townsfolkCount.className = "count";
        container.appendChild(this.townsfolkCount);

        this.outsiderCount = document.createElement('div');
        this.outsiderCount.className = "count";
        container.appendChild(this.outsiderCount);

        this.minionCount = document.createElement('div');
        this.minionCount.className = "count";
        container.appendChild(this.minionCount);

        this.demonCount = document.createElement('div');
        this.demonCount.className = "count";
        container.appendChild(this.demonCount);

        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.className = "button";
        container.appendChild(continueButton);

        this.update();
    }

    update = () => {
        let count:number = Number(this.slider.value);
        let adjustedCount:number = Math.min(count, 15);
        this.playerCount.textContent = String(count);
        this.townsfolkCount.textContent = "Townsfolk: " + this.townsfolkCounts[adjustedCount];
        this.outsiderCount.textContent = "Outsiders: " + this.outsiderCounts[adjustedCount];
        this.minionCount.textContent = "Minions: " + this.minionCounts[adjustedCount];
        this.demonCount.textContent = "Demons: 1";
    }
}