import { Application } from "./application";
import { TroubleBrewing } from "./editions";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { roleData } from "./role";
import { Token } from "./token";

export class TokenDrawer extends HTMLElement {

    draggingToken:Token | null = null;

    constructor() {
        super();

        const playerTokenContainer = document.createElement('div');
        playerTokenContainer.className = "player-tokens";
        this.appendChild(playerTokenContainer);

        const reminderTokenContainer = document.createElement('div');
        reminderTokenContainer.className = "reminder-tokens";
        this.appendChild(reminderTokenContainer);

        TroubleBrewing.forEach(role => {
            const tokenWrapper = document.createElement('div');
            tokenWrapper.className = 'token-wrapper';
            playerTokenContainer.appendChild(tokenWrapper);

            const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
            token.setRole(role);
            tokenWrapper.appendChild(token);

            this.bindTokenEvents(token);

            for (let i = 0; i < roleData[role].reminders.length; i++) {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                reminderTokenContainer.appendChild(tokenWrapper);

                const reminderToken:ReminderToken = new ReminderToken(role, i);
                tokenWrapper.appendChild(reminderToken);
                reminderToken.classList.add('display');
                reminderToken.style.scale = '0.5';
                reminderToken.style.position = 'absolute';

                this.bindTokenEvents(reminderToken);
            }
        });
    }

    bindTokenEvents(token:Token):void {
        const hammer = new Hammer(token);
        hammer.get('pan').set({ threshold: 0 });

        hammer.on('panstart', (e) => {
            if (token instanceof PlayerToken) {
                this.draggingToken = new PlayerToken().makeDisplay(0.5);
                (<PlayerToken>this.draggingToken).setRole((<PlayerToken>token).getRole());
            }
            else {
                this.draggingToken = new ReminderToken((<ReminderToken>token).getRole(), (<ReminderToken>token).getIndex());
                this.draggingToken.classList.add('display');
                this.draggingToken.style.scale = '0.5';
            }

            Application.ui.appendChild(this.draggingToken);

            this.draggingToken.style.position = 'absolute';
            this.draggingToken.style.left = `${e.center.x - 128}px`;
            this.draggingToken.style.top = `${e.center.y - 128}px`;
        });

        hammer.on('panmove', (e) => {
            if (!this.draggingToken) return;
            this.draggingToken.style.position = 'absolute';
            this.draggingToken.style.left = `${e.center.x - 128}px`;
            this.draggingToken.style.top = `${e.center.y - 128}px`;
        });

        hammer.on('panend', (e) => {
            if (!this.draggingToken) return;
            Application.ui.removeChild(this.draggingToken);
            Application.townSquare.addToken(this.draggingToken);

            const boardPos = Application.viewport.convertToBoard(e.center);
            this.draggingToken.style.left = `${boardPos.x}px`;
            this.draggingToken.style.top = `${boardPos.y}px`;
        });
    }
}