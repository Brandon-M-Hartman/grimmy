import json from '../data/roles.json';

export enum Role {
    MONK = "monk",
    SLAYER = "slayer",
    CHEF = "chef",
    FORTUNE_TELLER = "fortuneteller",
    EMPATH = "empath",
    UNDERTAKER = "undertaker",
    IMP = "imp",
    POISONER = "poisoner",
    SPY = "spy",
    BARON = "baron",
    SCARLET_WOMAN = "scarletwoman"
}

export interface RoleInfo {
    name: string;
    description: string;
    top: number;
    left: number;
    right: number;
    setup: boolean;
    reminders: Array<Object>;
}

export type RoleData = Record<Role, RoleInfo>;
export type ReminderData = { text:string };
export const roleData:RoleData = json;