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

    static isColorDark(hex: string): boolean {
        // Remove # if present
        const color = hex.replace('#', '');

        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        // Standard brightness formula (0-255 range)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness < 128; // return true if it's considered dark
    }
}