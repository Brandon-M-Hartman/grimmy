export class Utils {
    static shuffleArray<T>(array: T[]): T[] {
        const result = [...array]; // copy to avoid mutating original
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    static capitalizeWords(input: string): string {
        return input.replace(/\b\w/g, char => char.toUpperCase());
    }
}