import Flamapy from "./flamapy.js";

(async () => {
    const flamapy = new Flamapy();
    await flamapy.initialize(); // Esto solo se hará una vez

    const filePath = "test.uvl";
    const operation = "configurations_number";

    try {
        const result = await flamapy.runFlamapyMethod(operation, filePath);
        console.log(`Result of ${operation} for ${filePath}:`, result);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
