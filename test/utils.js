export function normalizeString(str) {
    if (Array.isArray(str)) {
        let result = str
            .map((subArray, i) => {
                if (Array.isArray(subArray)) {
                    const values = subArray.map(v => `'${v}'`).sort().join(', ');
                    return `P(${i + 1}): [${values}]`;
                } else if (Object.prototype.toString.call(subArray) === '[object Object]') {
                    let dict = JSON.parse(JSON.stringify(subArray))
                    const sortJsonKeys = input =>
                              JSON.stringify(Object.fromEntries(Object.entries(
                                typeof input === 'string' ? JSON.parse(input) : input
                              ).sort(([a], [b]) => a.localeCompare(b))));
                    return `P(${i + 1}): ['${sortJsonKeys(dict)}']`;
                } else {
                    return `P(${i + 1}): ['${subArray}']`;
                }
            })
            .join(''); 
        return result;
    } 
    if (str instanceof Map) {
        return Array.from(str).map(([k, v]) => `${k}: ${v}`).sort().join(', ');
    }
}
