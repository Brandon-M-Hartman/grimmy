import { Application } from './application';
import { Screen } from './screen';
import { CardsScreen } from './screens/cards';
import { DemonBluffsScreen } from './screens/demonbluffs';
import { MenuScreen } from './screens/menu';
import { NightOrderScreen } from './screens/nightorder';

export class UI extends HTMLElement {

    private screens:Array<Screen>;
    private screenContainer:HTMLElement;

    constructor() {
        super();

        this.screens = [];

        const app = document.getElementById('app')!;
        app.appendChild(this);

        this.screenContainer = document.createElement('div');
        this.screenContainer.id = "screen-container";
        this.appendChild(this.screenContainer);

        addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });

        this.addIcons();
        this.hide();
    }

    pushScreen(screen: Screen):void {
        this.screenContainer.appendChild(screen);
        this.screens.push(screen);
        this.show();
        screen.style.zIndex = this.screens.length.toString();
    }

    popScreen():void {
        const screen:Screen = this.screens.pop()!;
        this.screenContainer.removeChild(screen);
        if (this.screens.length == 0) this.hide();
    }

    show():void {
        this.screenContainer.classList.remove('hidden');
        Application.viewport.enabled = false;
    }

    hide():void {
        this.screenContainer.classList.add('hidden');
        Application.viewport.enabled = true;
    }

    isScreenVisible():boolean {
        return this.screens.length > 0;
    }

    private addIcons():void {
        const iconSize:number = 40;

        // set up icon containers

        const topLeft:HTMLElement = document.createElement('div');
        topLeft.id = "top-left-ui";
        topLeft.className = "icons";
        this.appendChild(topLeft);

        const topRight:HTMLElement = document.createElement('div');
        topRight.id = "top-right-ui";
        topRight.className = "icons";
        this.appendChild(topRight);

        const bottomLeft:HTMLElement = document.createElement('div');
        bottomLeft.id = "bottom-left-ui";
        bottomLeft.className = "icons";
        this.appendChild(bottomLeft);

        const bottomRight:HTMLElement = document.createElement('div');
        bottomRight.id = "bottom-right-ui";
        bottomRight.className = "icons";
        this.appendChild(bottomRight);

        // add icons

        const menuButton:HTMLElement = document.createElement('div');
        menuButton.innerHTML = `<span class="iconify" data-icon="ion:menu" data-width="${iconSize}"></span>`;
        topRight.appendChild(menuButton);
        menuButton.onclick = () => Application.ui.pushScreen(new MenuScreen());

        const nightButton:HTMLElement = document.createElement('div');
        nightButton.innerHTML = `<span class="iconify" data-icon="tabler:moon-filled" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(nightButton);
        nightButton.onclick = () => Application.ui.pushScreen(new NightOrderScreen());

        const bluffsButton:HTMLElement = document.createElement('div');
        bluffsButton.innerHTML = `<span class="iconify" data-icon="bxs:mask" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(bluffsButton);
        bluffsButton.onclick = () => Application.ui.pushScreen(new DemonBluffsScreen());

        const cardsButton:HTMLElement = document.createElement('div');
        cardsButton.innerHTML = `<span class="iconify" data-icon="bxs:card" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(cardsButton);
        cardsButton.onclick = () => Application.ui.pushScreen(new CardsScreen());

        const recenterButton:HTMLElement = document.createElement('div');
        recenterButton.innerHTML = `<span class="iconify" data-icon="material-symbols:recenter-rounded" data-width="${iconSize}"></span>`;
        bottomRight.appendChild(recenterButton);
    }
}