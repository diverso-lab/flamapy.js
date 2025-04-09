import { Flamapy } from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import { test } from "mocha";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    DEBUG: false,
};

test("Flamapy - Incorrect path", async () => {
    const filePathIncorrect = path.resolve(__dirname, "./uvls/test5.uvl");
    const flamapy = new Flamapy(filePathIncorrect, options);
    assert.deepEqual(flamapy.fileContent.slice(-4), '.uvl');
});

test("Flamapy - Correct path", async () => {
    const filePathCorrect = path.resolve(__dirname, "./uvls/test1.uvl");
    assert.strictEqual(path.extname(filePathCorrect), '.uvl');
    assert.strictEqual(path.basename(filePathCorrect), 'test1.uvl');
    const flamapy = new Flamapy(filePathCorrect, options);
    assert.notEqual(flamapy, null);
});