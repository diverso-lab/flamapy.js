import { loadPyodide } from "pyodide";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const MOUNT_DIR = "/mnt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class Flamapy {

    constructor(filepath, options) {
        this.filePath = filepath;
        this.fileContent = readFileSync(this.filePath, "utf-8");

        this.options = options || {};
        this.pyodide = null;
    }


    async initialize() {

        if (this.options.DEBUG) {
            console.log("🔥 Initializing Flamapy...");
            console.log(`📄 Options: ${this.options}`);
            console.log(`📄 File path: ${this.filePath}`);
            console.log(`📄 File content: ${this.fileContent}`);
        }

        if (!this.pyodide) {
            this.pyodide = await loadPyodide();

            // Mount the current directory to the pyodide virtual filesystem
            // This is needed in order to pyodide to access the python wheel files in the filesystem
            this.pyodide.FS.mkdirTree(MOUNT_DIR)
            this.pyodide.FS.mount(this.pyodide.FS.filesystems.NODEFS, { root: __dirname }, MOUNT_DIR);

            await this.pyodide.loadPackage("micropip");

            const scriptPath = path.resolve(__dirname, "./py/packages.py");
            await this.loadAndRunPythonScript(scriptPath, "await install_packages()");
        }

        if (this.options.DEBUG)
            console.log("🔥 Flamapy run environment is ready.");
    }

    async atomicSets() {
        return this.runFlamapyMethod("atomic_sets", this.fileContent);
    }

    async averageBranchingFactor() {
        return this.runFlamapyMethod("average_branching_factor", this.fileContent);
    }

    async commonality(filepath) {
        return "Operation not supported yet.";
    }

    async configurations() {
        return this.runFlamapyMethod("configurations", this.fileContent);
    }

    async configurationsNumber() {
        return this.runFlamapyMethod("configurations_number", this.fileContent);
    }

    async coreFeatures() {
        return this.runFlamapyMethod("core_features", this.fileContent);
    }

    async countLeafs() {
        return this.runFlamapyMethod("count_leafs", this.fileContent);
    }

    async deadFeatures() {
        return this.runFlamapyMethod("dead_features", this.fileContent);
    }

    async estimatedNumberOfConfigurations() {
        return this.runFlamapyMethod("estimated_number_of_configurations", this.fileContent);
    }

    async falseOptionalFeatures() {
        return this.runFlamapyMethod("false_optional_features", this.fileContent);
    }

    async featureAncestors() {
        return this.runFlamapyMethod("feature_ancestors", this.fileContent);
    }

    async filterFeatures(filepath) {
        return "Operation not supported yet.";
    }

    async leafFeatures() {
        return this.runFlamapyMethod("leaf_features", this.fileContent);
    }

    async maxDepth() {
        return this.runFlamapyMethod("max_depth", this.fileContent);
    }

    async satisfiable() {
        return this.runFlamapyMethod("satisfiable", this.fileContent);
    }

    async satisfiableConfiguration(configPath, fullConfig = false) {
        return "todo";
    }

    async uniqueFeatures() {
        return 'todo';
    }

    async runFlamapyMethod(operation, fileContent) {
        try {
            if (this.options.DEBUG)
                console.log(`Run ${operation} operation for... ${this.filePath}`);

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
            const pythonScript = readFileSync(scriptPath, "utf-8");
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

