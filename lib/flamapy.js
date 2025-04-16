import { getFileContent, isCSVConfigFile } from "./input-utils.js";
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
            const res = await setupPyodide();
            this.pyodide = res;
        }

        if (this.options.DEBUG)
            console.log("🔥 Flamapy run environment is ready.");
    }

    /**
     * 
     * @returns 
     */
    async atomicSets() {
        return this.runFlamapyMethod("atomic_sets", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async averageBranchingFactor() {
        return this.runFlamapyMethod("average_branching_factor", this.fileContent);
    }

    /**
     * 
     * @param {*} fileConfig 
     * @returns 
     */
    async commonality(fileConfig) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        return this.runFlamapyMethod("commonality", this.fileContent, [], { 'configuration_path': fileConfig });
    }

    /**
     * 
     * @returns 
     */
    async configurations() {
        return this.runFlamapyMethod("configurations", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async configurationsNumber() {
        return this.runFlamapyMethod("configurations_number", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async coreFeatures() {
        return this.runFlamapyMethod("core_features", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async countLeafs() {
        return this.runFlamapyMethod("count_leafs", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async deadFeatures() {
        return this.runFlamapyMethod("dead_features", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async estimatedNumberOfConfigurations() {
        return this.runFlamapyMethod("estimated_number_of_configurations", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async falseOptionalFeatures() {
        return this.runFlamapyMethod("false_optional_features", this.fileContent);
    }

    /**
     * 
     * @param {*} featureName 
     * @returns 
     */
    async featureAncestors(featureName) {
        return this.runFlamapyMethod("feature_ancestors", this.fileContent, [featureName]);
    }

    /**
     * 
     * @param {*} fileConfig 
     * @returns 
     */
    async filterFeatures(fileConfig) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        return this.runFlamapyMethod("filter", this.fileContent, [], { 'configuration_path': fileConfig });
    }

    /**
     * 
     * @returns 
     */
    async leafFeatures() {
        return this.runFlamapyMethod("leaf_features", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async maxDepth() {
        return this.runFlamapyMethod("max_depth", this.fileContent);
    }

    /**
     * 
     * @returns 
     */
    async satisfiable() {
        return this.runFlamapyMethod("satisfiable", this.fileContent);
    }

    /**
     * 
     * @param {*} fileConfig 
     * @param {*} fullConfig 
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
     * 
     * @returns 
     */
    async uniqueFeatures() {
        return 'todo';
    }

    /**
     * 
     * @param {*} operation 
     * @param {*} fileContent 
     * @param {*} args 
     * @param {*} kwargs 
     * @returns 
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

