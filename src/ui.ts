import { Assets, Container, Graphics, Point, TextStyle } from "pixi.js";

export class UI extends Container {

    recenterButton:Graphics;

    constructor() {
        super();

        this.recenterButton = new Graphics().svg(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="0xffffff" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
            </svg>
         `);
        this.recenterButton.rect(0, 0, 25, 25);
        this.recenterButton.fill({ color:0x00000000, alpha: 0 });
        this.recenterButton.scale = 1.5;
        this.recenterButton.eventMode = 'static';
        this.recenterButton.cursor = 'pointer';
        this.recenterButton.position = new Point(0, 0);
        this.recenterButton.visible = false;
        this.addChild(this.recenterButton);

        this.recenterButton.onpointerdown = () => {
            this.emit('recenter');
        }

        //const t:Text = new Text({ text: "test", style: this.getFontStyle() });
        //this.addChild(t);

        this.resize();
    }

    resize():void {
        this.recenterButton.position.x = window.innerWidth - 40;
        this.recenterButton.position.y = window.innerHeight - 40;
    }

    showRecenterButton(visible:boolean):void {
        this.recenterButton.visible = visible;
    }

    static async loadAssets():Promise<void> {
        // Load UI assets
        Assets.addBundle('ui', [
            //{ alias: 'icon.recenter', src: 'assets/icons/recenter.svg' },
        ]);
        await Assets.loadBundle('ui');
    }

    getFontStyle():Partial<TextStyle> {
        return {
            fontFamily: 'Trade Gothic',
            fontSize: 64,
            fill: 0xffffff,
        };
    }
}