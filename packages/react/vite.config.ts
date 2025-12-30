import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
      skipDiagnostics: false,
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "RepereReact",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: (id) => {
        // Don't bundle anything that's a dependency
        return (
          id.startsWith("react") || // Catches react, react-dom, react-dom/client, react/jsx-runtime
          id.startsWith("motion") || // Catches motion, motion/react, etc.
          id.startsWith("@repere/") // Catches all @repere/* packages
        );
      },
    },
  },
});
