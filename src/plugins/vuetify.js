/**
 * plugins/vuetify.js
 * State of the art configuration for a music event platform
 */

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { h } from "vue";
import {
  VStepperVertical,
  VStepperVerticalItem,
} from "vuetify/labs/VStepperVertical";

export default createVuetify({
  components: {
    VStepperVertical,
    VStepperVerticalItem,
  },

  defaults: {
    global: {
      ripple: true,
    },
    VBtn: ({ theme }) => ({
      variant: "outlined",
      rounded: "lg",
      transition: "scroll-y-transition",
      letterSpacing: theme.current.value === "neon" ? "2px" : "1px",
      fontWeight: theme.current.value === "feminine" ? "300" : "400",
      textTransform: theme.current.value === "sunset" ? "uppercase" : "none",
      elevation: theme.current.value === "neon" ? "8" : "2",
      class: `${theme.current.value}-shadow`,
    }),
    VCard: ({ theme }) => ({
      rounded: "lg",
      border:
        theme.current.value === "neon" ? "1px solid currentColor" : "none",
      backdropFilter:
        theme.current.value === "feminine" ? "blur(10px)" : "none",
      background:
        theme.current.value === "feminine"
          ? "rgba(75, 0, 130, 0.7)"
          : undefined,
    }),
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
  },

  theme: {
    defaultTheme: "dark",
    variations: {
      colors: ["primary", "secondary", "surface"],
      lighten: 3,
      darken: 3,
      opacity: [25, 50, 75],
    },
    themes: {
      dark: {
        dark: true,
        colors: {
          primaryIcon: "#E53935",
          primary: "#E53935",
          secondary: "#00ACC1",
          accent: "#673AB7",
          error: "#FF5252",
          success: "#4CAF50",
          warning: "#FFC107",
          info: "#2196F3",
          "event-card": "#1A237E",
          "venue-tag": "#006064",
          "genre-tag": "#3949AB",
          "rating-active": "#FFC107",
          onSurface: "#FFFFFF",
          "link-text": "#FFFFFF",
          background: "#121212",
          surface: "#121212",
        },
      },
      light: {
        dark: false,
        colors: {
          primary: "#3F51B5",
          primaryIcon: "#3F51B5",
          secondary: "#00ACC1",
          accent: "#673AB7",
          error: "#FF5252",
          success: "#43A047",
          warning: "#FFC107",
          info: "#2196F3",
          "event-card": "#E8EAF6",
          "venue-tag": "#006064",
          "genre-tag": "#3949AB",
          "rating-active": "#FFC107",
          onSurface: "#FFFFFF",
          "link-text": "#212121",
          background: "#FFFFFF",
          surface: "#FFFFFF",
        },
      },
      neon: {
        dark: true,
        colors: {
          primaryIcon: "#39FF14",
          primary: "#39FF14",
          secondary: "#FF10F0",
          accent: "#14F0FF",
          error: "#FF3366",
          success: "#39FF14",
          warning: "#FFFF00",
          info: "#14F0FF",
          "event-card": "#0D0D0D",
          "venue-tag": "#FF10F0",
          "genre-tag": "#14F0FF",
          "rating-active": "#FFFF00",
          onSurface: "#FFFFFF",
          "link-text": "#FFFFFF",
          background: "#000000",
          surface: "#0A0A0A",
        },
      },
      feminine: {
        dark: true,
        colors: {
          primaryIcon: "#FF1493",
          primary: "#FF1493",
          secondary: "#BA68C8",
          accent: "#F48FB1",
          error: "#FF4081",
          success: "#98FB98",
          warning: "#FFC0CB",
          info: "#E6E6FA",
          "event-card": "#4A148C",
          "venue-tag": "#C2185B",
          "genre-tag": "#9C27B0",
          "rating-active": "#F48FB1",
          onSurface: "#FFFFFF",
          "link-text": "#FFFFFF",
          background: "#2E0854",
          surface: "#1A0033",
        },
      },
      sunset: {
        dark: true,
        colors: {
          primaryIcon: "#FF5F6D",
          primary: "#FF5F6D",
          secondary: "#38EFD0",
          accent: "#FFC837",
          error: "#FF5F6D",
          success: "#95E1D3",
          warning: "#FFC837",
          info: "#38EFD0",
          "event-card": "#2C3E50",
          "venue-tag": "#00B4B4",
          "genre-tag": "#FF5F6D",
          "rating-active": "#FFC837",
          onSurface: "#FFFFFF",
          "link-text": "#FFFFFF",
          background: "#1F2937",
          surface: "#1A1F25",
        },
      },
      dance: {
        dark: true,
        colors: {
          primaryIcon: "#5F18ED",
          primary: "#5F18ED",
          secondary: "#BAA2E9",
          accent: "#E4D5FF",
          error: "#FF3366",
          success: "#A5B4FC",
          warning: "#F0ABFC",
          info: "#C7D2FE",
          "event-card": "#3B0764",
          "venue-tag": "#7C3AED",
          "genre-tag": "#BAA2E9",
          "rating-active": "#E4D5FF",
          onSurface: "#FFFFFF",
          "link-text": "#FFFFFF",
          background: "#2E1065",
          surface: "#1E1B4B",
        },
      },
      tropical: {
        dark: false,
        colors: {
          primaryIcon: "#ffffff",
          primary: "#E91E63",
          secondary: "#00BFB3",
          accent: "#FFD700",
          error: "#FF3366",
          success: "#00D1B2",
          warning: "#FFC107",
          info: "#20B2AA",
          "event-card": "#4B0082",
          "venue-tag": "#E91E63",
          "genre-tag": "#008B8B",
          "rating-active": "#FFD700",
          onSurface: "#ffffff",
          "link-text": "#ffffff",
          background: "#E91E63",
          surface: "#C2185B",
        },
      },
    },
  },

  display: {
    mobileBreakpoint: "sm",
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1904,
    },
  },

  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: ({ theme }) => ({
      fontFamily:
        {
          neon: '"Orbitron", sans-serif',
          feminine: '"Playfair Display", serif',
          sunset: '"Montserrat", sans-serif',
        }[theme.current.value] || "Roboto, sans-serif",
      letterSpacing: theme.current.value === "neon" ? "0.2em" : "normal",
    }),
    button: ({ theme }) => ({
      textTransform: theme.current.value === "neon" ? "uppercase" : "none",
      fontWeight:
        {
          neon: 700,
          feminine: 300,
          sunset: 500,
        }[theme.current.value] || 400,
    }),
    subtitle1: ({ theme }) => ({
      opacity: theme.current.value === "neon" ? 0.87 : 0.7,
    }),
  },

  transitions: {
    "neon-glow": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "soft-fade": "all 0.4s ease-in-out",
    "sunset-slide": "all 0.5s cubic-bezier(0.4, 0, 0.6, 1)",
  },
});
