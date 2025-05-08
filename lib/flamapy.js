import { getFileContent, isCSVConfigFile } from "./input-utils.js";
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
            const res = await setupPyodide();
            this.pyodide = res;
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
    async commonality(fileConfig,typeSolving=TYPE_SOLVING.BASIC) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)
        if (typeSolving==TYPE_SOLVING.PYSAT)
            return this.runFlamapyMethod("Commonality", this.fileContent,[],  { 'configuration_path': fileConfig }, typeSolving);
        else if (typeSolving==TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("commonality", this.fileContent, [], { 'configuration_path': fileConfig });
        else
            return 'This function only supports PYSAT and basic solving technique.'
    }

    /**
     * Retrieves a list of all valid configurations in the model.  
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns Array<Object> - List of configurations.
     */
    async configurations(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("Configurations", this.fileContent,[], {}, typeSolving);
        else
            return this.runFlamapyMethod("configurations", this.fileContent);        
    }

    /**
     * Returns the total number of valid configurations.  
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns - The number of valid configurations.
     */
    async configurationsNumber(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("ConfigurationsNumber", this.fileContent,[], {}, typeSolving);
        else
            return this.runFlamapyMethod("configurations_number", this.fileContent);
    }

    /**
     * Returns the list of core features (those present in all configurations).  
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns Array<string> - List of core features.
     */
    async coreFeatures(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("CoreFeatures", this.fileContent,[], {}, typeSolving);
        else
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
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns Array<string> - List of features.
     */
    async deadFeatures(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("DeadFeatures", this.fileContent,[], {}, typeSolving);
        else
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
     * @param {*} typeSolving - Type of solving technique: basic or pysat. 
     * @returns Array<string> - List of features.
     */
    async falseOptionalFeatures(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving==TYPE_SOLVING.PYSAT)
            return this.runFlamapyMethod("FalseOptionalFeatures", this.fileContent,[], {}, typeSolving);
        else if (typeSolving==TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("false_optional_features", this.fileContent);
        else
            return 'This function only supports PYSAT and basic solving technique.'
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
     * @param {*} typeSolving - Type of solving technique: basic or pysat. 
     * @returns Array<Array<string>> - List of list of features.
     */
    async filterFeatures(fileConfig,typeSolving=TYPE_SOLVING.BASIC) {
        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)
        if (typeSolving==TYPE_SOLVING.PYSAT)
            return this.runFlamapyMethod("Filter", this.fileContent,[], { 'configuration_path': fileConfig }, typeSolving);
        else if (typeSolving==TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("filter", this.fileContent, [], { 'configuration_path': fileConfig });
        else
            return 'This function only supports PYSAT and basic solving technique.'
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
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns boolean - True if it satisfiable.
     */
    async satisfiable(typeSolving=TYPE_SOLVING.BASIC) {
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("Satisfiable", this.fileContent,[], {}, typeSolving);
        else
            return this.runFlamapyMethod("satisfiable", this.fileContent);
    }

    /**
     * Checks if there exists at least one valid configuration that satisfies a given set of selected and deselected features.  
     * @param {*} fileConfig - Path to the configuration file or the content of the file.  
     * @param {*} fullConfig - Whether to expect a full configuration or partial.  
     * @param {*} typeSolving - Type of solving technique: basic, pysat and bdd. 
     * @returns 
     */
    async satisfiableConfiguration(fileConfig, fullConfig = false,typeSolving=TYPE_SOLVING.BASIC) {

        if (isCSVConfigFile(fileConfig))
            fileConfig = getFileContent(fileConfig)

        if (typeof fullConfig !== 'boolean') {
            throw new TypeError(`ERROR Expected 'fullConfig' to be a boolean, but got ${typeof fullConfig}`);
        }
        if (typeSolving!=TYPE_SOLVING.BASIC)
            return this.runFlamapyMethod("SatisfiableConfiguration", this.fileContent,[], { 'configuration_path': fileConfig, 'full_configuration': fullConfig }, typeSolving);
        else
            return this.runFlamapyMethod("satisfiable_configuration", this.fileContent, [], { 'configuration_path': fileConfig, 'full_configuration': fullConfig });
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
        return this.runFlamapyMethod("ProductDistribution", this.fileContent,[], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Calculates the probability of each feature being included in a valid configuration.  
     * @returns Array<Object> - A list of probabilities of each feature.
     */
    async featureInclusionProbability() {
        return this.runFlamapyMethod("FeatureInclusionProbability", this.fileContent,[], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Measures the uniformity of feature distributions across all valid configurations. 
     * @returns - The uniformity of all configurations.
     */
    async homogeneity() {
        return this.runFlamapyMethod("Homogeneity", this.fileContent,[], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Measures the variability of a feature model by analyzing the presence and absence of features across all valid configurations.
     * @returns Array<number> - A list of the variability of the feature model.
     */
    async variability() {
        return this.runFlamapyMethod("Variability", this.fileContent,[], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Identifies variant features in the feature model, highlighting features that change across different configurations.
     * @returns Array<string> - List of features.
     */
    async variantFeatures() {
        return this.runFlamapyMethod("VariantFeatures", this.fileContent,[], {}, TYPE_SOLVING.BDD);
    }

    /**
     * Analyzes the feature model to identify and explain inconsistencies or errors, providing insights into potential fixes.
     * @returns - Array<string> - List of diagnosis and conflicts.
     */
    async diagnosis() {
        return this.runFlamapyMethod("Diagnosis", this.fileContent,[], {}, TYPE_SOLVING.PYSATDIAGNOSIS);
    }

    /**
     * Analyzes the feature model to identify and explain inconsistencies or errors, providing insights into potential fixes.
     * @param {*} typeSolving - Type of solving technique: pysat and bdd. 
     * * @returns - 
     */
    async sampling(typeSolving=TYPE_SOLVING.PYSAT) {
        if (typeSolving==TYPE_SOLVING.BASIC)
            return 'This function only supports PYSAT and BDD solving technique.'
        else            
            return this.runFlamapyMethod("Sampling", this.fileContent,[], {}, typeSolving);
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

export { Flamapy };

