import { Application } from "./application";
import { PlayerToken } from "./playertoken";
import { ReminderToken } from "./remindertoken";
import { TownSquare } from "./townsquare";
import { TokenDrawer } from "./tokendrawer";
import { UI } from "./ui";
import { TokenOptionsScreen } from "./screens/tokenoptions";
import { TokenDisplayScreen } from "./screens/tokendisplay";
import { RoleSelectScreen } from "./screens/roleselect";
import { DemonBluffsScreen } from "./screens/demonbluffs";
import { MenuScreen } from "./screens/menu";
import { NumPlayersScreen } from "./screens/numplayers";
import { RoleReviewScreen } from "./screens/rolereview";
import { TokenSelectScreen } from "./screens/tokenselect";
import { NightOrderScreen } from "./screens/nightorder";
import { CardsScreen } from "./screens/cards";
import { RoleReplacementScreen } from "./screens/rolereplacement";

// Define custom elements
customElements.define('player-token', PlayerToken);
customElements.define('reminder-token', ReminderToken);
customElements.define('town-square', TownSquare);
customElements.define('token-drawer', TokenDrawer);
customElements.define('app-ui', UI);
customElements.define('token-options-screen', TokenOptionsScreen);
customElements.define('token-display-screen', TokenDisplayScreen);
customElements.define('role-select-screen', RoleSelectScreen);
customElements.define('demon-bluffs-screen', DemonBluffsScreen);
customElements.define('menu-screen', MenuScreen);
customElements.define('num-players-screen', NumPlayersScreen);
customElements.define('role-review-screen', RoleReviewScreen);
customElements.define('token-select-screen', TokenSelectScreen);
customElements.define('night-order-screen', NightOrderScreen);
customElements.define('cards-screen', CardsScreen);
customElements.define('role-replacement-screen', RoleReplacementScreen);

// Create the application
new Application();