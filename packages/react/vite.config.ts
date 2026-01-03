import { copyFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
    {
      name: "copy-core-styles",
      closeBundle() {
        copyFileSync(
          "node_modules/@repere/core/dist/styles.css",
          "dist/styles.css"
        );
      },
    },
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "@repere/react",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: (id) => {
        return (
          id.startsWith("react") || // Catches react, react-dom, react-dom/client, react/jsx-runtime
          id.startsWith("motion") // Catches motion, motion/react, etc
        );
      },
    },
  },
});
