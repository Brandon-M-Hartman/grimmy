import { Application } from "../application";
import { Alignment, Role, roleData } from "../role";
import { Screen } from "../screen";
import firstNightJson from '../../data/nightorder_first.json';
import otherNightsJson from '../../data/nightorder_other.json';
import { Utils } from "../utils";

enum Night {
    FIRST,
    OTHER
}

export class NightOrderScreen extends Screen {

    static selectedNight:Night = Night.FIRST;
    static showRelevant:boolean = false;

    firstNightTab:HTMLDivElement;
    otherNightsTab:HTMLDivElement;
    firstNightList:HTMLUListElement;
    otherNightsList:HTMLUListElement;

    constructor() {
        super();

        this.onclick = () => {
            Application.ui.popScreen();
        };

        const container = document.createElement('div');
        container.classList.add("wrapper");
        this.contents.appendChild(container);

        const tabs = document.createElement('div');
        tabs.className = "tabs";
        container.appendChild(tabs);

        this.firstNightTab = document.createElement('div');
        this.firstNightTab.className = "tab";
        this.firstNightTab.textContent = "First Night";
        tabs.appendChild(this.firstNightTab);

        this.firstNightTab.onclick = (e) => {
            e.stopPropagation();
            this.switchTabs(Night.FIRST);
        }

        this.otherNightsTab = document.createElement('div');
        this.otherNightsTab.className = "tab";
        this.otherNightsTab.textContent = "Other Nights";
        tabs.appendChild(this.otherNightsTab);

        this.otherNightsTab.onclick = (e) => {
            e.stopPropagation();
            this.switchTabs(Night.OTHER);
        }

        const relevancyOption = document.createElement('div');
        relevancyOption.className = "relevancy";
        if (Application.townSquare.getPlayerTokens().length == 0) relevancyOption.classList.add('disabled');
        container.appendChild(relevancyOption);
        
        const relevancyCheck = document.createElement('input');
        relevancyCheck.type = "checkbox";
        relevancyCheck.checked = NightOrderScreen.showRelevant;
        relevancyCheck.disabled = Application.townSquare.getPlayerTokens().length == 0;
        relevancyOption.appendChild(relevancyCheck);

        const relevancyLabel = document.createElement('label');
        relevancyLabel.textContent = "Show only relevant roles";
        relevancyOption.appendChild(relevancyLabel);
        
        relevancyOption.onclick = (e) => {
            e.stopPropagation();
            NightOrderScreen.showRelevant = !NightOrderScreen.showRelevant && Application.townSquare.getPlayerTokens().length > 0;
            relevancyCheck.checked = NightOrderScreen.showRelevant;
            this.updateRelevancy();
        }

        this.firstNightList = document.createElement('ul');
        container.appendChild(this.firstNightList);

        this.otherNightsList = document.createElement('ul');
        container.appendChild(this.otherNightsList);
    
        // add tasks to lists
        firstNightTasks.forEach(task => this.addTask(task, this.firstNightList));
        otherNightTasks.forEach(task => this.addTask(task, this.otherNightsList));

        this.switchTabs(NightOrderScreen.selectedNight);
        this.updateRelevancy();
    }

    addTask(task:NightOrderTask, list:HTMLUListElement):void {
        const listItem = document.createElement('li');
        list.appendChild(listItem);

        if (task.type == NightOrderTaskType.ROLE) {
            const icon = document.createElement('img');
            icon.src = 'assets/token/' + task.role + '.webp';
            listItem.appendChild(icon);
            const roleInfo = roleData[task.role as Role];
            listItem.classList.add(roleInfo.alignment == Alignment.EVIL ? 'evil' : 'good');
            listItem.id = task.role!;
        }

        const text = document.createElement('span');
        listItem.appendChild(text);

        if (task.type == NightOrderTaskType.ROLE) {
            const roleInfo = roleData[task.role as Role];
            text.innerHTML = `<b>${Utils.capitalizeWords(roleInfo.name)}</b>` + task.info;
        }
        else {
            text.textContent = task.info;
        }
    }

    switchTabs(night:Night):void {
        NightOrderScreen.selectedNight = night;

        if (NightOrderScreen.selectedNight == Night.FIRST) {
            this.firstNightTab.classList.add('selected');
            this.otherNightsTab.classList.remove('selected');
            this.firstNightList.style.display = 'flex';
            this.otherNightsList.style.display = 'none';
        }
        else {
            this.otherNightsTab.classList.add('selected');
            this.firstNightTab.classList.remove('selected');
            this.otherNightsList.style.display = 'flex';
            this.firstNightList.style.display = 'none';
        }
    }

    updateRelevancy():void {
        // Loop through all the tasks and update visibility based on relevancy
        for (const child of [...this.firstNightList.children, ...this.otherNightsList.children]) {
            const task:HTMLElement = child as HTMLElement;
            if (!task.id || task.id && Application.townSquare.isRoleAlive(task.id as Role) || !NightOrderScreen.showRelevant) task.style.display = 'flex';
            else task.style.display = 'none';
        }
    }
}

type NightOrderTask = {
    type: NightOrderTaskType;
    role: Role | null;
    info: string;
};

enum NightOrderTaskType {
    ROLE = "role",
    SETUP = "setup"
}

type NightOrderTasks = Array<NightOrderTask>;
const firstNightTasks: NightOrderTasks = firstNightJson.map((task) => ({
  ...task,
  type: task.type as NightOrderTaskType,
  role: task.role as Role,
}));
const otherNightTasks: NightOrderTasks = otherNightsJson.map((task) => ({
  ...task,
  type: task.type as NightOrderTaskType,
  role: task.role as Role,
}));