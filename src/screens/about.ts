import { Application } from "../application";
import { Screen } from "../screen";

export class AboutScreen extends Screen {
    constructor() {
        super();

        this.contents.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const aboutContent = document.createElement('div');
        aboutContent.innerText = "Grimmy is a fan-made companion app for Blood on the Clocktower. The app is designed to be used on a tablet or similar touch-device to run live games.";
        container.appendChild(aboutContent);

        const disclaimer = document.createElement('div');
        disclaimer.innerText = "This project is not affiliated with, endorsed by, or associated with The Pandemonium Institute, the creators and publishers of Blood on the Clocktower. Blood on the Clocktower, along with all associated names, artwork, and game mechanics, are trademarks or copyrights of The Pandemonium Institute. All trademarks, service marks, and copyrights used or referenced in this app are the property of their respective owners.";
        container.appendChild(disclaimer);
    }
}