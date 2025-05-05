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
```

---

## Supported Operations

Below is a detailed list of supported operations, including their descriptions, inputs, and outputs:

### **Constructor**

```javascript
new Flamapy(filepathOrText, options)
```

- **Description**: Creates a new instance of the `Flamapy` class.
- **Inputs**:
  - `filepathOrText` (string): Either the path to a feature model file or the feature model as plain text in UVL format.
  - `options` (object, optional): Configuration options. Example:

    ```javascript
    {
        DEBUG: true // Enables debug mode
    }
    ```

- **Outputs**: A new `Flamapy` instance.

---

### **atomicSets()**

- **Description**: Returns the atomic sets of the feature model.
- **Inputs**: None
- **Outputs**: `Array<Array<string>>` – A list of atomic feature groups.

---

### **averageBranchingFactor()**

- **Description**: Computes the average number of child features per parent feature in the feature model.
- **Inputs**: None
- **Outputs**: `Number` – The average branching factor.

---

### **commonality(pathToCompare,typeSolving)**

- **Description**: Calculates the percentage of features common to both the loaded feature model and the model at the specified path.
- **Inputs**:
  - `pathToCompare` (string): Path to the configuration file or its content.
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Number` – The percentage of common features.

---

### **configurations(typeSolving)**

- **Description**: Retrieves a list of all valid configurations in the model.
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0), PYSAT(1) or BDD (2). 
- **Outputs**: `Array<Object>` – A list of valid configurations.

---

### **configurationsNumber(typeSolving)**

- **Description**: Returns the total number of valid configurations.
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0), PYSAT(1) or BDD (2). 
- **Outputs**: `Number` – The total number of configurations.

---

### **conflictDetection()**

- **Description**: Detects conflicts in the feature model.
- **Inputs**: None
- **Outputs**: (TODO)

---

### **coreFeatures(typeSolving)**

- **Description**: Returns the list of core features (those present in all configurations).
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Array<string>` – A list of core features.

---

### **countLeafs()**

- **Description**: Returns the number of leaf features in the model.
- **Inputs**: None
- **Outputs**: `Number` – The count of leaf features.

---

### **deadFeatures(typeSolving)**

- **Description**: Returns the features that are never selected in any configuration.
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Array<string>` – A list of dead features.

---

### **estimatedNumberOfConfigurations()**

- **Description**: Estimates the total number of different configurations that can be produced from the feature model.
- **Inputs**: None
- **Outputs**: `Number` – The estimated number of configurations.

---

### **falseOptionalFeatures(typeSolving)**

- **Description**: Identifies optional features that behave like mandatory ones in all configurations.
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Array<string>` – A list of false optional features.

---

### **featureAncestors(featureName)**

- **Description**: Identifies all ancestor features of a given feature in the feature model.
- **Inputs**:
  - `featureName` (string): The name of the feature.
- **Outputs**: `Array<string>` – A list of ancestor features.

---

### **filterFeatures(path,typeSolving)**

- **Description**: Filters and returns a subset of features based on specific criteria.
- **Inputs**:
  - `path` (string): Path to the configuration file or its content.
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Array<Array<string>>` – A filtered list of features.

---

### **leafFeatures()**

- **Description**: Returns all leaf features in the feature model.
- **Inputs**: None
- **Outputs**: `Array<string>` – A list of leaf features.

---

### **maxDepth()**

- **Description**: Computes the maximum depth of the feature tree.
- **Inputs**: None
- **Outputs**: `Number` – The maximum depth.

---

### **satisfiable()**

- **Description**: Checks whether the feature model is valid according to its constraints.
- **Inputs**: 
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Boolean` – `true` if the model is satisfiable, otherwise `false`.

---

### **satisfiableConfiguration(path, fullConfig)**

- **Description**: Checks if there exists at least one valid configuration that satisfies a given set of selected and deselected features.
- **Inputs**:
  - `path` (string): Path to the configuration file or its content.
  - `fullConfig` (boolean): Whether to expect a full configuration or partial.
  - `typeSolving` (number): Type of solving technique. Could be BASIC (0) or PYSAT(1). 
- **Outputs**: `Boolean` – `true` if a satisfiable configuration exists, otherwise `false`.

---

### **uniqueFeatures()**

- **Description**: Identifies features that are unique to specific configurations.
- **Inputs**: None
- **Outputs**: `Array<string>` – A list of features.

---

### **configurationDistribution()**

- **Description**: Analyzes the distribution of configurations within the feature model, identifying how features are grouped across valid configurations.  
- **Inputs**: None
- **Outputs**: `Array<number>` – A list of distributions.

---

### **featureInclusionProbability()**

- **Description**: Calculates the probability of each feature being included in a valid configuration.  
- **Inputs**: None
- **Outputs**: `Map` – A list of probabilities of each feature.

---

### **homogeneity()**

- **Description**: Measures the uniformity of feature distributions across all valid configurations.  
- **Inputs**: None
- **Outputs**: `Number` – The uniformity of all configurations.

---

### **variability()**

- **Description**: Measures the variability of a feature model by analyzing the presence and absence of features across all valid configurations.
- **Inputs**: None
- **Outputs**: `Array<number>` – A list of the variability of the feature model.

---

### **variantFeatures()**

- **Description**: Identifies variant features in the feature model, highlighting features that change across different configurations.
- **Inputs**: None
- **Outputs**: `Array<string>` - List of features.

---

### **diagnosis()**

- **Description**: Analyzes the feature model to identify and explain inconsistencies or errors, providing insights into potential fixes.
- **Inputs**: None
- **Outputs**: `Array<string>` - List of diagnosis and conflicts.

---

### **sampling()**

- **Description**: Generates a sample set of valid configurations from the feature model, providing a representative subset for analysis.
- **Inputs**: None
- **Outputs**: 

---

## Contributing

If you want to contribute to Flamapy.js, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Submit a pull request with a detailed description of your changes.

---

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
