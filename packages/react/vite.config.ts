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
        // Don't bundle anything that's a dependency
        return (
          id.startsWith("react") || // Catches react, react-dom, react-dom/client, react/jsx-runtime
          id.startsWith("motion") // Catches motion, motion/react, etc
        );
      },
    },
  },
});
