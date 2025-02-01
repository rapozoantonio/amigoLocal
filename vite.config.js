// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import ViteFonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify({
      autoImport: true,
      styles: { configFile: "src/styles/settings.scss" },
    }),
    ViteFonts({
      google: {
        families: [
          { name: "Inter", styles: "wght@100;300;400;500;700;900" },
        ],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Jubilos",
        short_name: "Jubilos",
        description: "Os Melhores Eventos do RJ E SP",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4DBA87",
        icons: [
          {
            src: "/img/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      screenshots: [
        {
          src: "/img/screenshots/desktop.png",
          sizes: "1280x800",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "/img/screenshots/mobile.png",
          sizes: "375x812",
          type: "image/png",
          form_factor: "narrow",
        },
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,ttf,svg,png}"],
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        // Create separate chunks for vendor modules to reduce initial payload
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
