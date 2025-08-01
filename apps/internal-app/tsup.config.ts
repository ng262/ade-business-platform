import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.tsx"],
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
});
