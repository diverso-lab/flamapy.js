import { readFile } from "fs/promises";
import { loadPyodide } from "pyodide";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Flamapy {
    async initialize() {
        console.log("🚀 Initializing Flamapy run environment...");

        if (!this.pyodide) {
            this.pyodide = await loadPyodide();
            let mountdir = "/mnt"
            this.pyodide.FS.mkdirTree(mountdir)
            this.pyodide.FS.mount(this.pyodide.FS.filesystems.NODEFS , {root:'.'}, mountdir)
            await this.pyodide.loadPackage("micropip");
            const scriptPath = path.resolve(__dirname, "./py/packages.py");
            await this.loadAndRunPythonScript(scriptPath, "await install_packages()");
        }
        
        console.log("🔥 Flamapy run environment is ready.");
    }

    async runFlamapyMethod(operation, filePath) {
        try {

            console.log(`Run ${operation} operation for... ${filePath}`);
            const fileContent = await readFile(filePath, "utf-8");
            const result = await this.executeFlamapyOperation(operation, fileContent);
            return result;
            
        } catch (error) {
            console.error("Error running Flamapy method:", error);
        }
    }

    async executeFlamapyOperation(operation, fileContent) {
        const result = await this.pyodide.runPythonAsync(`
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

    async loadAndRunPythonScript(scriptPath, functionCall) {
        try {
            const pythonScript = await readFile(scriptPath, "utf-8");
            await this.pyodide.runPythonAsync(pythonScript);
            if (functionCall) {
                await this.pyodide.runPythonAsync(functionCall);
            }
        } catch (error) {
            console.error(`Error loading or executing ${scriptPath}:`, error);
        }
    }
}

export default Flamapy;

