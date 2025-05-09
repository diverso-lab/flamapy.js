import { getFileContent, isCSVConfigFile, suppressConsoleLog } from "./input-utils.js";
import { setupPyodide, executeFlamapyOperation, pythonToJs } from "./python-utils.js";

class Flamapy {

    constructor(filepath, options) {
        this.fileContent = getFileContent(filepath);
        this.options = options || {};
        this.pyodide = null;
    }

    async initialize() {
        if (this.options.DEBUG) {
            console.log("🔥 Initializing Flamapy...");
            console.log(`📄 Options: ${this.options}`);
            console.log(`📄 File content: ${this.fileContent}`);
        }

        // Set up the pyodide environment
        if (!this.pyodide) {
            if (this.options.DEBUG) {
                console.log("🔥 Setting up Pyodide environment...")
                this.pyodide = await setupPyodide();
            } else {
                this.pyodide = await suppressConsoleLog(setupPyodide)
            }
        }


        if (this.options.DEBUG)
            console.log("🔥 Flamapy run environment is ready.");
    }

    /**
     * Returns the atomic sets of the feature model.  
     * @returns Array<Array<string>> – A list of atomic feature groups  
     */
    async atomicSets() {
        return this.runFlamapyMethod("atomic_sets", this.fileContent);
    }

    /**
     * Computes the average number of child features per parent feature in the feature model.  
     * @returns - The average number of child features per parent feature
     */
    async averageBranchingFactor() {
        return this.runFlamapyMethod("average_branching_factor", this.fileContent);
    }

    /**
     * Calculates the percentage of features common to both the loaded feature model and the model at the specified path.  
     * @param {*} fileConfig - Path to the configuration file or the content of the file.  
     * @returns - A percentage
     */
    async commonality(fileConfig) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        return this.runFlamapyMethod("commonality", this.fileContent, [], { 'configuration_path': fileConfig });
    }

    /**
     * Retrieves a list of all valid configurations in the model.  
     * @returns Array<Object> - List of configurations.
     */
    async configurations() {
        return this.runFlamapyMethod("configurations", this.fileContent);
    }

    /**
     * Returns the total number of valid configurations.  
     * @returns - The number of valid configurations.
     */
    async configurationsNumber() {
        return this.runFlamapyMethod("configurations_number", this.fileContent);
    }

    /**
     * Returns the list of core features (those present in all configurations).  
     * @returns Array<string> - List of core features.
     */
    async coreFeatures() {
        return this.runFlamapyMethod("core_features", this.fileContent);
    }

    /**
     * Returns the number of leaf features in the model.  
     * @returns - The number of leaf features.  
     */
    async countLeafs() {
        return this.runFlamapyMethod("count_leafs", this.fileContent);
    }

    /**
     * Returns the features that are never selected in any configuration.  
     * @returns Array<string> - List of features.
     */
    async deadFeatures() {
        return this.runFlamapyMethod("dead_features", this.fileContent);
    }

    /**
     * Estimates the total number of different configurations that can be produced from a feature model by considering all possible combinations of features.  
     * @returns - The number of configurations.
     */
    async estimatedNumberOfConfigurations() {
        return this.runFlamapyMethod("estimated_number_of_configurations", this.fileContent);
    }

    /**
     * Identifies optional features that behave like mandatory ones in all configurations.  
     * @returns Array<string> - List of features.
     */
    async falseOptionalFeatures() {
        return this.runFlamapyMethod("false_optional_features", this.fileContent);
    }

    /**
     * Identifies all ancestor features of a given feature in the feature model.   
     * @param {*} featureName 
     * @returns Array<string> - List of features.
     */
    async featureAncestors(featureName) {
        return this.runFlamapyMethod("feature_ancestors", this.fileContent, [featureName]);
    }

    /**
     * Filters and returns a subset of features based on specific criteria.  
     * @param {*} fileConfig - Path to the configuration file or the content of the file.  
     * @returns Array<Array<string>> - List of list of features.
     */
    async filterFeatures(fileConfig) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        return this.runFlamapyMethod("filter", this.fileContent, [], { 'configuration_path': fileConfig });
    }

    /**
     * Returns all leaf features in the feature model.  
     * @returns Array<string> - List of features.
     */
    async leafFeatures() {
        return this.runFlamapyMethod("leaf_features", this.fileContent);
    }

    /**
     * Computes the maximum depth of the feature tree.  
     * @returns - The number of maximum depth
     */
    async maxDepth() {
        return this.runFlamapyMethod("max_depth", this.fileContent);
    }

    /**
     * Checks whether a given model is valid according to the constraints defined in the feature model.  
     * @returns boolean - True if it satisfiable.
     */
    async satisfiable() {
        return this.runFlamapyMethod("satisfiable", this.fileContent);
    }

    /**
     * Checks if there exists at least one valid configuration that satisfies a given set of selected and deselected features.  
     * @param {*} fileConfig - Path to the configuration file or the content of the file.  
     * @param {*} fullConfig - Whether to expect a full configuration or partial.  
     * @returns 
     */
    async satisfiableConfiguration(fileConfig, fullConfig = false) {

        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        if (typeof fullConfig !== 'boolean') {
            throw new TypeError(`ERROR Expected 'fullConfig' to be a boolean, but got ${typeof fullConfig}`);
        }
        return this.runFlamapyMethod("satisfiable_configuration", this.fileContent, [], { 'configuration_path': fileConfig, 'full_configuration': fullConfig });
    }

    /**
     * Identifies features that are unique to specific configurations, highlighting features that differentiate configurations.
     * @returns 
     */
    async uniqueFeatures() {
        return 'todo';
    }

    /**
     * Executes a specified Flamapy operation within the Pyodide environment.
     * @param {*} operation - Name of the Flamapy operation.
     * @param {*} fileContent - The content of the uvl file.
     * @param {*} args - Positional arguments to pass to the Flamapy method.
     * @param {*} kwargs - Keyword arguments to pass to the Flamapy method.
     * @returns - The result of the Flamapy operation, converted to a JavaScript object.
     */
    async runFlamapyMethod(operation, fileContent, args = [], kwargs = {}) {
        try {
            if (this.options.DEBUG)
                console.log(`Run ${operation} operation`);

            let result = await executeFlamapyOperation(this.pyodide, operation, fileContent, args, kwargs);
            return pythonToJs(result);
        } catch (error) {
            console.error("Error running Flamapy method:", error);
        }
    }
}

export { Flamapy };

