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

// Create a new instance of Flamapy
const flamapy = new Flamapy('path/to/feature-model.uvl', options);
await flamapy.initialize();

try {
    // Execute a Flamapy operation
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
    commonality("path_to_compare_uvl"); // TODO
    configurations();
    configurationsNumber();
    conflictDetection(); // TODO
    coreFeatures();
    countLeafs();
    deadFeatures();
    estimatedNumberOfConfigurations();
    falseOptionalFeatures();
    featureAncestors(); // TODO
    filterFeatures(); // TODO
    leafFeatures();
    maxDepth();
    satisfiable();
    satisfiableConfiguration(path, boolean); // TODO
    uniqueFeatures(); // TODO
```

## Contributing

If you want to contribute to Flamapy.js, please follow these steps:

- Fork the repository.
- Create a new branch for your feature.
- Submit a pull request with a detailed description of your changes.

## License

Flamapy.js is released under the MIT License.

## Contact

For support or inquiries, open an issue on the GitHub repository or contact the development team.
