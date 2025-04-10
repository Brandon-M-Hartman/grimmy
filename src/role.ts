export enum Role {
    MONK = "monk",
    SLAYER = "slayer",
    CHEF = "chef",
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
}

export type RoleData = Record<Role, RoleInfo>;