export function normalizeString(str) {
    return str.replace(/P\(\d+\): \[([^\]]+)\]/g, (match, items) => {
        return `P(${match.match(/\d+/)[0]}): [${items.split(', ').sort().join(', ')}]`;
    });
}
