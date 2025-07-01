import { Application } from "./application";
import { Game } from "./game";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { roleData } from "./role";
import { Token } from "./token";

export class TokenDrawer extends HTMLElement {

    static open:boolean = false;

    draggingToken:Token | null = null;
    draggingArea:TokenArea; 
    playerTokenContainer:HTMLElement;
    reminderTokenContainer:HTMLElement;
    playerTokenAreaScroll:number = 0;
    playerTokenAreaVel:number = 0;
    reminderTokenAreaScroll:number = 0;
    reminderTokenAreaVel:number = 0;
    visible:boolean = false;

    constructor() {
        super();

        this.draggingArea = TokenArea.PLAYER;

        const playerTokenArea = document.createElement('div');
        playerTokenArea.className = "token-area";
        playerTokenArea.style.touchAction = 'none';
        this.appendChild(playerTokenArea);

        this.playerTokenContainer = document.createElement('div');
        this.playerTokenContainer.className = "player-tokens";
        playerTokenArea.appendChild(this.playerTokenContainer);

        const reminderTokenArea = document.createElement('div');
        reminderTokenArea.className = "token-area";
        reminderTokenArea.style.touchAction = 'none';
        this.appendChild(reminderTokenArea);

        this.reminderTokenContainer = document.createElement('div');
        this.reminderTokenContainer.className = "reminder-tokens";
        this.reminderTokenContainer.style.touchAction = 'none';
        reminderTokenArea.appendChild(this.reminderTokenContainer);

        this.buildTokens();
    }

    buildTokens():void {
        // Clear existing tokens
        this.playerTokenContainer.innerHTML = '';
        this.reminderTokenContainer.innerHTML = '';

        Game.currentEdition.roles.forEach(role => {
            const tokenWrapper = document.createElement('div');
            tokenWrapper.className = 'token-wrapper';
            this.playerTokenContainer.appendChild(tokenWrapper);

            const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
            token.setRole(role);
            tokenWrapper.appendChild(token);

            this.bindTokenEvents(token);

            for (let i = 0; i < roleData[role].reminders.length; i++) {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                this.reminderTokenContainer.appendChild(tokenWrapper);

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
        hammer.get('pan').set({ threshold: 0, direction: Hammer.DIRECTION_ALL });

        let lastPanX = 0;

        hammer.on('panstart', (e) => {
            lastPanX = e.center.x;
            // Drag token if user is dragging vertically
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 0.75) {
                if (token instanceof PlayerToken) {
                    this.draggingToken = new PlayerToken().makeDisplay(0.5);
                    (this.draggingToken as PlayerToken).setRole(token.getRole());
                } else if (token instanceof ReminderToken) {
                    this.draggingToken = new ReminderToken(token.getRole(), token.getIndex());
                    this.draggingToken.classList.add('display');
                    this.draggingToken.style.scale = '0.5';
                }

                Application.ui.appendChild(this.draggingToken!);
                this.draggingToken!.style.position = 'absolute';
                this.draggingToken!.style.left = `${e.center.x - 128}px`;
                this.draggingToken!.style.top = `${e.center.y - 128}px`;
            } else {
                // Drag to scroll
                this.draggingToken = null;
                this.draggingArea = token instanceof PlayerToken ? TokenArea.PLAYER : TokenArea.REMINDER;
            }
        });

        hammer.on('panmove', (e) => {
            if (!this.draggingToken) {
                const delta = e.center.x - lastPanX;
                if (this.draggingArea == TokenArea.PLAYER) this.playerTokenAreaVel = delta;
                else this.reminderTokenAreaVel = delta;
                lastPanX = e.center.x;
                return;
            }
            
            this.draggingToken.style.position = 'absolute';
            this.draggingToken.style.left = `${e.center.x - 128}px`;
            this.draggingToken.style.top = `${e.center.y - 128}px`;
        });

        hammer.on('panend', (e) => {
            if (!this.draggingToken) return;
            Application.ui.removeChild(this.draggingToken);

            if (e.center.y >= this.getBoundingClientRect().y) return;

            const boardPos = Application.viewport.convertToBoard(e.center);
            this.draggingToken.setPosition(boardPos.x, boardPos.y);
            Application.townSquare.addToken(this.draggingToken);
        });
    }

    update():void {
        this.playerTokenAreaScroll += this.playerTokenAreaVel;
        this.reminderTokenAreaScroll += this.reminderTokenAreaVel;

        const containerWidth = this.getBoundingClientRect().width;
        const ptContentWidth = this.playerTokenContainer.scrollWidth;
        const rtContentWidth = this.reminderTokenContainer.scrollWidth;

        const ptOverflow = Math.max(0, ptContentWidth - containerWidth);
        const rtOverflow = Math.max(0, rtContentWidth - containerWidth);
        const ptMaxScroll = ptOverflow;
        const ptMinScroll = -ptOverflow;
        const rtMaxScroll = rtOverflow;
        const rtMinScroll = -rtOverflow;

        // Clamp scroll positions
        this.playerTokenAreaScroll = Math.max(ptMinScroll, Math.min(ptMaxScroll, this.playerTokenAreaScroll));
        this.reminderTokenAreaScroll = Math.max(rtMinScroll, Math.min(rtMaxScroll, this.reminderTokenAreaScroll));

        this.playerTokenAreaVel *= 0.9;
        this.reminderTokenAreaVel *= 0.9;

        if (Math.abs(this.playerTokenAreaVel) < 0.1) {
            this.playerTokenAreaVel = 0;
        }

        if (Math.abs(this.reminderTokenAreaVel) < 0.1) {
            this.reminderTokenAreaVel = 0;
        }

        this.playerTokenContainer.style.left = `${this.playerTokenAreaScroll}px`;
        this.reminderTokenContainer.style.left = `${this.reminderTokenAreaScroll}px`;

        if (this.visible) requestAnimationFrame(() => this.update());
    }

    toggleVisibility():void {
        this.visible = !this.visible;
        TokenDrawer.open = this.visible;
        if (this.visible) this.classList.add('visible');
        else this.classList.remove('visible');
        Application.townSquare.updateTokenMovable();
        requestAnimationFrame(() => this.update());
    }
}

enum TokenArea {
    PLAYER,
    REMINDER
}