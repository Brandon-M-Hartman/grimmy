import { Application } from './application';
import { Game } from './game';
import { Screen } from './screen';
import { CardsScreen } from './screens/cards';
import { DemonBluffsScreen } from './screens/demonbluffs';
import { MenuScreen } from './screens/menu';
import { NightOrderScreen } from './screens/nightorder';
import { TokenDrawer } from './tokendrawer';

export class UI extends HTMLElement {

    private screens:Array<Screen>;
    private screenContainer:HTMLElement;
    private tokenDrawer:TokenDrawer;
    private menuButton:HTMLElement;
    private nightButton:HTMLElement;
    private bluffsButton:HTMLElement;
    private cardsButton:HTMLElement;
    private recenterButton:HTMLElement;
    private tokensDrawerButton:HTMLElement;

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

        this.tokenDrawer = new TokenDrawer();
        this.appendChild(this.tokenDrawer);

        // Create buttons
        this.menuButton = document.createElement('div');
        this.nightButton = document.createElement('div');
        this.bluffsButton = document.createElement('div');
        this.cardsButton = document.createElement('div');
        this.recenterButton = document.createElement('div');
        this.tokensDrawerButton = document.createElement('div');

        this.addIcons();
        this.hide();
    }

    pushScreen(screen:Screen):void {
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

    popAndPushScreen(screen:Screen):void {
        this.popScreen();
        this.pushScreen(screen);
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

        const bottomCenter:HTMLElement = document.createElement('div');
        bottomCenter.id = "bottom-center-ui";
        bottomCenter.className = "icons";
        this.appendChild(bottomCenter);

        // add icons

        this.menuButton.innerHTML = `<span class="iconify" data-icon="ion:menu" data-width="${iconSize}"></span>`;
        topRight.appendChild(this.menuButton);
        this.menuButton.onclick = () => Application.ui.pushScreen(new MenuScreen());

        this.nightButton.innerHTML = `<span class="iconify" data-icon="tabler:moon-filled" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(this.nightButton);
        this.nightButton.onclick = () => Application.ui.pushScreen(new NightOrderScreen());

        this.bluffsButton.innerHTML = `<span class="iconify" data-icon="bxs:mask" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(this.bluffsButton);
        this.bluffsButton.onclick = () => Application.ui.pushScreen(new DemonBluffsScreen());

        this.cardsButton.innerHTML = `<span class="iconify" data-icon="bxs:card" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(this.cardsButton);
        this.cardsButton.onclick = () => Application.ui.pushScreen(new CardsScreen());

        const deleteArea:HTMLElement = document.createElement('div');
        deleteArea.className = "delete-area";
        bottomCenter.appendChild(deleteArea);

        const deleteIcon:HTMLElement = document.createElement('div');
        deleteIcon.innerHTML = `<span class="iconify" data-icon="tabler:trash" data-width="${iconSize}"></span>`;
        deleteArea.appendChild(deleteIcon);

        const spectateButton:HTMLElement = document.createElement('div');
        spectateButton.innerHTML = `<span class="iconify" data-icon="pepicons-pop:eye" data-width="${iconSize}"></span>`;
        bottomLeft.appendChild(spectateButton);
        spectateButton.onclick = () => {
            Game.toggleSpectateMode();
            spectateButton.firstElementChild?.setAttribute('data-icon', Game.spectateMode ? 'pepicons-pop:eye-closed' : 'pepicons-pop:eye');
            this.updateIconVisibility();
        };

        this.recenterButton.innerHTML = `<span class="iconify" data-icon="material-symbols:recenter-rounded" data-width="${iconSize}"></span>`;
        this.recenterButton.style.display = 'none';
        bottomRight.appendChild(this.recenterButton);
        this.recenterButton.onclick = () => {
            Application.viewport.recenter();
            this.updateIconVisibility();
        }

        this.tokensDrawerButton.innerHTML = `<span class="iconify" data-icon="material-symbols:circle" data-width="${iconSize}"></span>`;
        bottomRight.appendChild(this.tokensDrawerButton);
        this.tokensDrawerButton.onclick = () => this.tokenDrawer.toggleVisibility();

        Application.viewport.onPanned = () => this.updateIconVisibility();

        Application.townSquare.addEventListener("start-dragging-token", () => {
            deleteArea.classList.add('visible');
        });

        Application.townSquare.addEventListener("stop-dragging-token", (e) => {
            deleteArea.classList.remove('visible');
            const screenPos:{ x:number, y:number} = Application.viewport.convertToScreen((<CustomEvent>e).detail.pos);
            if (screenPos.y > window.innerHeight * 0.9 && 
                screenPos.x > window.innerWidth * 0.45 && 
                screenPos.x < window.innerWidth * 0.55)
                Application.townSquare.removeToken((<CustomEvent>e).detail.token);
        });

        Application.townSquare.addEventListener("dragging-token", (e) => {
            const screenPos:{ x:number, y:number} = Application.viewport.convertToScreen((<CustomEvent>e).detail.pos);
            if (screenPos.y > window.innerHeight * 0.9 && 
                screenPos.x > window.innerWidth * 0.45 && 
                screenPos.x < window.innerWidth * 0.55) 
                deleteArea.classList.add('hover');
            else 
                deleteArea.classList.remove('hover');
        });
    }

    private updateIconVisibility():void {
        this.menuButton.style.display = Game.spectateMode ? 'none' : 'flex';
        this.nightButton.style.display = Game.spectateMode ? 'none' : 'flex';
        this.bluffsButton.style.display = Game.spectateMode ? 'none' : 'flex';
        this.cardsButton.style.display = Game.spectateMode ? 'none' : 'flex';
        this.tokensDrawerButton.style.display = Game.spectateMode ? 'none' : 'flex';

        const distToRecenter:number = 0.35;
        this.recenterButton.style.display = Game.spectateMode || Application.viewport.x > window.innerWidth * distToRecenter && 
                                            Application.viewport.x < window.innerWidth * (1.0 - distToRecenter) && 
                                            Application.viewport.y > window.innerHeight * distToRecenter && 
                                            Application.viewport.y < window.innerHeight * (1.0 - distToRecenter) ? 'none' : 'flex';
    }
}