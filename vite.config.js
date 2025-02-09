// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import ViteFonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true,
      styles: { configFile: "src/styles/settings.scss" },
    }),
    ViteFonts({
      google: {
        families: [{ 
          name: "Inter", 
          styles: "wght@100;300;400;500;700;900",
          preconnect: true,
          display: 'swap'
        }],
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
        runtimeCaching: [{
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400 // 24 hours
            }
          }
        }]
      }
    }),
  ],

  // Define process.env
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  },

  build: {
    target: 'es2015',
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'vuex'],
          'ui-vendor': ['vuetify'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'vuex', 'vuetify'],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },

  server: {
    port: 3001,
  },
});