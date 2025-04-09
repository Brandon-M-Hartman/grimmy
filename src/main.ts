import { Application, Assets, Point } from "pixi.js";
import { TownSquare } from "./townsquare";
import "hammerjs";

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
	townSquare.on('tokendragstart', () => {
		draggingBoard = false;
	});
	app.stage.addChild(townSquare);

	// Global events
	app.stage.addEventListener('globalpointermove', (e) => {
		townSquare.onPointerMove(e);
	});

	app.canvas.addEventListener('pointerdown', () => {
		lastDragPoint.set(townSquare.position.x, townSquare.position.y);
		draggingBoard = true;
	});

	app.canvas.addEventListener('pointerup', () => {
		draggingBoard = false;
	});

	app.canvas.addEventListener('wheel', (e) => {
		boardScale += 0.1 * (e.deltaY < 0 ? 1 : -1);
		boardScale = Math.max(Math.min(boardScale, 1.0), 0.2);
	});

	let boardScale:number = 0.6;
	let draggingBoard:boolean = false;
	const lastDragPoint:Point = new Point();

	// Listen for animate update
	app.ticker.add(() => {
		// Scale town square
		townSquare.scale.x += (boardScale - townSquare.scale.x) * 0.1;
		townSquare.scale.y += (boardScale - townSquare.scale.y) * 0.1;
		// Scale the rest of the board
		document.getElementById("app")!.style.backgroundPositionX = townSquare.position.x.toString() + 'px';
		document.getElementById("app")!.style.backgroundPositionY = townSquare.position.y.toString() + 'px';
		document.getElementById("app")!.style.backgroundSize = (townSquare.scale.x * 40).toString() + '%';
	});

	var hammertime = new Hammer(app.canvas);
	hammertime.get('pinch').set({ enable: true });
	hammertime.get('press').set({ enable: true });
	
	let lastScale:number = boardScale;
	hammertime.on('pinchstart', () => {
		// do nothing right now
	});
	hammertime.on('pinch', (e) => {
		boardScale = lastScale * e.scale;
		boardScale = Math.max(Math.min(boardScale, 1.0), 0.2);
	});
	hammertime.on('pinchend', () => {
		lastScale = boardScale;
	});
	hammertime.on('panmove', (e) => {
		if (draggingBoard) {
			townSquare.position.x = lastDragPoint.x + e.deltaX;
			townSquare.position.y = lastDragPoint.y + e.deltaY;
		}
	});
})();
