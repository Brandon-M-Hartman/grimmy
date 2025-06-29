import { Application } from "./application";
import { TroubleBrewing } from "./editions";
import { PlayerToken } from "./playertoken";

export class TokenDrawer extends HTMLElement {

    draggingPlayerToken:PlayerToken | null = null;

    constructor() {
        super();

        const playerTokenContainer = document.createElement('div');
        playerTokenContainer.className = "player-tokens";
        this.appendChild(playerTokenContainer);

        TroubleBrewing.forEach(role => {
            const tokenWrapper = document.createElement('div');
            tokenWrapper.className = 'token-wrapper';
            playerTokenContainer.appendChild(tokenWrapper);

            const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
            token.setRole(role);
            tokenWrapper.appendChild(token);

            const hammer = new Hammer(token);
            hammer.get('pan').set({ threshold: 0 });

            hammer.on('panstart', (e) => {
                this.draggingPlayerToken = new PlayerToken().makeDisplay(0.5);
                (this.draggingPlayerToken as PlayerToken).setRole(role);                
                Application.ui.appendChild(this.draggingPlayerToken);

                this.draggingPlayerToken.style.position = 'absolute';
                this.draggingPlayerToken.style.left = `${e.center.x - 128}px`;
			    this.draggingPlayerToken.style.top = `${e.center.y - 128}px`;
            });

            hammer.on('panmove', (e) => {
                console.log(e);
                if (!this.draggingPlayerToken) return;
                this.draggingPlayerToken.style.position = 'absolute';
                this.draggingPlayerToken.style.left = `${e.center.x - 128}px`;
			    this.draggingPlayerToken.style.top = `${e.center.y - 128}px`;
            });

            hammer.on('panend', (e) => {
                if (!this.draggingPlayerToken) return;
                Application.ui.removeChild(this.draggingPlayerToken);
                Application.townSquare.tokens.push(this.draggingPlayerToken);
                Application.townSquare.addPlayerToken(this.draggingPlayerToken as PlayerToken);

                const boardPos = Application.viewport.convertToBoard(e.center);
                this.draggingPlayerToken.style.left = `${boardPos.x}px`;
			    this.draggingPlayerToken.style.top = `${boardPos.y}px`;
            });
        });
    }
}