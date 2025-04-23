import { loadPyodide } from "pyodide";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const MOUNT_DIR = "/mnt";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert a string representation of a Python object to a JavaScript object.
 * @param {*} str - The string representation of the Python object.
 * @returns {*} - The converted JavaScript object.
 */
const convertConfiguration = (str) => {
    const jsonStr = str
        .replace(/^Configuration\(/, '')
        .replace(/\)$/, '')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/'/g, '"');
    return JSON.parse(jsonStr);
};

/**
 * Convert a Python object to a JavaScript object.
 * @param {*} obj - The Python object to convert. 
 * @returns {*} - The converted JavaScript object.
 */
export function pythonToJs(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (typeof obj?.toJs !== 'function') {
        return obj;
    }

    const jsObj = obj.toJs({ dicts: true });
    obj.destroy?.();

    if (!Array.isArray(jsObj)) {
        return jsObj;
    }

    return jsObj.map((subArray) => {
        if (typeof subArray?.__repr__ === 'function') {
            subArray = subArray.__repr__();
            if (subArray.startsWith("Configuration(")) {
                subArray = convertConfiguration(subArray);
            }
        }
        return subArray;
    });
}

/**
 * Load and set up Pyodide.
 * @returns {Promise} - A promise that resolves when Pyodide is loaded and set up.
 */
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

/**
 * Load and run a Python script in Pyodide.
 * @param {*} pyodide - The Pyodide instance.
 * @param {*} scriptPath - The path to the Python script to load.
 * @param {*} functionCall - The function call to execute after loading the script.
 */
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


/**
 * Convert boolean values in an object to 1 or 0.
 * @param {*} value - The value to convert.
 * @returns {*} - The converted value.
 */
function convertBooleans(value) {
    if (typeof value === "boolean")
        return value ? 1 : 0;
    if (Array.isArray(value))
        return value.map(convertBooleans);
    if (value && typeof value === "object")
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convertBooleans(v)]));
    return value;
}

export async function executeFlamapyOperation(pyodide, operation, fileContent, args, kwarg, type=0) {

    args = convertBooleans(args);
    kwarg = convertBooleans(kwarg);

    const result = await pyodide.runPythonAsync(`
            import warnings
            from flamapy.interfaces.python.flamapy_feature_model import FLAMAFeatureModel
            from flamapy.core.discover import DiscoverMetamodels
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
        
            if ${JSON.stringify(type)} != 0:
                dm = DiscoverMetamodels()
                feature_model = dm.use_transformation_t2m("uvlfile.uvl",'fm') 
                bdd_model = dm.use_transformation_m2m(feature_model, "bdd")
                operation = dm.get_operation(bdd_model,${JSON.stringify(operation)})
                operation.execute(bdd_model)
                result = operation.get_result()                 
            else:          
                fm = FLAMAFeatureModel("uvlfile.uvl")
  
                if requires_with_sat(getattr(fm, ${JSON.stringify(operation)})):
                    result = getattr(fm, ${JSON.stringify(operation)})(with_sat=True,*args,**kwarg)
                else:
                    result = getattr(fm, ${JSON.stringify(operation)})(*args,**kwarg)
            result
        `);

    return result;
}