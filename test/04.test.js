import { Flamapy } from "../lib/flamapy.js";
import { test, describe } from "mocha";
import { fileURLToPath } from "url";
import { normalizeString } from "./utils.js";
import path from "path";
import assert from "assert";
import fs from "fs";
import { TYPE_SOLVING } from '../lib/type.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");
const fileConfig = path.resolve(__dirname, "./config.csvconf");
const options = {
    DEBUG: false,
};

describe("PYSAT and BDD Usage")

test("Flamapy operations - Unique features BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.uniqueFeatures();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

// test("Flamapy operations - Conflict Detection PYSAT", async () => {
//     const flamapy = new Flamapy(filePath, options);
//     await flamapy.initialize();
//     const result = await flamapy.conflicDetection();
//     assert.deepEqual(Array.isArray(result), true);
//     assert.deepEqual(result, []);
// });

test("Flamapy operations - Commonality - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    const result = await flamapy.commonality(fileConfigValue,TYPE_SOLVING.PYSAT);    
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual(result, 1.0);
});

test("Flamapy operations - Commonality - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const fileConfigValue = fs.readFileSync(fileConfig, "utf8").replace(/\r\n/g, "\n")
    try {
        const result = await flamapy.commonality(fileConfigValue,TYPE_SOLVING.BDD);   
    } catch (error) {
        assert.deepEqual(error.message.startsWith('This function only supports PYSAT and basic solving techniques.'),true);
    }
});

test("Flamapy operations - Core Features - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.coreFeatures(TYPE_SOLVING.PYSAT);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(normalizeString(result), "P(1): ['Onlineshop']P(2): ['Payment']P(3): ['Product Selection']P(4): ['Catalog']");
});

test("Flamapy operations - Core Features - BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.coreFeatures(TYPE_SOLVING.BDD);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(normalizeString(result), "P(1): ['Onlineshop']P(2): ['Payment']P(3): ['Product Selection']P(4): ['Catalog']");
});

test("Flamapy operations - Dead Features - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.deadFeatures(TYPE_SOLVING.PYSAT);
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - Dead Features - BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.deadFeatures(TYPE_SOLVING.BDD);
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - False Optional Features - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.falseOptionalFeatures(TYPE_SOLVING.PYSAT);
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - False Optional Features - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    try {
        const result = await flamapy.falseOptionalFeatures(TYPE_SOLVING.BDD);
    } catch (error) {
        assert.deepEqual(error.message.startsWith('This function only supports PYSAT and basic solving techniques.'),true);
    }
});

test("Flamapy operations - filterFeatures - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.filterFeatures(fileConfig,TYPE_SOLVING.PYSAT);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - filterFeatures - Incorrect parameter", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    try {
        const result = await flamapy.filterFeatures(fileConfig,TYPE_SOLVING.BDD); 
    } catch (error) {
        assert.deepEqual(error.message.startsWith('This function only supports PYSAT and basic solving techniques.'),true);
    }
});

test("Flamapy operations - satisfiable - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiable(TYPE_SOLVING.PYSAT);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, true);
});

test("Flamapy operations - satisfiable - BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiable(TYPE_SOLVING.BDD);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, true);
});

test("Flamapy operations - satisfiable Configuration - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiableConfiguration(fileConfig,false,TYPE_SOLVING.PYSAT);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - satisfiable Configuration - BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.satisfiableConfiguration(fileConfig,false,TYPE_SOLVING.BDD);
    assert.deepEqual(typeof result, 'boolean');
    assert.deepEqual(result, false);
});

test("Flamapy operations - Configurations - PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurations(TYPE_SOLVING.PYSAT);   
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result.length, 80);
});

test("Flamapy operations - Configurations - BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurations(TYPE_SOLVING.BDD);    
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result.length, 80);
});

test("Flamapy operations - Number Configurations PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurationsNumber(TYPE_SOLVING.PYSAT);
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual(result, 80);
});

test("Flamapy operations - Number Configurations BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurationsNumber(TYPE_SOLVING.BDD);
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual(result, 80);
});

test("Flamapy operations - Configuration Distribution BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.configurationDistribution();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result.length, 15);
});

test("Flamapy operations - Feature Inclusion Probability BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.featureInclusionProbability();
    assert.deepEqual(result instanceof Map, true);    
    assert.deepEqual(normalizeString(result), 'Catalog: 1, Categories: 0.5, Credit Card: 0.5, Debit Card: 0.5, Onlineshop: 1, Orders: 0.5, Payment: 1, Payments: 0.2, Product Selection: 1, Search: 0.4, Security: 0.6, Sort: 0.8, UserManagement: 0.95, Wishlist: 0.5');
});

test("Flamapy operations - Homogeneity BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.homogeneity();
    assert.deepEqual(typeof result, 'number');
    assert.deepEqual((result).toFixed(2), 0.67);
});

test("Flamapy operations - Variability BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.variability();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result.length, 2);
});

test("Flamapy operations - Variant Features BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.variantFeatures();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, ['Debit Card','Credit Card','Categories','Sort','Search','UserManagement','Orders','Security','Payments','Wishlist'] );
});

test("Flamapy operations - Diagnosis PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.diagnosis();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, [ 'No diagnosis found', 'No conflicts found' ] );
});

test("Flamapy operations - Sampling PYSAT", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.sampling();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});

test("Flamapy operations - Sampling BDD", async () => {
    const flamapy = new Flamapy(filePath, options);
    await flamapy.initialize();
    const result = await flamapy.sampling();
    assert.deepEqual(Array.isArray(result), true);
    assert.deepEqual(result, []);
});