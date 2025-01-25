export function truncateString(str: string, match: string): string {
    const parts = str.split(match);
    return parts.length > 1 ? parts[0] : str;
}
