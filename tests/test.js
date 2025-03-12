import Flamapy from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const flamapy = new Flamapy();
    await flamapy.initialize(); // Esto solo se hará una vez

    const operation = "configurations_number";

    // resolve the file path relative to the current file
    const filePath = path.resolve(__dirname, "./test.uvl");

    try {
        const result = await flamapy.runFlamapyMethod(operation, filePath);
        console.log(`Result of ${operation} for ${filePath}:`, result);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
