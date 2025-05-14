import { getFileContent, isCSVConfigFile, suppressConsoleLog } from "./input-utils.js";
import { setupPyodide, executeFlamapyOperation, pythonToJs } from "./python-utils.js";
import { TYPE_SOLVING } from './type.js';

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
     * @param {*} typeSolving - Type of solving technique: basic or pysat. 
     * @returns - A percentage
     */
    async commonality(fileConfig, typeSolving = TYPE_SOLVING.BASIC) {
        if (isCSVConfigFile(fileConfig)) {
            fileConfig = getFileContent(fileConfig);
        }

        const operationName = typeSolving === TYPE_SOLVING.PYSAT ? "Commonality" : "commonality";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT].includes(typeSolving)) {
            throw new TypeError('This function only supports PYSAT and basic solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], { 'configuration_path': fileConfig }, typeSolving);
    }

    /**
     * Retrieves a list of all valid configurations in the model.  
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns Array<Object> - List of configurations.
     */
    async configurations(typeSolving = TYPE_SOLVING.BASIC) {
        const operationName = typeSolving === TYPE_SOLVING.BASIC ? "configurations" : "Configurations";
        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
    }

    /**
     * Returns the total number of valid configurations.  
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic, pysat, or bdd. 
     * @returns {Promise<number>} - The number of valid configurations.
     */
    async configurationsNumber(typeSolving = TYPE_SOLVING.BASIC) {
        const operationName = typeSolving === TYPE_SOLVING.BASIC ? "configurations_number" : "ConfigurationsNumber";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT, TYPE_SOLVING.BDD].includes(typeSolving)) {
            throw new TypeError('This function only supports BASIC, PYSAT, and BDD solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
    }

    /**
     * Returns the list of core features (those present in all configurations).  
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic, pysat, or bdd. 
     * @returns {Promise<Array<string>>} - List of core features.
     */
    async coreFeatures(typeSolving = TYPE_SOLVING.BASIC) {
        const operationName = typeSolving === TYPE_SOLVING.BASIC ? "core_features" : "CoreFeatures";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT, TYPE_SOLVING.BDD].includes(typeSolving)) {
            throw new TypeError('This function only supports BASIC, PYSAT, and BDD solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
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
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic, pysat, or bdd. 
     * @returns {Promise<Array<string>>} - List of features.
     */
    async deadFeatures(typeSolving = TYPE_SOLVING.BASIC) {
        const operationName = typeSolving === TYPE_SOLVING.BASIC ? "dead_features" : "DeadFeatures";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT, TYPE_SOLVING.BDD].includes(typeSolving)) {
            throw new TypeError('This function only supports BASIC, PYSAT, and BDD solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
    }

    /**
     * Estimates the total number of different configurations that can be produced from a feature model.
     * This considers all possible combinations of features.
     * @returns {Promise<number>} - The estimated number of configurations.
     */
    async estimatedNumberOfConfigurations() {
        return this.runFlamapyMethod("estimated_number_of_configurations", this.fileContent);
    }

    /**
     * Identifies optional features that behave like mandatory ones in all configurations.
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - The solving technique to use: 'basic' or 'pysat'.
     * @returns {Promise<Array<string>>} - A list of features that are false optional.
     * @throws {Error} - If the solving technique is not supported.
     */
    async falseOptionalFeatures(typeSolving = TYPE_SOLVING.BASIC) {
        let operationName = null;
        switch (typeSolving) {
            case TYPE_SOLVING.PYSAT:
                operationName = "FalseOptionalFeatures";
                break;
            case TYPE_SOLVING.BASIC:
                operationName = "false_optional_features";
                break;
        }

        if (!operationName) {
            throw new TypeError('This function only supports PYSAT and basic solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
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
     * @param {string} fileConfig - Path to the configuration file or the content of the file.  
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic or pysat. 
     * @returns {Promise<Array<Array<string>>>} - List of list of features.
     */
    async filterFeatures(fileConfig, typeSolving = TYPE_SOLVING.BASIC) {
        if (isCSVConfigFile(fileConfig)) {
            fileConfig = getFileContent(fileConfig);
        }

        const operationName = typeSolving === TYPE_SOLVING.PYSAT ? "Filter" : "filter";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT].includes(typeSolving)) {
            throw new TypeError('This function only supports PYSAT and basic solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], { 'configuration_path': fileConfig }, typeSolving);
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
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic, pysat, or bdd. 
     * @returns {Promise<boolean>} - True if the model is satisfiable.
     */
    async satisfiable(typeSolving = TYPE_SOLVING.BASIC) {
        const operationName = typeSolving === TYPE_SOLVING.BASIC ? "satisfiable" : "Satisfiable";

        if (![TYPE_SOLVING.BASIC, TYPE_SOLVING.PYSAT, TYPE_SOLVING.BDD].includes(typeSolving)) {
            throw new TypeError('This function only supports BASIC, PYSAT, and BDD solving techniques.');
        }

        return this.runFlamapyMethod(operationName, this.fileContent, [], {}, typeSolving);
    }

    /**
     * Checks if there exists at least one valid configuration that satisfies a given set of selected and deselected features.  
     * @param {string} fileConfig - Path to the configuration file or the content of the file.  
     * @param {boolean} [fullConfig=false] - Whether to expect a full configuration or partial.  
     * @param {string} [typeSolving=TYPE_SOLVING.BASIC] - Type of solving technique: basic, pysat, or bdd. 
     * @returns {Promise<boolean>} - True if a satisfiable configuration exists.
     * @throws {TypeError} - If `fullConfig` is not a boolean.
     */
    async satisfiableConfiguration(fileConfig, fullConfig = false, typeSolving = TYPE_SOLVING.BASIC) {
        if (isCSVConfigFile(fileConfig)) {
            fileConfig = getFileContent(fileConfig);
        }

        if (typeof fullConfig !== 'boolean') {
            throw new TypeError(`Expected 'fullConfig' to be a boolean, but got ${typeof fullConfig}`);
        }

        const operationName = typeSolving === TYPE_SOLVING.BASIC
            ? "satisfiable_configuration"
            : "SatisfiableConfiguration";

        return this.runFlamapyMethod(operationName, this.fileContent, [], {
            'configuration_path': fileConfig,
            'full_configuration': fullConfig
        }, typeSolving);
    }

    /**
     * Identifies features that are unique to specific configurations, highlighting features that differentiate configurations.
     * @returns 
     */
    async uniqueFeatures() {
        return this.runFlamapyMethod("UniqueFeatures", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Identifies conflicts within the feature model by detecting combinations of features that cannot coexist due to constraints.
     * @returns Array<Object> - List of configurations.
     */
    async conflicDetection() {
        return null;//this.runFlamapyMethod("PySATConflictDetection", this.fileContent,[], {}, TYPE_SOLVING.PYSATDIAGNOSIS);
    }

    /**
     * Analyzes the distribution of configurations within the feature model, identifying how features are grouped across valid configurations.  
     * @returns Array<Number> - List of distributions.
     */
    async configurationDistribution() {
        return this.runFlamapyMethod("ProductDistribution", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Calculates the probability of each feature being included in a valid configuration.  
     * @returns Array<Object> - A list of probabilities of each feature.
     */
    async featureInclusionProbability() {
        return this.runFlamapyMethod("FeatureInclusionProbability", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Measures the uniformity of feature distributions across all valid configurations. 
     * @returns - The uniformity of all configurations.
     */
    async homogeneity() {
        return this.runFlamapyMethod("Homogeneity", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Measures the variability of a feature model by analyzing the presence and absence of features across all valid configurations.
     * @returns Array<number> - A list of the variability of the feature model.
     */
    async variability() {
        return this.runFlamapyMethod("Variability", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Identifies variant features in the feature model, highlighting features that change across different configurations.
     * @returns Array<string> - List of features.
     */
    async variantFeatures() {
        return this.runFlamapyMethod("VariantFeatures", this.fileContent, [], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Analyzes the feature model to identify and explain inconsistencies or errors, providing insights into potential fixes.
     * @returns - Array<string> - List of diagnosis and conflicts.
     */
    async diagnosis() {
        return this.runFlamapyMethod("Diagnosis", this.fileContent, [], {}, TYPE_SOLVING.PYSATDIAGNOSIS);
    }

    /**
     * Generates a sample of configurations from the feature model using the specified solving technique.
     * @param {string} [typeSolving=TYPE_SOLVING.PYSAT] - The solving technique to use: 'pysat' or 'bdd'.
     * @returns {Promise<Array<Object>>} - A sample of configurations.
     * @throws {Error} - If the solving technique is not supported.
     */
    async sampling(typeSolving = TYPE_SOLVING.PYSAT) {
        if (![TYPE_SOLVING.PYSAT, TYPE_SOLVING.BDD].includes(typeSolving)) {
            throw new TypeError('This function only supports PYSAT and BDD solving techniques.');
        }
        return this.runFlamapyMethod("Sampling", this.fileContent, [], {}, typeSolving);
    }

    /**
     * Executes a specified Flamapy operation within the Pyodide environment.
     * @param {*} operation - Name of the Flamapy operation.
     * @param {*} fileContent - The content of the uvl file.
     * @param {*} args - Positional arguments to pass to the Flamapy method.
     * @param {*} kwargs - Keyword arguments to pass to the Flamapy method.
     * @returns - The result of the Flamapy operation, converted to a JavaScript object.
     */
    async runFlamapyMethod(operation, fileContent, args = [], kwargs = {}, type = TYPE_SOLVING.BASIC) {
        try {
            if (this.options.DEBUG)
                console.log(`Run ${operation} operation`);

            let result = await executeFlamapyOperation(this.pyodide, operation, fileContent, args, kwargs, type);
            return pythonToJs(result);
        } catch (error) {
            console.error("Error running Flamapy method:", error);
        }
    }
}

export { Flamapy};

