// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import ViteFonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import compression from "vite-plugin-compression";
import vue from "@vitejs/plugin-vue";

// Helper to create compression plugin with common options
const createCompressionPlugin = (algorithm) =>
  compression({
    algorithm,
    ext: algorithm === "gzip" ? ".gz" : ".br",
    threshold: 10240, // 10KB
    deleteOriginFile: false,
    filter: /\.(js|mjs|json|css|html|ttf|woff|woff2)$/i, // Added font files
    compressionOptions: {
      level: 9, // Maximum compression
    },
  });

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
      styles: { configFile: "src/styles/settings.scss" },
      directives: true,
      importComposables: true,
      treeshaking: true,
    }),
    createCompressionPlugin("gzip"),
    createCompressionPlugin("brotliCompress"),
    ViteFonts({
      google: {
        families: [
          {
            name: "Inter",
            styles: "wght@100;300;400;500;700;900",
            preconnect: true,
            display: "swap",
            preload: true,
            prefetch: true,
          },
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
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,ttf,svg,png}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 86400,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  define: {
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },

  build: {
    target: "es2015",
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: process.env.NODE_ENV !== "production",

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (
              id.includes("vue") ||
              id.includes("pinia") ||
              id.includes("@vue")
            ) {
              return "vendor-vue";
            }
            if (id.includes("vuetify")) {
              return "vendor-vuetify";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            return "vendor-others";
          }

          // Match webpackChunkName patterns from router
          if (id.includes("/views/events/")) {
            return "events";
          }
          if (id.includes("/views/admin/")) {
            return "admin";
          }
          if (id.includes("/views/promoter/")) {
            return "promoter";
          }
          if (id.includes("/views/pro/")) {
            return "pro";
          }
          if (id.includes("/views/locations/")) {
            return "locations";
          }
          if (id.includes("/layouts/")) {
            return "layouts"; // Added for layouts
          }
          if (id.includes("/views/auth/")) {
            return "auth"; // Added for auth views
          }
          if (id.includes("/components/")) {
            return "components";
          }
        },
      },
    },

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
  },

  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "vuetify",
      "@vueuse/core",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage", // Added if you use storage
      "firebase/functions", // Added if you use functions
    ],
    exclude: [
      "@vueuse/shared",
      "firebase/analytics", // Exclude unused Firebase features
      "firebase/performance",
      "firebase/remote-config",
    ],
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },

  server: {
    port: 3001,
    headers: {
      "Cache-Control": "no-store",
    },
  },
});
