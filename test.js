import Flamapy from "./flamapy.js";

(async () => {
    const flamapy = new Flamapy();
    await flamapy.initialize();  // Inicializa Pyodide

    const filePath = "test.uvl"; // Archivo UVL en el sistema
    const operation = "ConfigurationsNumber"; // Nombre de la operación

    try {
        const result = await flamapy.runFlamapyMethod(operation, filePath);
        console.log(`Resultado de ${operation} para ${filePath}:`, result);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
