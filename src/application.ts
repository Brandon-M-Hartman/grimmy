//import { RoleSelectScreen } from "./screens/roleselect";
import { TownSquare } from "./townsquare";
import { UI } from "./ui";
import { Viewport } from "./viewport";

export class Application {
    static viewport:Viewport;
    static ui:UI;

    private townSquare:TownSquare;
    
    constructor() {
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

        this.townSquare = new TownSquare();
        board.appendChild(this.townSquare);
        this.townSquare.setupBoard();
        this.townSquare.arrangeTokens();
    }
}