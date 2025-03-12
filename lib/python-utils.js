import { loadPyodide } from "pyodide";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";


const MOUNT_DIR = "/mnt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupPyodide() {
    const pyodide = await loadPyodide();

    // Mount the current directory to the pyodide virtual filesystem
    // This is needed in order to pyodide to access the python wheel files in the filesystem
    pyodide.FS.mkdirTree(MOUNT_DIR)
    pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: __dirname }, MOUNT_DIR);

    await pyodide.loadPackage("micropip");

    const scriptPath = path.resolve(__dirname, "./py/packages.py");
    await loadAndRunPythonScript(pyodide, scriptPath, "await install_packages()");

    return pyodide;
}


async function loadAndRunPythonScript(pyodide, scriptPath, functionCall) {
    try {
        const pythonScript = readFileSync(scriptPath, "utf-8");
        await pyodide.runPythonAsync(pythonScript);
        if (functionCall) {
            await pyodide.runPythonAsync(functionCall);
        }
    } catch (error) {
        console.error(`Error loading or executing ${scriptPath}:`, error);
    }
}


export async function executeFlamapyOperation(pyodide, operation, fileContent) {
    const result = await pyodide.runPythonAsync(`
            import warnings
            from flamapy.interfaces.python.flamapy_feature_model import FLAMAFeatureModel
            from collections.abc import Iterable
            import inspect

            warnings.filterwarnings("ignore", category=SyntaxWarning)

            def requires_with_sat(method):
                signature = inspect.signature(method)
                return 'with_sat' in signature.parameters

            with open("uvlfile.uvl", "w") as text_file:
                text_file.write(${JSON.stringify(fileContent)});

            fm = FLAMAFeatureModel("uvlfile.uvl")

            if requires_with_sat(getattr(fm, ${JSON.stringify(operation)})):
                result = getattr(fm, ${JSON.stringify(operation)})(with_sat=True)
            else:
                result = getattr(fm, ${JSON.stringify(operation)})()

            if isinstance(result, Iterable):
                result = "<br>".join([f'P({i}): {p}' for i, p in enumerate(result, 1)])

            result
        `);

    return result;
}