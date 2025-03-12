import Flamapy from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";
import { test, expect } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");

test("Flamapy operations - Atomic Sets", async () => {
    const flamapy = new Flamapy(filePath);
    await flamapy.initialize();

    const result = await flamapy.atomicSets();
    console.log("Atomic Sets result: ", result);
    expect(result).toBe(1);
});

