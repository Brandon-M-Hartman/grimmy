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
}

export type RoleData = Record<Role, RoleInfo>;