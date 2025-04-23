import { Flamapy } from "../lib/flamapy.js";
import { test, describe } from "mocha";
import { fileURLToPath } from "url";
import { normalizeString } from "./utils.js";
import path from "path";
import assert from "assert";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");
const options = {
    DEBUG: false,
};

describe("BDD Usage")

test("Flamapy operations - Unique features", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.uniqueFeatures();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - Configurations", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurations(true);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result.length, 80);
});

test("Flamapy operations - Number Configurations", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurationsNumber(true);
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual(result, 80);
});
