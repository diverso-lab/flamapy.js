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
const fileConfig = path.resolve(__dirname, "./config.csvconf");
const options = {
    DEBUG: false,
};

describe("Multi Parameter Operations")

test("Flamapy operations - Commonality", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.commonality(fileConfigValue);    
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual(result, 1.0);
});

test("Flamapy operations - Commonality - fileConfig", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.commonality(fileConfig);
    assert.deepEqual(typeof result, 'number');
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
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - filterFeatures - fileConfig", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.filterFeatures(fileConfig);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
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
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(normalizeString(result), "P(1): ['UserManagement']P(2): ['Onlineshop']");
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
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - fileConfig", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiableConfiguration(fileConfig);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - full configuration False", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.satisfiableConfiguration(fileConfigValue, false);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - full configuration True", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.satisfiableConfiguration(fileConfigValue, true);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    try {
        await flamapy.satisfiableConfiguration(fileConfigValue, 0);
    } catch (error) {
        assert.deepEqual(error.message.startsWith(`Expected 'fullConfig' to be a boolean`),true);
    }
});

test("Flamapy operations - satisfiable Configuration - Incorrect parameter 2", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    try {
        await flamapy.satisfiableConfiguration(fileConfigValue, '');
    } catch (error) {
        assert.deepEqual(error.message.startsWith(`Expected 'fullConfig' to be a boolean`),true);
    }
});