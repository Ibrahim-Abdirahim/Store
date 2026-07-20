import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for running the React frontend on port 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
