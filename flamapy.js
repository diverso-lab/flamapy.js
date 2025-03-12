import fs from "fs/promises";

export default class Flamapy {
    constructor() {
        this.pyodide = null;
    }

    async initialize() {
        if (!this.pyodide) {
            console.log("Cargando Pyodide...");
            const pyodideModule = await import("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs");
            this.pyodide = await pyodideModule.loadPyodide();
            console.log("Pyodide cargado.");
            await this.pyodide.loadPackage("micropip");
            await this.pyodide.runPythonAsync(`
                import micropip
                await micropip.install("flamapy")  # Asegura que Flamapy esté disponible
            `);
        }
    }

    async runFlamapyMethod(operation, filePath) {
        if (!this.pyodide) {
            throw new Error("Flamapy no ha sido inicializado. Llama a initialize() primero.");
        }

        // Leer el archivo UVL desde el sistema de archivos
        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, "utf-8");
        } catch (error) {
            throw new Error(`Error al leer el archivo ${filePath}: ${error.message}`);
        }

        // Código Python para ejecutar cualquier operación de Flamapy
        const pythonCode = `
            from flamapy.metamodels.uvl.transformations import UVLReader
            from flamapy.metamodels.fm_metamodel.operations import *

            def run_flamapy_method(file_content, operation_name):
                model = UVLReader(file_content).transform()

                try:
                    # Buscar la operación dinámicamente
                    operation_class = globals().get(operation_name)

                    if operation_class is None:
                        return f"Error: La operación '{operation_name}' no existe en Flamapy."

                    # Instanciar y ejecutar la operación
                    op = operation_class()
                    op.execute(model)

                    return op.get_result()
                except Exception as e:
                    return f"Error ejecutando '{operation_name}': {str(e)}"

            run_flamapy_method("""${fileContent}""", "${operation}")
        `;

        return await this.pyodide.runPythonAsync(pythonCode);
    }
}
