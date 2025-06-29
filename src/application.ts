import { Game } from "./game";
import { LocalStorageService } from "./localstorage";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { DemonBluffsScreen } from "./screens/demonbluffs";
import { Token, TokenType } from "./token";
import { TownSquare } from "./townsquare";
import { UI } from "./ui";
import { Viewport } from "./viewport";

export class Application {
    static viewport:Viewport;
    static ui:UI;
    static townSquare:TownSquare;
    
    constructor() {
        Application.townSquare = new TownSquare();
        Application.viewport = new Viewport();
        Application.ui = new UI();

        const board = document.getElementById('board')!;
        const background = document.getElementById('background')!;
        const hammer = new Hammer(background);

        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
        hammer.get('pinch').set({ enable: true });

        hammer.on('panmove', (e) => {
            Application.viewport.pan(e.deltaX, e.deltaY);
        });

        hammer.on('panend', (e) => {
            Application.viewport.endpan(e.deltaX, e.deltaY);
        });

        let pinchStartScale:number = 1.0;
        hammer.on('pinchstart', () => {
            pinchStartScale = Application.viewport.getScale();
        });

        hammer.on('pinch', (e) => {
            const newScale:number = pinchStartScale * e.scale;
            Application.viewport.pinchZoom(newScale, e.center.x, e.center.y);
        });

        onwheel = (e:WheelEvent) => {
            Application.viewport.zoom(e.deltaY * -0.001, e.clientX, e.clientY);
        }

        board.appendChild(Application.townSquare);

        Application.loadFromStorage();
    }

    static loadFromStorage():void {    
        const storage = LocalStorageService.getInstance();
        const lockPlayerTokens = storage.getItem('lockPlayerTokens');
        if (lockPlayerTokens) Game.setPlayerTokenLock(lockPlayerTokens);

        const tokens = storage.getItem('tokens');
        if (tokens) {
            // Convert the stored string array into PlayerToken objects
            const tokenArray:Array<Token> = [];
            tokens.forEach(tokenString => {
                const tokenParsed = JSON.parse(tokenString);
                if (tokenParsed.type == TokenType.PLAYER) 
                    tokenArray.push(PlayerToken.from(tokenParsed));
                else
                    tokenArray.push(ReminderToken.from(tokenParsed));
            });

            // Setup the board with the PlayerTokens
            this.townSquare.tokens = tokenArray;
            this.townSquare.setupBoard();
        }

        const bluffs = storage.getItem('demonBluffs');
        if (bluffs) DemonBluffsScreen.bluffs = bluffs;
    }

    static startNewGame():void {
        this.townSquare.clear();
        Game.setup(() => {
            this.townSquare.setupBoard();
            this.townSquare.arrangeTokens();
            this.townSquare.saveBoardState();
        });
    }
}