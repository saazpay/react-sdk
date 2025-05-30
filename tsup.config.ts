// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.tsx"],
  outDir: "dist",
  format: ["cjs", "esm"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
});
