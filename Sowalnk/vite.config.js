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
      "3-tier-540623662.us-east-2.elb.amazonaws.com",
      "app-alb-990835184.us-east-2.elb.amazonaws.com",
    ],
    // proxy: {
    //   "/api": {
    //     target: "https://app-alb-990835184.us-east-2.elb.amazonaws.com",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
