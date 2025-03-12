import Flamapy from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./uvls/test.uvl");

test("Flamapy operations - Atomic Sets", async () => {
    const flamapy = new Flamapy();
    await flamapy.initialize(filePath);

    const result = await flamapy.atomicSets();
    expect(result).toBe(1);
});

