import json from '../data/roles.json';

export enum Role {
    MONK = "monk",
    SLAYER = "slayer",
    CHEF = "chef",
    FORTUNE_TELLER = "fortuneteller",
    EMPATH = "empath",
    UNDERTAKER = "undertaker",
    SOLDIER = "soldier",
    INVESTIGATOR = "investigator",
    VIRGIN = "virgin",
    WASHERWOMAN = "washerwoman",
    LIBRARIAN = "librarian",
    RAVENKEEPER = "ravenkeeper",
    MAYOR = "mayor",
    BUTLER = "butler",
    DRUNK = "drunk",
    RECLUSE = "recluse",
    SAINT = "saint",
    IMP = "imp",
    POISONER = "poisoner",
    SPY = "spy",
    BARON = "baron",
    SCARLET_WOMAN = "scarletwoman"
}

export enum RoleCategory {
    TOWNSFOLK,
    OUTSIDER,
    MINION,
    DEMON
}

export interface RoleInfo {
    name: string;
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

export function getAlignmentForRole(role:Role):Alignment {
    switch (role) {
    // GOOD roles
    case Role.MONK:
    case Role.SLAYER:
    case Role.CHEF:
    case Role.FORTUNE_TELLER:
    case Role.EMPATH:
    case Role.UNDERTAKER:
    case Role.SOLDIER:
    case Role.INVESTIGATOR:
    case Role.VIRGIN:
    case Role.WASHERWOMAN:
    case Role.LIBRARIAN:
    case Role.RAVENKEEPER:
    case Role.MAYOR:
    case Role.BUTLER:
    case Role.DRUNK:
    case Role.RECLUSE:
    case Role.SAINT:
      return Alignment.GOOD;

    // EVIL roles
    case Role.IMP:
    case Role.POISONER:
    case Role.SPY:
    case Role.BARON:
    case Role.SCARLET_WOMAN:
      return Alignment.EVIL;

    default:
      throw new Error(`Unknown role: ${role}`);
  }
}