import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "RepereCore",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "tsconfig.json",
    }),
  ],
});
