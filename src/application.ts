import { TownSquare } from "./townsquare";
import { Viewport } from "./viewport";

export class Application {
    static viewport:Viewport;
    
    constructor() {
        Application.viewport = new Viewport();

        const app = document.getElementById('app')!;
        const board = document.getElementById('board')!;
        const hammer = new Hammer(app);

        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
        hammer.get('pinch').set({ enable: true });

        hammer.on('panmove', (e) => {
            if (townSquare.draggingToken) return;
            Application.viewport.pan(e.deltaX, e.deltaY);
        });

        hammer.on('panend', (e) => {
            if (townSquare.draggingToken) return;
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

        const townSquare:TownSquare = new TownSquare();
        board.appendChild(townSquare.container);
        townSquare.setupBoard();
    }
}