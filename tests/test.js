import Flamapy from "../lib/flamapy.js";
import { fileURLToPath } from "url";
import path from "path";

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.resolve(__dirname, "./uvls/test.uvl");

    const flamapy = new Flamapy(filePath);
    await flamapy.initialize();

    const result = await flamapy.atomicSets();
    // const result = await flamapy.averageBranchingFactor();
    // const result = await flamapy.commonality(path.resolve(__dirname, "./uvls/test2.uvl")); // TODO: Fix this
    // const result = await flamapy.configurations();
    // const result = await flamapy.configurationsNumber();
    // const result = await flamapy.coreFeatures();
    // const result = await flamapy.countLeafs();
    // const result = await flamapy.deadFeatures();
    // const result = await flamapy.estimatedNumberOfConfigurations();
    // const result = await flamapy.falseOptionalFeatures();
    // const result = await flamapy.featureAncestors();
    // const result = await flamapy.filterFeatures();
    // const result = await flamapy.leafFeatures();
    // const result = await flamapy.maxDepth();
    // const result = await flamapy.satisfiable();
    // const result = await flamapy.satisfiableConfiguration();
    // const result = await flamapy.uniqueFeatures();
    console.log("Atomic Sets result: ", result);
})();

