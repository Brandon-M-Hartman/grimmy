export class Screen extends HTMLElement {
    constructor() {
        super();

        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        this.appendChild(overlay);

        overlay.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });
    }
}