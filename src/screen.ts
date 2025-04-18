import { Application } from "./application";

export class Screen extends HTMLElement {

    protected contents:HTMLElement;

    constructor() {
        super();

        this.className = "screen";

        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        this.appendChild(overlay);

        this.contents = document.createElement('div');
        this.contents.className = 'contents';
        this.appendChild(this.contents);

        this.contents.addEventListener('pointerup', () => {
            console.log("pointerup");
            Application.ui.popScreen();
        });
    }
}