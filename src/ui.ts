import { Application } from './application';
import { Screen } from './screen';

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

        this.buildMenu();
        this.hide();
    }

    pushScreen(screen:Screen):void {
        this.screenContainer.appendChild(screen);
        this.screens.push(screen);
        this.show();
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

    private buildMenu():void {
        const iconSize:number = 40;

        const menuButton:HTMLElement = document.createElement('div');
        menuButton.id = "menu-button";
        menuButton.innerHTML = `<span class="iconify" data-icon="ion:menu" data-width="${iconSize}"></span>`;
        this.appendChild(menuButton);

        const menuContainer:HTMLElement = document.createElement('div');
        menuContainer.id = "menu-drawer";
        this.appendChild(menuContainer);

        const setupButton:HTMLElement = document.createElement('div');
        setupButton.className = "menu-button";
        setupButton.innerHTML = `<span class="iconify" data-icon="stash:plus-solid" data-width="${iconSize}"></span>`;
        menuContainer.appendChild(setupButton);

        const bluffsButton:HTMLElement = document.createElement('div');
        bluffsButton.className = "menu-button";
        bluffsButton.innerHTML = `<span class="iconify" data-icon="bxs:mask" data-width="${iconSize}"></span>`;
        menuContainer.appendChild(bluffsButton);

        const cardsButton:HTMLElement = document.createElement('div');
        cardsButton.className = "menu-button";
        cardsButton.innerHTML = `<span class="iconify" data-icon="bxs:card" data-width="${iconSize}"></span>`;
        menuContainer.appendChild(cardsButton);
    }

    // recenterButton:Graphics;

    // constructor() {
    //     super();

    //     this.recenterButton = new Graphics().svg(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="0xffffff" class="size-6">
    //         <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
    //         </svg>
    //      `);
    //     this.recenterButton.rect(0, 0, 25, 25);
    //     this.recenterButton.fill({ color:0x00000000, alpha: 0 });
    //     this.recenterButton.scale = 1.5;
    //     this.recenterButton.eventMode = 'static';
    //     this.recenterButton.cursor = 'pointer';
    //     this.recenterButton.position = new Point(0, 0);
    //     this.recenterButton.visible = false;
    //     this.addChild(this.recenterButton);

    //     this.recenterButton.onpointerdown = () => {
    //         this.emit('recenter');
    //     }

    //     //const t:Text = new Text({ text: "test", style: this.getFontStyle() });
    //     //this.addChild(t);

    //     this.resize();
    // }

    // resize():void {
    //     this.recenterButton.position.x = window.innerWidth - 40;
    //     this.recenterButton.position.y = window.innerHeight - 40;
    // }

    // showRecenterButton(visible:boolean):void {
    //     this.recenterButton.visible = visible;
    // }

    // static async loadAssets():Promise<void> {
    //     // Load UI assets
    //     Assets.addBundle('ui', [
    //         //{ alias: 'icon.recenter', src: 'assets/icons/recenter.svg' },
    //     ]);
    //     await Assets.loadBundle('ui');
    // }

    // getFontStyle():Partial<TextStyle> {
    //     return {
    //         fontFamily: 'Trade Gothic',
    //         fontSize: 64,
    //         fill: 0xffffff,
    //     };
    // }
}