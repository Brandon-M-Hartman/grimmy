import { Application } from "../application";
import { Alignment, getAlignmentForRole, Role, roleData } from "../role";
import { Screen } from "../screen";
import json from '../../data/nightorder_first.json';
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

        const list = document.createElement('ul');
        container.appendChild(list);

        firstNightTasks.forEach(task => {
            const listItem = document.createElement('li');
            list.appendChild(listItem);

            console.log(task);

            if (task.type == NightOrderTaskType.ROLE) {
                const icon = document.createElement('img');
                icon.src = 'assets/token/' + task.role + '.webp';
                listItem.appendChild(icon);
                listItem.classList.add(getAlignmentForRole(task.role as Role) == Alignment.EVIL ? 'evil' : 'good');
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
  type: task.type as NightOrderTaskType,
  role: task.role as Role,
}));