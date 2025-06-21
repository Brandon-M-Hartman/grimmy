import { Application } from "../application";
import { Role } from "../role";
import { Screen } from "../screen";
import json from '../../data/nightorder_first.json';

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

        const list = document.createElement('ul');
        container.appendChild(list);

        firstNightTasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = task.info;
            listItem.style.whiteSpace = 'pre-line';
            list.appendChild(listItem);
        });
    }
}

type NightOrderTask = {
    type: NightOrderTaskType;
    role: Role | null;
    info: string;
};

enum NightOrderTaskType {
    ROLE = "role",
    OTHER = "other"
}

type NightOrderTasks = Array<NightOrderTask>;
const firstNightTasks: NightOrderTasks = json.map((task) => ({
  ...task,
  type: NightOrderTaskType[task.type as keyof typeof NightOrderTaskType],
  role: Role[task.role as keyof typeof Role],
}));