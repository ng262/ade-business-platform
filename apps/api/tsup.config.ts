import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node22",
  splitting: false,
  clean: true,
  dts: true,
  sourcemap: true,
});
