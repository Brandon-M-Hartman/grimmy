import { Application } from "../application";
import { Game } from "../game";
import { PlayerToken } from "../playertoken";
import { Role, RoleCategory } from "../role";
import { Screen } from "../screen";
import { Utils } from "../utils";

export class RoleSelectScreen extends Screen {

    selectMultiple:boolean;
    counts?:Map<RoleCategory, number>;
    townsfolkHeading:HTMLDivElement;
    outsiderHeading:HTMLDivElement;
    minionHeading:HTMLDivElement;
    demonHeading:HTMLDivElement;
    continueButton:HTMLButtonElement;

    townsfolkTokens:Array<PlayerToken> = [];
    outsiderTokens:Array<PlayerToken> = [];
    minionTokens:Array<PlayerToken> = [];
    demonTokens:Array<PlayerToken> = [];

    selectedTownsfolk:Array<Role> = [];
    selectedOutsiders:Array<Role> = [];
    selectedMinions:Array<Role> = [];
    selectedDemons:Array<Role> = [];

    constructor(callback:(roles:Array<Role>) => void, categories?:Array<RoleCategory>, counts?:Map<RoleCategory, number>, excludeTakenRoles:boolean = true) {
        super();
        this.counts = counts;
        this.selectMultiple = counts != undefined;

        this.contents.onclick = () => {
            if (!counts) Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);
        
        this.continueButton = document.createElement('button');
        this.continueButton.onclick = (e) => {
            e.stopPropagation();
            callback(this.getSelectedRoles());
        }

        if (this.selectMultiple) {
            const title = document.createElement('div');
            title.className = "title";
            container.appendChild(title);

            const h = document.createElement('span');
            h.textContent = "Select roles";
            title.appendChild(h);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = "buttons";
            title.appendChild(buttonsContainer);

            const randomButton = document.createElement('button');
            randomButton.textContent = "Random";
            buttonsContainer.appendChild(randomButton);
            randomButton.onclick = (e) => {
                e.stopPropagation();
                this.randomize();
            }

            this.continueButton.textContent = "Continue";
            buttonsContainer.appendChild(this.continueButton);
        }
            
        this.townsfolkHeading = document.createElement('div');
        this.outsiderHeading = document.createElement('div');
        this.minionHeading = document.createElement('div');
        this.demonHeading = document.createElement('div');

        // add all townsfolk tokens
        if (!categories || categories.includes(RoleCategory.TOWNSFOLK))
        {
            this.townsfolkHeading.className = "heading";
            container.appendChild(this.townsfolkHeading);

            const townsfolkContainer = document.createElement('div');
            townsfolkContainer.className = "token-container";
            container.appendChild(townsfolkContainer);

            const townsfolkRoles:Array<Role> = Game.getRolesByCategory(RoleCategory.TOWNSFOLK);
            townsfolkRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                townsfolkContainer.appendChild(tokenWrapper);

                if (Application.townSquare.isRoleInUse(role) && excludeTakenRoles) tokenWrapper.classList.add('disabled');

                const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                this.townsfolkTokens.push(token);
                if (this.selectMultiple) token.setSelected(false);
                tokenWrapper.onclick = (e) => {
                    e.stopPropagation();
                    if (tokenWrapper.classList.contains('disabled')) return;
                    if (!this.selectMultiple) callback([role]);
                    else if (token.isSelected())
                    {
                        token.setSelected(false);
                        this.selectedTownsfolk.splice(this.selectedTownsfolk.indexOf(token.getRole()!), 1);
                        this.updateSelections();
                    }
                    else if (this.selectedTownsfolk.length < this.counts!.get(RoleCategory.TOWNSFOLK)!) {
                        token.setSelected(true);
                        this.selectedTownsfolk.push(token.getRole()!);
                        this.updateSelections();
                    }
                }
            });
        }

        // add all outsider tokens
        if (!categories || categories.includes(RoleCategory.OUTSIDER))
        {
            this.outsiderHeading.className = "heading";
            container.appendChild(this.outsiderHeading);

            const outsiderContainer = document.createElement('div');
            outsiderContainer.className = "token-container";
            container.appendChild(outsiderContainer);

            const outsiderRoles:Array<Role> = Game.getRolesByCategory(RoleCategory.OUTSIDER);
            outsiderRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                outsiderContainer.appendChild(tokenWrapper);
                
                if (Application.townSquare.isRoleInUse(role) && excludeTakenRoles) tokenWrapper.classList.add('disabled');

                const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                this.outsiderTokens.push(token);
                if (this.selectMultiple) token.classList.add("unselected");          
                tokenWrapper.onclick = (e) => {
                    e.stopPropagation();
                    if (tokenWrapper.classList.contains('disabled')) return;
                    if (!this.selectMultiple) callback([role]);
                    else if (token.isSelected())
                    {
                        token.setSelected(false);
                        this.selectedOutsiders.splice(this.selectedOutsiders.indexOf(token.getRole()!), 1);
                        this.updateSelections();
                    }
                    else if (this.selectedOutsiders.length < this.counts!.get(RoleCategory.OUTSIDER)!) {
                        token.setSelected(true);
                        this.selectedOutsiders.push(token.getRole()!);
                        this.updateSelections();
                    }
                }
            });
        }

        // add all minion tokens
        if (!categories || categories.includes(RoleCategory.MINION))
        {
            this.minionHeading.className = "heading";
            container.appendChild(this.minionHeading);

            const minionContainer = document.createElement('div');
            minionContainer.className = "token-container";
            container.appendChild(minionContainer);

            const minionRoles:Array<Role> = Game.getRolesByCategory(RoleCategory.MINION);
            minionRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                minionContainer.appendChild(tokenWrapper);
                
                if (Application.townSquare.isRoleInUse(role) && excludeTakenRoles) tokenWrapper.classList.add('disabled');

                const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);
                this.minionTokens.push(token);
                if (this.selectMultiple) token.classList.add("unselected");          
                tokenWrapper.onclick = (e) => {
                    e.stopPropagation();
                    if (tokenWrapper.classList.contains('disabled')) return;
                    if (!this.selectMultiple) callback([role]);
                    else if (token.isSelected())
                    {
                        token.setSelected(false);
                        this.selectedMinions.splice(this.selectedMinions.indexOf(token.getRole()!), 1);
                        this.updateSelections();
                        if (role == "baron") this.onBaronSelectionChanged(false);
                    }
                    else if (this.selectedMinions.length < this.counts!.get(RoleCategory.MINION)!) {
                        token.setSelected(true);
                        this.selectedMinions.push(token.getRole()!);
                        this.updateSelections();
                        if (role == "baron") this.onBaronSelectionChanged(true);
                    }
                }
            });
        }

        // add all demon tokens
        if (!categories || categories.includes(RoleCategory.DEMON))
        {
            this.demonHeading.className = "heading";
            container.appendChild(this.demonHeading);

            const demonContainer = document.createElement('div');
            demonContainer.className = "token-container";
            container.appendChild(demonContainer);
            
            const demonRoles:Array<Role> = Game.getRolesByCategory(RoleCategory.DEMON);
            demonRoles.forEach(role => {
                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'token-wrapper';
                demonContainer.appendChild(tokenWrapper);

                if (Application.townSquare.isRoleInUse(role) && excludeTakenRoles) tokenWrapper.classList.add('disabled');

                const token:PlayerToken = new PlayerToken().makeDisplay(0.5);
                token.setRole(role);
                tokenWrapper.appendChild(token);                
                this.demonTokens.push(token);
                if (this.selectMultiple) token.classList.add("unselected");          
                tokenWrapper.onclick = (e) => {
                    e.stopPropagation();
                    if (tokenWrapper.classList.contains('disabled')) return;
                    if (!this.selectMultiple) callback([role]);
                    else if (token.isSelected())
                    {
                        token.setSelected(false);
                        this.selectedDemons.splice(this.selectedDemons.indexOf(token.getRole()!), 1);
                        this.updateSelections();
                    }
                    else if (this.selectedDemons.length < this.counts!.get(RoleCategory.DEMON)!) {
                        token.setSelected(true);
                        this.selectedDemons.push(token.getRole()!);
                        this.updateSelections();
                    }
                }
            });
        }

        this.updateSelections();
    }

    private updateSelections():void {
        this.townsfolkHeading.textContent = "Townsfolk" + (this.counts ? " - " + this.selectedTownsfolk.length + "/" + this.counts.get(RoleCategory.TOWNSFOLK) : "");
        this.outsiderHeading.textContent = "Outsiders" + (this.counts ? " - " + this.selectedOutsiders.length + "/" + this.counts.get(RoleCategory.OUTSIDER) : "");
        this.minionHeading.textContent = "Minions" + (this.counts ? " - " + this.selectedMinions.length + "/" + this.counts.get(RoleCategory.MINION) : "");
        this.demonHeading.textContent = "Demons" + (this.counts ? " - " + this.selectedDemons.length + "/" + this.counts.get(RoleCategory.DEMON) : "");

        const townsfolkCount = this.counts?.get(RoleCategory.TOWNSFOLK) ?? 0;
        const outsiderCount = this.counts?.get(RoleCategory.OUTSIDER) ?? 0;
        const minionCount = this.counts?.get(RoleCategory.MINION) ?? 0;
        const demonCount = this.counts?.get(RoleCategory.DEMON) ?? 0;
        this.continueButton.disabled = this.selectedTownsfolk.length != townsfolkCount || this.selectedOutsiders.length != outsiderCount || this.selectedMinions.length != minionCount || this.selectedDemons.length != demonCount;
        this.continueButton.style.cursor = this.continueButton.disabled ? "default" : "pointer";
    }

    private randomize():void {
        // Function for randomly selecting tokens        
        [...this.townsfolkTokens, ...this.outsiderTokens, ...this.minionTokens, ...this.demonTokens].forEach(token => {
            token.setSelected(false);
        });

        if (this.selectedMinions.includes("baron")) this.onBaronSelectionChanged(false);

        this.selectedTownsfolk = [];
        this.selectedOutsiders = [];
        this.selectedMinions = [];
        this.selectedDemons = [];

        const minionCount = this.counts?.get(RoleCategory.MINION) ?? 0;
        const minionChoices:Array<PlayerToken> = Utils.shuffleArray(this.minionTokens).slice(0, minionCount);
        minionChoices.forEach(token => {
            token.setSelected(true);
            this.selectedMinions.push(token.getRole()!);
        });

        if (this.selectedMinions.includes("baron")) this.onBaronSelectionChanged(true);

        const townsfolkCount = this.counts?.get(RoleCategory.TOWNSFOLK) ?? 0;
        const townsfolkChoices:Array<PlayerToken> = Utils.shuffleArray(this.townsfolkTokens).slice(0, townsfolkCount);
        townsfolkChoices.forEach(token => {
            token.setSelected(true);
            this.selectedTownsfolk.push(token.getRole()!);
        });

        const outsiderCount = this.counts?.get(RoleCategory.OUTSIDER) ?? 0;
        const outsiderChoices:Array<PlayerToken> = Utils.shuffleArray(this.outsiderTokens).slice(0, outsiderCount);
        outsiderChoices.forEach(token => {
            token.setSelected(true);
            this.selectedOutsiders.push(token.getRole()!);
        });

        const demonCount = this.counts?.get(RoleCategory.DEMON) ?? 0;
        const demonChoices:Array<PlayerToken> = Utils.shuffleArray(this.demonTokens).slice(0, demonCount);
        demonChoices.forEach(token => {
            token.setSelected(true);
            this.selectedDemons.push(token.getRole()!);
        });

        this.updateSelections();
    }

    private getSelectedRoles():Array<Role> {
        const roles:Array<Role> = [];
        [...this.townsfolkTokens, ...this.outsiderTokens, ...this.minionTokens, ...this.demonTokens].forEach(token => {
            if (token.isSelected()) roles.push(token.getRole()!);
        });
        return roles;
    }

    private onBaronSelectionChanged(selected:boolean):void {
        if (this.counts) {
            this.counts.set(RoleCategory.OUTSIDER, this.counts.get(RoleCategory.OUTSIDER)! + (selected ? 2 : -2));
            this.counts.set(RoleCategory.TOWNSFOLK, this.counts.get(RoleCategory.TOWNSFOLK)! + (selected ? -2 : 2));
            this.updateSelections();
        }
    }
}