import { Flamapy } from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");
const filePathTxt = path.resolve(__dirname, "./test.txt");
const filePathIncorrect = path.resolve(__dirname, "./uvls/test5.uvl");
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

test("Flamapy operations - Average Branching Factor", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.averageBranchingFactor();
    assert.deepEqual(result,2.6);
});

test("Flamapy operations - Configurations", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.configurations();
    const value = fs.readFileSync(filePathTxt, "utf8").replace(/\r\n/g, "\n")
    assert.deepEqual(result,value);
});

test("Flamapy operations - Number Configurations", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.configurationsNumber();
    assert.deepEqual(result,80);
});

test("Flamapy operations - Core Features", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.coreFeatures();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): Onlineshop<br>P(2): Payment<br>P(3): Product Selection<br>P(4): Catalog"));
});

test("Flamapy operations - Number Leafs", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.countLeafs();
    assert.deepEqual(result,9);
});

test("Flamapy operations - Dead Features", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.deadFeatures();
    assert.deepEqual(result,'');
});

test("Flamapy operations - Estimated Number Of Configurations", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.estimatedNumberOfConfigurations();
    assert.deepEqual(result,256);
});

test("Flamapy operations - False Optional Features", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.falseOptionalFeatures();
    assert.deepEqual(result,'');
});

test("Flamapy operations - leafFeatures", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.leafFeatures();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): Debit Card<br>P(2): Credit Card<br>P(3): Categories<br>P(4): Sort<br>P(5): Search<br>P(6): Orders<br>P(7): Security<br>P(8): Payments<br>P(9): Wishlist"));
});

test("Flamapy operations - maxDepth", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.maxDepth();
    assert.deepEqual(result,3);
});

test("Flamapy operations - satisfiable", async () => {
    const flamapy = new Flamapy(filePath,options);
    await flamapy.initialize();
    const result = await flamapy.satisfiable();
    assert.deepEqual(result,true);
});

test("Flamapy - Incorrect path", async () => {
    const flamapy = new Flamapy(filePathIncorrect,options);
    assert.deepEqual(flamapy.fileContent.slice(-4),'.uvl');
});