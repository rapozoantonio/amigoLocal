// plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'
import { defineAsyncComponent } from 'vue'
import { aliases, mdi } from 'vuetify/iconsets/mdi'  // Add this import

// Import themes directly
import { darkTheme, lightTheme, neonTheme, feminineTheme, sunsetTheme, danceTheme, tropicalTheme } from './themes'

// Async import only what's needed
const VStepperVertical = defineAsyncComponent(() => 
  import('vuetify/labs/VStepperVertical').then(m => m.VStepperVertical)
)

export default createVuetify({
  // Only register components actually used
  components: {
    VStepperVertical,
  },

  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
    aliases
  },

  locale: {
    locale: 'pt',
    fallback: 'pt',
    messages: { pt },
  },

  // Simplified defaults
  defaults: {
    VBtn: {
      variant: 'outlined',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },

  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
      light: lightTheme,
      neon: neonTheme,
      feminine: feminineTheme,
      sunset: sunsetTheme,
      dance: danceTheme,
      tropical: tropicalTheme,
    },
  },

  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
})