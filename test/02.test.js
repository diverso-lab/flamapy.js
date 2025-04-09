import { Flamapy } from "../lib/flamapy.js";
import { test } from "mocha";
import { fileURLToPath } from "url";
import { normalizeString } from "./utils.js";
import path from "path";
import assert from "assert";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");
const fileConfig = path.resolve(__dirname, "./config.csvconf");
const filePathTxt = path.resolve(__dirname, "./test.txt");
const options = {
    DEBUG: false,
};

test("Flamapy operations - Atomic Sets", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.atomicSets();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): ['Payment', 'Product Selection', 'Onlineshop', 'Catalog']<br>P(2): ['Debit Card']<br>P(3): ['Credit Card']<br>P(4): ['Categories']<br>P(5): ['Sort']<br>P(6): ['Search']<br>P(7): ['UserManagement']<br>P(8): ['Orders']<br>P(9): ['Security']<br>P(10): ['Payments']<br>P(11): ['Wishlist']"));
})


test("Flamapy operations - Average Branching Factor", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.averageBranchingFactor();
    assert.deepEqual(result, 2.6);
});

test("Flamapy operations - Configurations", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurations();
    const value = fs.readFileSync(filePathTxt, "utf8").replace(/\r\n/g, "\n")
    assert.deepEqual(result, value);
});

test("Flamapy operations - Number Configurations", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurationsNumber();
    assert.deepEqual(result, 80);
});

test("Flamapy operations - Core Features", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.coreFeatures();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): Onlineshop<br>P(2): Payment<br>P(3): Product Selection<br>P(4): Catalog"));
});

test("Flamapy operations - Number Leafs", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.countLeafs();
    assert.deepEqual(result, 9);
});

test("Flamapy operations - Dead Features", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.deadFeatures();
    assert.deepEqual(result, '');
});

test("Flamapy operations - Estimated Number Of Configurations", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.estimatedNumberOfConfigurations();
    assert.deepEqual(result, 256);
});

test("Flamapy operations - False Optional Features", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.falseOptionalFeatures();
    assert.deepEqual(result, '');
});

test("Flamapy operations - leafFeatures", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.leafFeatures();
    assert.deepEqual(normalizeString(result), normalizeString("P(1): Debit Card<br>P(2): Credit Card<br>P(3): Categories<br>P(4): Sort<br>P(5): Search<br>P(6): Orders<br>P(7): Security<br>P(8): Payments<br>P(9): Wishlist"));
});

test("Flamapy operations - maxDepth", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.maxDepth();
    assert.deepEqual(result, 3);
});

test("Flamapy operations - satisfiable", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiable();
    assert.deepEqual(result, true);
});

test("Flamapy operations - Commonality", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.commonality(fileConfigValue);
    assert.deepEqual(result, 1.0);
});

test("Flamapy operations - Commonality - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.commonality('');
    assert.strictEqual(result, undefined);
});

test("Flamapy operations - filterFeatures", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.filterFeatures(fileConfigValue);
    assert.deepEqual(result, '');
});

test("Flamapy operations - filterFeatures - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.filterFeatures('');
    assert.strictEqual(result, undefined);
});

test("Flamapy operations - featureAncestors", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.featureAncestors("Security");
    assert.deepEqual(normalizeString(result), normalizeString("P(1): UserManagement<br>P(2): Onlineshop"));
});

test("Flamapy operations - featureAncestors - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.featureAncestors("Sea");
    assert.strictEqual(result, undefined);
});

test("Flamapy operations - satisfiable Configuration", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.satisfiableConfiguration(fileConfigValue);
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - full configuration False", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.satisfiableConfiguration(fileConfigValue, false);
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - full configuration True", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.satisfiableConfiguration(fileConfigValue, true);
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    try {
        await flamapy.satisfiableConfiguration(fileConfigValue, 0);
    } catch (error) {
        assert.deepEqual(error.message.substring(0, 5), 'ERROR');
    }
});

test("Flamapy operations - satisfiable Configuration - Incorrect parameter 2", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    try {
        await flamapy.satisfiableConfiguration(fileConfigValue, '');
    } catch (error) {
        assert.deepEqual(error.message.substring(0, 5), 'ERROR');
    }
});