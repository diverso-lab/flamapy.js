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

function convertBooleans(value) {
    if (typeof value === "boolean") 
        return value ? 1 : 0;
    if (Array.isArray(value)) 
        return value.map(convertBooleans);
    if (value && typeof value === "object") 
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convertBooleans(v)]));
    return value;
}

export async function executeFlamapyOperation(pyodide, operation, fileContent, args, kwarg) {

    args = convertBooleans(args);
    kwarg = convertBooleans(kwarg);

    const result = await pyodide.runPythonAsync(`
            import warnings
            from flamapy.interfaces.python.flamapy_feature_model import FLAMAFeatureModel
            from collections.abc import Iterable
            import inspect
            import os
            import json

            warnings.filterwarnings("ignore", category=SyntaxWarning)
            
            def convert_booleans(value):
                if value == 0 or value == 1: 
                    return bool(value)
                if isinstance(value, list):
                    return [convert_booleans(v) for v in value]
                if isinstance(value, dict):
                    return {k: convert_booleans(v) for k, v in value.items()}
                return value

            def conver_configuration_file(kwarg):
                name_config = 'configuration.csvconf'
                file_config = kwarg.get('configuration_path')
                if file_config:
                    with open(name_config, mode='w') as text_file:
                        text_file.write(file_config)
                    kwarg['configuration_path'] = os.path.abspath(name_config)

                return kwarg
            
            args = convert_booleans(${JSON.stringify(args)})
            kwarg = convert_booleans(${JSON.stringify(kwarg)})    
            kwarg = conver_configuration_file(kwarg)

            def requires_with_sat(method):
                signature = inspect.signature(method)
                return 'with_sat' in signature.parameters

            with open("uvlfile.uvl", "w") as text_file:
                text_file.write(${JSON.stringify(fileContent)});

            fm = FLAMAFeatureModel("uvlfile.uvl")
        
            if requires_with_sat(getattr(fm, ${JSON.stringify(operation)})):
                result = getattr(fm, ${JSON.stringify(operation)})(with_sat=True,*args,**kwarg)
            else:
                result = getattr(fm, ${JSON.stringify(operation)})(*args,**kwarg)

            result
        `);

    return result;
}