import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const allowedHosts =
    env.VITE_ALLOWED_HOSTS?.split(",").map((h) => h.trim()) || [];

  return {
    root: __dirname,
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../../shared/src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts,
      proxy: {
        "/api": env.VITE_API_URL,
      },
      fs: {
        allow: [
          path.resolve(__dirname),
          path.resolve(__dirname, "../../shared"),
        ],
      },
    },
    optimizeDeps: {
      exclude: ["class-variance-authority"],
    },
  };
});
