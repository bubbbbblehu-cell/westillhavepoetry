import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative paths let the same build work after a repository rename.
  base: "./",
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "dist-pages",
  },
});
