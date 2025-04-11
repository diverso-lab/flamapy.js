export function normalizeString(str) {
    str = convertString(str);
    return str.replace(/P\(\d+\): \[([^\]]+)\]/g, (match, items) => {
        return `P(${match.match(/\d+/)[0]}): [${items.split(', ').sort().join(', ')}]`;
    });
}

function convertString(str) {
    if (Array.isArray(str)) {
        let result = str
            .map((subArray, i) => {
                if (Array.isArray(subArray)) {
                    const values = subArray.map(v => `'${v}'`).join(', ');
                    return `P(${i + 1}): [${values}]`;
                } else {
                    return `P(${i + 1}): ['${subArray}']`;
                }
            })
            .join(''); 
        return result;
    } 
}