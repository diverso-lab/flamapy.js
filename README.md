# Flamapy.js

<div style="display:flex; margin-bottom: 20px;">
  <img src="https://img.shields.io/npm/v/@lbdudc/flamapy.js?&style=flat-square" alt="npm version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?&style=flat-square" alt="License: MIT">
</div>

Flamapy.js is a JavaScript package designed to bring Flamapy functionalities into a WebAssembly (WASM) environment using Pyodide. It allows developers to work with feature models, variability analysis, and other Flamapy modules directly in JavaScript applications.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
   - [Basic Usage](#basic-usage)
   - [Supported Operations](#supported-operations)
4. [Contributing](#contributing)
5. [License](#license)
6. [Contact](#contact)

---

## Features

- Run Flamapy in a WASM environment without requiring a Python backend.
- Supports multiple Flamapy plugins, such as FlamaPy-SAT, FlamaPy-BDD, and FlamaPy-FM.
- Works seamlessly with Pyodide for efficient execution of Python-based variability models.

---

## Installation

Flamapy.js is distributed as an NPM package. You can install it using:

```bash
npm install @lbdudc/flamapy.js
```

---

## Usage

### Basic Usage

```javascript
import { Flamapy } from '@lbdudc/flamapy.js';
import { TYPE_SOLVING } from '@lbdudc/flamapy.js/lib/type.js';

// OPTIONAL: Set the options for Flamapy
const options = {
    DEBUG: false,
};
const filePath = 'path/to/feature-model.uvl';

// Create a new instance of Flamapy
const flamapy = new Flamapy(filePath, options);

await flamapy.initialize();

try {
    // Execute a Flamapy operation
    const result = await flamapy.atomicSets();
    console.log('Atomic Sets:', result);

} catch (error) {
    console.error('Error:', error.message);
}

//For advanced solving types
try {
    // Execute a Flamapy operation  
    const result = await flamapy.coreFeatures(TYPE_SOLVING.PYSAT);
    console.log('Core Features:', result);

} catch (error) {
    console.error('Error:', error.message);
}

```

---

## Supported Operations

Below is a detailed list of supported operations, including their descriptions, inputs, and outputs:

| **Method**                     | **Description**                                                                                     | **Inputs**                                                                                                                                                                                                 | **Outputs**                                   |
|--------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| **Constructor**                | Creates a new instance of the `Flamapy` class.                                                     | `filepathOrText` (string): Path to a feature model file or plain text in UVL format.<br>`options` (object, optional): Configuration options (e.g., `{ DEBUG: true }`).                                    | A new `Flamapy` instance.                    |
| **atomicSets()**               | Returns the atomic sets of the feature model.                                                      | None                                                                                                                                                                                                      | `Array<Array<string>>` – A list of atomic sets. |
| **averageBranchingFactor()**   | Computes the average number of child features per parent feature in the feature model.             | None                                                                                                                                                                                                      | `Number` – The average branching factor.      |
| **commonality(pathToCompare)** | Calculates the percentage of features common to both the loaded feature model and another model.   | `pathToCompare` (string): Path to the configuration file or its content.                                                                                                                                  | `Number` – The percentage of common features. |
| **configurations(typeSolving)**| Retrieves a list of all valid configurations in the model.                                          | `typeSolving` (enum): Type of solving technique (e.g., BASIC, PYSAT, or BDD).                                                                                                                             | `Array<Object>` – A list of valid configurations. |
| **configurationsNumber(typeSolving)** | Returns the total number of valid configurations.                                           | `typeSolving` (enum): Type of solving technique (e.g., BASIC, PYSAT, or BDD).                                                                                                                             | `Number` – The total number of configurations. |
| **conflictDetection()**        | Detects conflicts in the feature model.                                                            | None                                                                                                                                                                                                      | (TODO)                                        |
| **coreFeatures(typeSolving)**  | Returns the list of core features (those present in all configurations).                           | `typeSolving` (enum): Type of solving technique (e.g., BASIC or PYSAT).                                                                                                                                   | `Array<string>` – A list of core features.    |
| **countLeafs()**               | Returns the number of leaf features in the model.                                                  | None                                                                                                                                                                                                      | `Number` – The count of leaf features.        |
| **deadFeatures(typeSolving)**  | Returns the features that are never selected in any configuration.                                 | `typeSolving` (enum): Type of solving technique (e.g., BASIC or PYSAT).                                                                                                                                   | `Array<string>` – A list of dead features.    |
| **estimatedNumberOfConfigurations()** | Estimates the total number of different configurations that can be produced.              | None                                                                                                                                                                                                      | `Number` – The estimated number of configurations. |
| **falseOptionalFeatures(typeSolving)** | Identifies optional features that behave like mandatory ones in all configurations.       | `typeSolving` (enum): Type of solving technique (e.g., BASIC or PYSAT).                                                                                                                                   | `Array<string>` – A list of false optional features. |
| **featureAncestors(featureName)** | Identifies all ancestor features of a given feature in the feature model.                      | `featureName` (string): The name of the feature.                                                                                                                                                          | `Array<string>` – A list of ancestor features. |
| **filterFeatures(path, typeSolving)** | Filters and returns a subset of features based on specific criteria.                        | `path` (string): Path to the configuration file or its content.<br>`typeSolving` (enum): Type of solving technique (e.g., BASIC or PYSAT).                                                                | `Array<Array<string>>` – A filtered list of features. |
| **leafFeatures()**             | Returns all leaf features in the feature model.                                                   | None                                                                                                                                                                                                      | `Array<string>` – A list of leaf features.    |
| **maxDepth()**                 | Computes the maximum depth of the feature tree.                                                   | None                                                                                                                                                                                                      | `Number` – The maximum depth.                 |
| **satisfiable(typeSolving)**   | Checks whether the feature model is valid according to its constraints.                           | `typeSolving` (enum): Type of solving technique (e.g., BASIC or PYSAT).                                                                                                                                   | `Boolean` – `true` if the model is satisfiable. |
| **satisfiableConfiguration(path, fullConfig, typeSolving)** | Checks if there exists at least one valid configuration that satisfies a given set of features. | `path` (string): Path to the configuration file or its content.<br>`fullConfig` (boolean): Whether to expect a full configuration or partial.<br>`typeSolving` (enum): Type of solving technique.         | `Boolean` – `true` if a satisfiable configuration exists. |
| **uniqueFeatures()**           | Identifies features that are unique to specific configurations.                                   | None                                                                                                                                                                                                      | (TODO)                                        |

---

## Contributing

If you want to contribute to Flamapy.js, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Submit a pull request with a detailed description of your changes.

---

## Contributions

A significant part of this project was developed by the Database Laboratory of the University of A Coruña (LBD). You can find more information about their work and other projects at the following links:

- **LBD GitHub:** [https://github.com/lbdudc](https://github.com/lbdudc)
- **LBD Website:** [https://lbd.udc.es](https://lbd.udc.es)

## Authors

- **Victor Lamas**  
  Email: [victor.lamas@udc.es](mailto:victor.lamas@udc.es)

- **Maria Isabel Limaylla**  
  Email: [maria.limaylla@udc.es](mailto:maria.limaylla@udc.es)

- **David Organvidez**  
  Email: [drorganvidez@us.es](mailto:drorganvidez@us.es)

---

## License

Flamapy.js is released under the MIT License.

---

## Contact

For support or inquiries, open an issue on the GitHub repository or contact the development team.
