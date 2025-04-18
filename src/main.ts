import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";

// Define custom elements
customElements.define('player-token', PlayerToken);
customElements.define('reminder-token', ReminderToken);

// Create the application
new Application();
