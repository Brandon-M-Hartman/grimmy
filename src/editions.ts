import { Role } from "./role";

export const TroubleBrewing: Array<Role> = [
  "monk",
  "slayer",
  "chef",
  "fortuneteller",
  "empath",
  "undertaker",
  "soldier",
  "investigator",
  "virgin",
  "washerwoman",
  "librarian",
  "ravenkeeper",
  "mayor",
  "butler",
  "drunk",
  "recluse",
  "saint",
  "imp",
  "poisoner",
  "spy",
  "baron",
  "scarletwoman"
];

export const BadMoonRising: Array<Role> = [
  "grandmother",
  "sailor",
  "chambermaid",
  "exorcist",
  "innkeeper",
  "gambler",
  "gossip",
  "courtier",
  "professor",
  "minstrel",
  "tealady",
  "pacifist",
  "fool",
  "goon",
  "lunatic",
  "tinker",
  "moonchild",
  "godfather",
  "devilsadvocate",
  "assassin",
  "mastermind",
  "zombuul",
  "pukka",
  "shabaloth",
  "po"
];

export const SectsAndViolets: Array<Role> = [
  "clockmaker",
  "dreamer",
  "snakecharmer",
  "mathematician",
  "flowergirl",
  "towncrier",
  "oracle",
  "savant",
  "seamstress",
  "philosopher",
  "artist",
  "juggler",
  "sage",
  "mutant",
  "sweetheart",
  "barber",
  "klutz",
  "eviltwin",
  "witch",
  "cerenovus",
  "pithag",
  "fanggu",
  "vigormortis",
  "nodashii",
  "vortox"
];

export interface Edition {
  id: string;
  name: string;
  roles: Array<Role>;
}

export const EDITIONS: Record<string, Edition> = {
  troubleBrewing: {
    id: "troubleBrewing",
    name: "Trouble Brewing",
    roles: TroubleBrewing
  },
  badMoonRising: {
    id: "badMoonRising",
    name: "Bad Moon Rising",
    roles: BadMoonRising
  },
  sectsAndViolets: {
    id: "sectsAndViolets",
    name: "Sects and Violets",
    roles: SectsAndViolets
  },  
  custom: {
    id: "custom",
    name: "Custom Script",
    roles: []
  }
};

export const DEFAULT_EDITION = EDITIONS.troubleBrewing;

export interface CustomScriptRole {
  id: string;
  name?: string;
  author?: string;
}

export function parseCustomScript(jsonString: string): Array<Role> {
  try {
    const scriptData: Array<CustomScriptRole> = JSON.parse(jsonString);
    const roles: Array<Role> = [];
    
    for (const item of scriptData) {
      // Skip metadata entries
      if (item.id === '_meta') continue;
      
      // Add the role ID directly - it will be validated when used
      roles.push(item.id);
    }
    
    return roles;
  } catch {
    throw new Error('Invalid JSON format for custom script');
  }
}

export function setCustomScript(jsonString: string): void {
  const roles = parseCustomScript(jsonString);
  EDITIONS.custom.roles = roles;
}