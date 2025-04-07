export type RoleId = "monk" | "slayer" | "chef";

export interface Role {
    name: string;
    description: string;
}

export type RoleData = Record<RoleId, Role>;