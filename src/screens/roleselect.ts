import { Application } from "../application";
import { PlayerToken } from "../playertoken";
import { Role, RoleCategory } from "../role";
import { Screen } from "../screen";

export class RoleSelectScreen extends Screen {

    constructor(callback:Function, categories?:Array<RoleCategory>) {
        super();

        this.overlay.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        // add all townsfolk tokens
        if (!categories || categories.includes(RoleCategory.TOWNSFOLK))
        {
            const townsfolkHeading = document.createElement('div');
            townsfolkHeading.className = "heading";
            townsfolkHeading.textContent = "Townsfolk";
            container.appendChild(townsfolkHeading);

            const townsfolkContainer = document.createElement('div');
            townsfolkContainer.className = "token-container";
            container.appendChild(townsfolkContainer);

            const townsfolkRoles:Array<Role> = [Role.WASHERWOMAN, Role.LIBRARIAN, Role.INVESTIGATOR, Role.CHEF, Role.EMPATH, Role.FORTUNE_TELLER, Role.UNDERTAKER, Role.MONK, Role.RAVENKEEPER, Role.VIRGIN, Role.SLAYER, Role.SOLDIER, Role.MAYOR];
            townsfolkRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                townsfolkContainer.appendChild(tokenWrapper);

                const token:PlayerToken = new PlayerToken().asDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);            
                tokenWrapper.onclick = () => callback(role);
            });
        }

        // add all outsider tokens
        if (!categories || categories.includes(RoleCategory.OUTSIDER))
        {
            const outsiderHeading = document.createElement('div');
            outsiderHeading.className = "heading";
            outsiderHeading.textContent = "Outsiders";
            container.appendChild(outsiderHeading);

            const outsiderContainer = document.createElement('div');
            outsiderContainer.className = "token-container";
            container.appendChild(outsiderContainer);

            const outsiderRoles:Array<Role> = [Role.BUTLER, Role.DRUNK, Role.RECLUSE, Role.SAINT];
            outsiderRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                outsiderContainer.appendChild(tokenWrapper);

                const token:PlayerToken = new PlayerToken().asDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                tokenWrapper.onclick = () => callback(role);
            });
        }

        // add all minion tokens
        if (!categories || categories.includes(RoleCategory.MINION))
        {
            const minionHeading = document.createElement('div');
            minionHeading.className = "heading";
            minionHeading.textContent = "Minions";
            container.appendChild(minionHeading);

            const minionContainer = document.createElement('div');
            minionContainer.className = "token-container";
            container.appendChild(minionContainer);

            const minionRoles:Array<Role> = [Role.POISONER, Role.SPY, Role.SCARLET_WOMAN, Role.BARON];
            minionRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                minionContainer.appendChild(tokenWrapper);

                const token:PlayerToken = new PlayerToken().asDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                tokenWrapper.onclick = () => callback(role);
            });
        }

        // add all demon tokens
        if (!categories || categories.includes(RoleCategory.DEMON))
        {
            const demonHeading = document.createElement('div');
            demonHeading.className = "heading";
            demonHeading.textContent = "Demons";
            container.appendChild(demonHeading);

            const demonContainer = document.createElement('div');
            demonContainer.className = "token-container";
            container.appendChild(demonContainer);
            
            const demonRoles:Array<Role> = [Role.IMP];
            demonRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                demonContainer.appendChild(tokenWrapper);

                const token:PlayerToken = new PlayerToken().asDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                tokenWrapper.onclick = () => callback(role);
            });
        }
    }
}