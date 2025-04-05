import { Application, Assets } from "pixi.js";
import { Token } from './token';

(async () => {
	// Create a new application
	const app = new Application();

	// Initialize the application
	await app.init({ background: "#1099bb", resizeTo: window });

	// Append the application canvas to the document body
	document.getElementById("pixi-container")!.appendChild(app.canvas);

	// Load fonts
	Assets.addBundle('fonts', [
        { alias: 'IMFell', src: 'assets/fonts/imfell.ttf' },
		{ alias: 'Trade Gothic', src: 'assets/fonts/trade_gothic.otf' },
    ]);
	await Assets.loadBundle('fonts');

	let draggingToken:Token | null = null;	

	app.canvas.addEventListener('pointermove', (e) => {
		if (draggingToken)
		{
			draggingToken.drag(e);
		}
	});

	const token:Token = new Token();
	token.position.set(app.screen.width / 2, app.screen.height / 2);

	token.eventMode = 'static';
	token.cursor = 'pointer';
	token.on('pointerdown', (e) => {
		draggingToken = token;
		draggingToken.pickup(e);
		console.log('picked up token');
	}).on('pointerup', () => {
		draggingToken?.drop();
		draggingToken = null;
		console.log('dropped token');
	});

	// Add the token to the stage
	app.stage.addChild(token);

	// Listen for animate update
	app.ticker.add(() => {
		
	});
})();
