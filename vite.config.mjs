import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/site-novo-forro-do-horizonte/",
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
  },
});
