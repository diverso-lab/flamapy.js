import { getFileContent } from "./input-utils.js";
import { setupPyodide, executeFlamapyOperation } from "./python-utils.js";

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

    async atomicSets() {
        return this.runFlamapyMethod("atomic_sets", this.fileContent);
    }

    async averageBranchingFactor() {
        return this.runFlamapyMethod("average_branching_factor", this.fileContent);
    }

    async commonality(fileConfig) {
        return this.runFlamapyMethod("commonality", this.fileContent,[], {'configuration_path':fileConfig});
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
    
    async featureAncestors(featureName) {
        return this.runFlamapyMethod("feature_ancestors", this.fileContent,[featureName]);
    }

    async filterFeatures(fileConfig) {
        return this.runFlamapyMethod("filter", this.fileContent,[],{'configuration_path':fileConfig});
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

    async satisfiableConfiguration(fileConfig, fullConfig = false) {
         if (typeof fullConfig !== 'boolean') {
            throw new TypeError(`ERROR Expected 'fullConfig' to be a boolean, but got ${typeof fullConfig}`);
         }
         return this.runFlamapyMethod("satisfiable_configuration", this.fileContent,[],{'configuration_path':fileConfig,'full_configuration': fullConfig});
    }

    async uniqueFeatures() {
        return 'todo';
    }

    async runFlamapyMethod(operation, fileContent, args=[], kwargs={}) {
        try {
            if (this.options.DEBUG)
                console.log(`Run ${operation} operation`);

            const result = await executeFlamapyOperation(this.pyodide, operation, fileContent, args, kwargs);
            return result;
        } catch (error) {
            console.error("Error running Flamapy method:", error);
        }
    }
}

export { Flamapy };

