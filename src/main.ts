import "hammerjs";
import gsap from 'gsap';

(async () => {

	let view = {scale: 1.0, targetScale: 0.6, x: 0, y: 0, targetX: 0, targetY: 0};

	// Get a reference to an element.
	var app = document.getElementById('app')!;
	var board = document.getElementById('board')!;

	// Set transform origin to top-left so scaling doesn't move the board visually
	board.style.transformOrigin = "top left";

	const updateTransform = () => {
		board.style.transform = `scale(${view.scale})`;
		board.style.left = `${view.x}px`;
		board.style.top = `${view.y}px`;

		// Match background to "logical" board position, scaled
		app.style.backgroundPosition = `${view.x}px ${view.y}px`;
		app.style.backgroundSize = `${view.scale * 50}%`;
	};
	updateTransform();

	gsap.killTweensOf(view);
	gsap.to(view, { scale: view.targetScale, duration: 0.3, ease: "power2.out", onUpdate:updateTransform });

	// Create an instance of Hammer with the reference.
	var hammer = new Hammer(app!);

	// Subscribe to a quick start event: press, tap, or doubletap.
	// For a full list of quick start events, read the documentation.
	hammer.on('press', (e) => {
		//e.target.classList.toggle('expand');
		console.log("You're pressing me!");
		console.log(e);
	});

	hammer.on('tap', (_e) => {
		console.log("Tapped!");
	});

	hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
	hammer.get('press').set({ time: 0 });
	hammer.get('pinch').set({ enable: true });

	hammer.on('panmove', (e) => {
		gsap.killTweensOf(view);
		const newX = view.x + e.deltaX;
		const newY = view.y + e.deltaY;

		board.style.left = `${newX}px`;
		board.style.top = `${newY}px`;
		app.style.backgroundPosition = `${newX}px ${newY}px`;
	});

	hammer.on('panend', (e) => {
		view.x += e.deltaX;
		view.y += e.deltaY;
		view.targetX = view.x;
		view.targetY = view.y;
	});

	hammer.on('pinch', (_e) => {
		//boardScale = Math.max(0.2, Math.min(e.scale, 1.0));
		//updateTransform();
	});

	onwheel = (e:WheelEvent) => {
		e.preventDefault();

		const rect = app.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const prevScale = view.targetScale;
		view.targetScale += e.deltaY * -0.001;
		view.targetScale = Math.min(Math.max(0.2, view.targetScale), 1.0);

		// Calculate scale delta
		const scaleFactor = view.targetScale / prevScale;

		// Adjust boardX and boardY so the zoom focuses on the cursor
		view.targetX = mouseX - (mouseX - view.targetX) * scaleFactor;
		view.targetY = mouseY - (mouseY - view.targetY) * scaleFactor;

		gsap.killTweensOf(view);
		gsap.to(view, { scale: view.targetScale, duration: 0.5, ease: "power2.out", onUpdate:updateTransform });
		gsap.to(view, { x: view.targetX, duration: 0.5, ease: "power2.out", onUpdate:updateTransform });
		gsap.to(view, { y: view.targetY, duration: 0.5, ease: "power2.out", onUpdate:updateTransform });

		//updateTransform();
	}

	// Create a new application
	//const app = new Application();

	// TextureSource.defaultOptions.autoGenerateMipmaps = true;

	// // Initialize the application
	// await app.init({ 
	// 	backgroundAlpha: 0,
	// 	resizeTo: window, 
	// 	resolution: window.devicePixelRatio || 1,
	// 	autoDensity: true,
	// 	antialias: false,
	// });

	// document.getElementById("pixi-container")!.appendChild(app.canvas);
	// app.stage.eventMode = 'static';

	// // Load fonts
	// Assets.addBundle('fonts', [
    //     { alias: 'IMFell', src: 'assets/fonts/imfell.ttf' },
	// 	{ alias: 'Trade Gothic', src: 'assets/fonts/trade_gothic.otf' },
    // ]);
	// await Assets.loadBundle('fonts');
	
	// // create viewport
	// const viewport = new Viewport({
	// 	screenWidth: window.innerWidth,
	// 	screenHeight: window.innerHeight,
	// 	worldWidth: 1000,
	// 	worldHeight: 1000,
	// 	stopPropagation: true,
	// 	disableOnContextMenu: true,
	// 	events: app.renderer.events,
	// });
	// viewport.drag({ wheel: false }).wheel({ smooth: 10 }).pinch().decelerate().clampZoom({ minScale: 0.1, maxScale: 1.0 });
	// app.stage.addChild(viewport);

	// // Load UI
	// await UI.loadAssets();
	// const ui = new UI();
	// app.stage.addChild(ui);

	// ui.on('recenter', () => recenter());

	// // load the board assets
	// await AssetLoader.loadAssets();

	// // Create town square
	// const townSquare:TownSquare = new TownSquare(viewport);
	// townSquare.on('focused', () => {
	// 	viewport.drag({ wheel: false, pressDrag: false });
	// });
	// townSquare.on('focuslost', () => {
	// 	viewport.drag({ wheel: false, pressDrag: true });
	// });
	// viewport.addChild(townSquare);
	// viewport.moveCenter(0, 0);

	// // Global events
	// app.stage.addEventListener('globalpointermove', (e) => {
	// 	townSquare.onPointerMove(e);
	// });

	// app.canvas.addEventListener('pointerdown', () => {
	// 	//
	// });

	// app.canvas.addEventListener('pointerup', () => {
	// 	// 
	// });

	// app.canvas.addEventListener('wheel', (e) => {
	// 	targetBoardScale += 0.1 * (e.deltaY < 0 ? 1 : -1);
	// 	targetBoardScale = Math.max(Math.min(targetBoardScale, 1.0), 0.3);
	// });

	// viewport.on('pinch-start', () => {
	// 	pinchZooming = true;
	// 	townSquare.disable();
	// });
	// viewport.on('pinch-end', () => {
	// 	townSquare.enable();
	// });
	// viewport.on('drag-end', () => {
	// 	updateRecenterButton();
	// });

	// let boardScale:number = 1.0;
	// let targetBoardScale:number = 0.6;
	// let pinchZooming:boolean = false;

	// // Listen for animate update
	// app.ticker.add(() => {
	// 	// Scale board
	// 	if (!pinchZooming) {
	// 		boardScale += (targetBoardScale - boardScale) * 0.1;
	// 		//viewport.setZoom(boardScale, true);
	// 	}
	// 	// Scale the board background
	// 	document.getElementById("app")!.style.backgroundPositionX = viewport.position.x.toString() + 'px';
	// 	document.getElementById("app")!.style.backgroundPositionY = viewport.position.y.toString() + 'px';
	// 	document.getElementById("app")!.style.backgroundSize = (viewport.scale.x * 650).toString() + 'px';
	// });

	// // Listen for screen resize
	// window.addEventListener('resize', () => {
	// 	ui.resize();
	// 	viewport.resize(window.innerWidth, window.innerHeight, 1000, 1000);
	// 	updateRecenterButton();
	// });

	// const recenter = () => {
	// 	const townCenter:Point = townSquare.getTownCenter();
	// 	viewport.moveCenter(townCenter.x, townCenter.y);
	// 	if (window.innerWidth > window.innerHeight) 
	// 		viewport.fitHeight(townSquare.height * 1.2);
	// 	else
	// 		viewport.fitWidth(townSquare.width * 1.2);
	// 	updateRecenterButton();
	// };
	// const updateRecenterButton = () => {
	// 	const dist:boolean = Math.abs(viewport.center.x - townSquare.getTownCenter().x) > window.innerWidth/2 || Math.abs(viewport.center.y - townSquare.getTownCenter().y) > window.innerHeight/2;
	// 	ui.showRecenterButton(dist);
	// }
	// recenter();
})();
