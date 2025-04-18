import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { TownSquare } from "./townsquare";
import { UI } from "./ui";
import { TokenOptionsScreen } from "./screens/tokenoptions";

// Define custom elements
customElements.define('player-token', PlayerToken);
customElements.define('reminder-token', ReminderToken);
customElements.define('town-square', TownSquare);
customElements.define('app-ui', UI);
customElements.define('token-options-screen', TokenOptionsScreen);

// Create the application
new Application();
