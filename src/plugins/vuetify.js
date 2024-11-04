/**
 * plugins/vuetify.js
 * Optimized configuration for a music event platform
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical'

export default createVuetify({
  components: {
    VStepperVertical,
    VStepperVerticalItem,
  },
  
  defaults: {
    VBtn: {
      variant: 'outlined',
      rounded: 'lg',
      transition: 'scroll-y-transition'
    },
    VCard: {
      elevation: 2,
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    }
  },

  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primaryIcon: "#F44336",
          // primary: '#673AB7',
          primary: '#3F51B5',      // Indigo - professional, trustworthy
          secondary: '#00BCD4',    // Cyan - modern, complementary to indigo
          accent: '#7C4DFF',       // Deep purple - energetic highlights
          error: '#FF5252',        // Red - clear error states
          success: '#4CAF50',      // Green - confirmations
          warning: '#FFC107',      // Amber - attention
          info: '#2196F3',         // Light blue - informational
          
          // Custom colors for specific features
          'event-card': '#1A237E',  // Darker indigo for event cards
          'venue-tag': '#00838F',   // Dark cyan for venue-related elements
          'genre-tag': '#5C6BC0',   // Lighter indigo for genre tags
          'rating-active': '#FFC107' // Amber for active ratings
        }
      },
      light: {
        colors: {
          primary: '#3F51B5',
          secondary: '#00BCD4',
          accent: '#7C4DFF',
          error: '#FF5252',
          success: '#4CAF50',
          warning: '#FFC107',
          info: '#2196F3',
          'event-card': '#E8EAF6',
          'venue-tag': '#00838F',
          'genre-tag': '#5C6BC0',
          'rating-active': '#FFC107'
        }
      }
    }
  },

  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1904,
    }
  }
})