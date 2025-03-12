import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    optimizeDeps: {
        exclude: ["url", "pyodide", "fs/promises", "path", "url"],
    },
    build: {
        rollupOptions: {
            external: ["url", "pyodide", "fs/promises", "path", "url"],
        },
        lib: {
            entry: path.resolve(__dirname, "index.js"),
            name: "main",
            fileName: "main",
            formats: ["es", "umd"]
        },
    },
});
