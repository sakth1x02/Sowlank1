import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all available network interfaces
    port: 5173,
    strictPort: true,
    allowedHosts: "all", // <-- Allow all hosts to connect
    proxy: {
      "/api": {
        target: "https://3-tier-540623662.us-east-2.elb.amazonaws.com",
        changeOrigin: true,
        secure: false, // If using HTTPS, set this to true
      },
    },
  },
});
