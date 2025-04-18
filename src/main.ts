import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { TownSquare } from "./townsquare";
import { UI } from "./ui";
import { Screen } from "./screen";

// Define custom elements
customElements.define('player-token', PlayerToken);
customElements.define('reminder-token', ReminderToken);
customElements.define('town-square', TownSquare);
customElements.define('app-ui', UI);
customElements.define('app-screen', Screen);

// Create the application
new Application();
