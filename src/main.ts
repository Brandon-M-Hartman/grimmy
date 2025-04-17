import { Application } from "./application";
import { PlayerToken } from "./playertoken";

// Define custom elements
customElements.define('player-token', PlayerToken);

// Create the application
new Application();
