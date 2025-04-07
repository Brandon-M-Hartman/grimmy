import { Application, Assets, Point } from "pixi.js";
import { TownSquare } from "./townsquare";

(async () => {
	// Create a new application
	const app = new Application();

	// Initialize the application
	await app.init({ 
		backgroundAlpha: 0,
		resizeTo: window, 
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		antialias: true,
	});

	document.getElementById("pixi-container")!.appendChild(app.canvas);
	app.stage.eventMode = 'static';

	// Load fonts
	Assets.addBundle('fonts', [
        { alias: 'IMFell', src: 'assets/fonts/imfell.ttf' },
		{ alias: 'Trade Gothic', src: 'assets/fonts/trade_gothic.otf' },
    ]);
	await Assets.loadBundle('fonts');

	// Create town square
	const townSquare:TownSquare = new TownSquare();
	townSquare.position.set(app.screen.width / 2, app.screen.height / 2);
	townSquare.scale = 1.0;
	app.stage.addChild(townSquare);

	// Global events
	app.stage.addEventListener('pointermove', (e) => {
		if (draggingBoard)
		{
			var deltaX:number = e.x - lastDragPoint.x;
			var deltaY:number = e.y - lastDragPoint.y;
			townSquare.position.x += deltaX;
			townSquare.position.y += deltaY;
			lastDragPoint.set(e.x, e.y);
		}
		else 
			townSquare.onPointerMove(e);
	});

	app.stage.addEventListener('pointerdown', (e) => {
		draggingBoard = true;
		lastDragPoint.set(e.x, e.y);
	});

	app.stage.addEventListener('pointerup', () => {
		draggingBoard = false;
	});

	app.stage.addEventListener('wheel', (e) => {
		boardScale += 0.1 * (e.deltaY < 0 ? 1 : -1);
	});

	let boardScale:number = 0.65;
	let draggingBoard:boolean = false;
	let lastDragPoint:Point = new Point();

	// Listen for animate update
	app.ticker.add(() => {
		// Scale town square
		townSquare.scale.x += (boardScale - townSquare.scale.x) * 0.1;
		townSquare.scale.y += (boardScale - townSquare.scale.y) * 0.1;
	});
})();
