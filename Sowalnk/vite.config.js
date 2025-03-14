import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "sakthidev.site",
      "app-alb-990835184.us-east-2.elb.amazonaws.com",
    ],
    proxy: {
      "/api": {
        target: "https://app-alb-990835184.us-east-2.elb.amazonaws.com",
        // target: "http://localhost:2000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// http://localhost:2000
