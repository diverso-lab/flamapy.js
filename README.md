# Flamapy.js

<div style="display:flex; margin-bottom: 20px;">
  <img src="https://img.shields.io/npm/v/@lbdudc/flamapy.js?&style=flat-square" alt="npm version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?&style=flat-square" alt="License: MIT">
</div>

Flamapy.js is a JavaScript package designed to bring Flamapy functionalities into a WebAssembly (WASM) environment using Pyodide. It allows developers to work with feature models, variability analysis, and other Flamapy modules directly in JavaScript applications.

## Features

Run Flamapy in a WASM environment without requiring a Python backend.

Supports multiple Flamapy plugins, such as FlamaPy-SAT, FlamaPy-BDD, and FlamaPy-FM.

Works seamlessly with Pyodide for efficient execution of Python-based variability models.

## Installation

Flamapy.js is distributed as an NPM package. You can install it using:

```bash
npm install @lbdudc/flamapy.js
```

## Usage

### Basic Usage

```javascript
import { Flamapy } from '@lbdudc/flamapy.js';

// OPTIONAL: Set the options for Flamapy
const options = {
    DEBUG: false,
};
const filePath = 'path/to/feature-model.uvl';

// Create a new instance of Flamapy
const flamapy = new Flamapy(filePath, options);

// Constructor also admits the plain UVL string
// const textUVL = `
//     feature A
//         feature B
//             feature C
//         feature D
//     feature E
// `;
// const flamapy = new Flamapy(textUVL, options);

await flamapy.initialize();

try {
    // Execute a Flamapy operation
    const operation = 'atomicSets';
    const result = await flamapy.atomicSets();
    console.log(`Result of ${operation} for ${filePath}:`, result);

} catch (error) {
    console.error("Error:", error.message);
}
```

The operations supported are the same as Flamapy:
<https://docs.flamapy.org/tool/command_line_interface#supported-operations>

The current operations supported are:

```javascript
    atomicSets();
    averageBranchingFactor();
    commonality("path_to_compare");
    configurations();
    configurationsNumber();
    conflictDetection();
    coreFeatures();
    countLeafs();
    deadFeatures();
    estimatedNumberOfConfigurations();
    falseOptionalFeatures();
    featureAncestors();
    filterFeatures();
    leafFeatures();
    maxDepth();
    satisfiable();
    satisfiableConfiguration(path, boolean);
    uniqueFeatures();
```

atomicSets(): Description: Returns the atomic sets of the feature model.  
Parameters: None  
Returns: `Array<Array<string>>` – A list of atomic feature groups  

averageBranchingFactor(): Computes the average number of child features per parent feature in the feature model.  
Parameters: None  
Returns: Number  

commonality(pathToCompare): Calculates the percentage of features common to both the loaded feature model and the model at the specified path.  
Parameters: pathToCompare – Path to configuration file  
Returns: Number   

configurations(): Retrieves a list of all valid configurations in the model.  
Parameters: None  
Returns: `Array<Object>`

configurationsNumber(): Returns the total number of valid configurations.  
Parameters: None  
Returns: Number

conflictDetection(): todo  

coreFeatures(): Returns the list of core features (those present in all configurations).  
Parameters: None  
Returns: `Array<string>`

countLeafs(): Returns the number of leaf features in the model.  
Parameters: None  
Returns: Number

deadFeatures(): Returns the features that are never selected in any configuration.  
Parameters: None  
Returns: `Array<string>`

estimatedNumberOfConfigurations(): Estimates the total number of different configurations that can be produced from a feature model by considering all possible combinations of features.  
Parameters: None  
Returns: Number

falseOptionalFeatures(): Identifies optional features that behave like mandatory ones in all configurations.  
Parameters: None  
Returns: `Array<string>`

featureAncestors(featureName):  Identifies all ancestor features of a given feature in the feature model.   
Parameters: featureName: string - Given feature  
Returns: `Array<string>`

filterFeatures(path): Filters and returns a subset of features based on specific criteria.  
Parameters: path: string – Path to the configuration file or the content of the file.  
Returns: `Array<Array<string>>`

leafFeatures(): Returns all leaf features in the feature model.  
Parameters: None  
Returns: `Array<string>`

maxDepth(): Computes the maximum depth of the feature tree.  
Parameters: None  
Returns: Number

satisfiable(): Checks whether a given model is valid according to the constraints defined in the feature model.  
Parameters: None  
Returns: Boolean

satisfiableConfiguration(path, fullConfig): Checks if there exists at least one valid configuration that satisfies a given set of selected and deselected features.  
Parameters: path: string – Path to the configuration file or the content of the file.  
            fullConfig: boolean – Whether to expect a full configuration or partial.  
Returns: Boolean  

uniqueFeatures(): Identifies features that are unique to specific configurations, highlighting features that differentiate configurations.
Parameters: None  
Returns: `Array<string>`

## Contributing

If you want to contribute to Flamapy.js, please follow these steps:

- Fork the repository.
- Create a new branch for your feature.
- Submit a pull request with a detailed description of your changes.

## License

Flamapy.js is released under the MIT License.

## Contact

For support or inquiries, open an issue on the GitHub repository or contact the development team.
