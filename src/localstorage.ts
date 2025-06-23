import { Role } from "./role";

interface StoredData {
    lockPlayerTokens: boolean;
    tokens:Array<string>;
    demonBluffs:Array<Role | null>;
}

export class LocalStorageService {
    private static instance: LocalStorageService;

    private constructor() {}

    public static getInstance(): LocalStorageService {
        if (!LocalStorageService.instance) {
            LocalStorageService.instance = new LocalStorageService();
        }
        return LocalStorageService.instance;
    }

    public setItem<K extends keyof StoredData>(key: K, value: StoredData[K]): void {
        try {
            localStorage.setItem(key as string, JSON.stringify(value));
        } catch (error) {
            console.error(`Error storing item ${key}:`, error);
        }
    }

    public getItem<K extends keyof StoredData>(key: K): StoredData[K] | null {
        try {
            const item = localStorage.getItem(key as string);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error retrieving item ${key}:`, error);
            return null;
        }
    }

    public removeItem<K extends keyof StoredData>(key: K): void {
        localStorage.removeItem(key as string);
    }

    public clear(): void {
        localStorage.clear();
    }
}