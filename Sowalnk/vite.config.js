import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://app-ALB-990835184.us-east-2.elb.amazonaws.com",
        changeOrigin: true,
        secure: false, // Only needed if using HTTPS and self-signed certificates
      },
    },
  },
});
