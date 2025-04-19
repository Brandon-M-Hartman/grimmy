export class Screen extends HTMLElement {

    protected contents:HTMLElement;
    protected overlay:HTMLElement;

    constructor() {
        super();

        this.className = "screen";

        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        this.appendChild(this.overlay);

        this.contents = document.createElement('div');
        this.contents.className = 'contents';
        this.appendChild(this.contents);
    }
}