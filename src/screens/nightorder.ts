import { Application } from "../application";
import { Alignment, Role, roleData } from "../role";
import { Screen } from "../screen";
import firstNightJson from '../../data/nightorder_first.json';
import otherNightsJson from '../../data/nightorder_other.json';
import { Utils } from "../utils";

export class NightOrderScreen extends Screen {

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

        const firstNightList = document.createElement('ul');
        container.appendChild(firstNightList);

        firstNightTasks.forEach(task => this.addTask(task, firstNightList));

        const otherNightsList = document.createElement('ul');
        container.appendChild(otherNightsList);

        otherNightTasks.forEach(task => this.addTask(task, otherNightsList));
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