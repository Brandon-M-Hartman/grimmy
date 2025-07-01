import json from '../data/roles.json';

// Role is now just a string type representing the role ID
export type Role = string;

export enum RoleCategory {
    TOWNSFOLK,
    OUTSIDER,
    MINION,
    DEMON
}

export interface RoleInfo {
    name: string;
    alignment: Alignment;
    category: string;
    description: string;
    top: number;
    left: number;
    right: number;
    setup: boolean;
    reminders: Array<string>;
}

export enum Alignment {
    GOOD,
    EVIL
}

export type RoleData = Record<Role, RoleInfo>;
export const roleData:RoleData = json;