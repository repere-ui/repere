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
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0]?.endsWith(".css")) return "styles.css";
          return assetInfo.names?.[0] ?? "assets/[name][extname]";
        },
      },
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
