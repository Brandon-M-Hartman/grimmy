import { Application, Assets } from "pixi.js";
import { Viewport } from "pixi-viewport";
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
	
	// create viewport
	const viewport = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		worldWidth: 1000,
		worldHeight: 1000,
		stopPropagation: true,
		disableOnContextMenu: true,
		events: app.renderer.events,
	});
	viewport.drag({ wheel: false }).pinch().decelerate().clampZoom({ minScale: 0.3, maxScale: 1.0 });
	app.stage.addChild(viewport);

	// Create town square
	const townSquare:TownSquare = new TownSquare(viewport);
	townSquare.position.set(app.screen.width/2, app.screen.height/2);
	townSquare.on('tokendragstart', () => {
		viewport.drag({ wheel: false });
	});
	viewport.addChild(townSquare);

	// Global events
	app.stage.addEventListener('globalpointermove', (e) => {
		townSquare.onPointerMove(e);
	});

	app.canvas.addEventListener('pointerdown', () => {
		//
	});

	app.canvas.addEventListener('pointerup', () => {
		// 
	});

	app.canvas.addEventListener('wheel', (e) => {
		targetBoardScale += 0.1 * (e.deltaY < 0 ? 1 : -1);
		targetBoardScale = Math.max(Math.min(targetBoardScale, 1.0), 0.3);
	});

	viewport.on('pinch-start', () => {
		pinchZooming = true;
		townSquare.disableInteraction();
	});
	viewport.on('pinch-end', () => {
		townSquare.enableInteractions();
	});

	let boardScale:number = 1.0;
	let targetBoardScale:number = 0.6;
	let pinchZooming:boolean = false;

	// Listen for animate update
	app.ticker.add(() => {
		// Scale board
		if (!pinchZooming) {
			boardScale += (targetBoardScale - boardScale) * 0.1;
			viewport.setZoom(boardScale, true);
		}
		// Scale the board background
		document.getElementById("app")!.style.backgroundPositionX = viewport.position.x.toString() + 'px';
		document.getElementById("app")!.style.backgroundPositionY = viewport.position.y.toString() + 'px';
		document.getElementById("app")!.style.backgroundSize = (viewport.scale.x * 40).toString() + '%';
	});
})();
