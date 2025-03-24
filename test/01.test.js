import { Flamapy } from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");
const options = {
    DEBUG: false,
};

function normalizeString(str) {
    return str.replace(/P\(\d+\): \[([^\]]+)\]/g, (match, items) => {
        return `P(${match.match(/\d+/)[0]}): [${items.split(', ').sort().join(', ')}]`;
    });
}

test("Flamapy operations - Atomic Sets", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.atomicSets();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): ['Payment', 'Product Selection', 'Onlineshop', 'Catalog']<br>P(2): ['Debit Card']<br>P(3): ['Credit Card']<br>P(4): ['Categories']<br>P(5): ['Sort']<br>P(6): ['Search']<br>P(7): ['UserManagement']<br>P(8): ['Orders']<br>P(9): ['Security']<br>P(10): ['Payments']<br>P(11): ['Wishlist']"));
});
