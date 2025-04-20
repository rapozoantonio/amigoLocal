//promotion/main.js
import '@/core/styles/fonts.css'
import '@/core/styles/settings.scss'
import '@vuepic/vue-datepicker/dist/main.css'
import 'flag-icons/css/flag-icons.min.css'

// Composables
import { createApp } from 'vue'

// Import vuetify and other plugins directly instead of using registerPlugins
import vuetify from '@/core/plugins/vuetify'
import pinia from '@/promotion/store' 
import helpers from '@/core/plugins/helpers'
import swal from '@/core/plugins/sweetalert'
import VueDatePicker from '@vuepic/vue-datepicker'

// Import the management router only - not the promotion router
import router from './router'

// Replace vue-meta with @vueuse/head
import { createHead } from '@vueuse/head'

// PWA registration
import { registerSW } from 'virtual:pwa-register'

// Use the root App.vue
import App from '../App.vue'

// Set environment variable to indicate we're in the management entry point
if (typeof window !== 'undefined') {
  // Set global flags
  window.isAdminSubdomain = false;
  window.ENTRY_POINT = 'promotion';
  
  // Add a class to body to help with CSS targeting
  document.body.classList.add('promotion-app');
  
  console.log('Promotion entry point initialized');
  console.log('Current hostname:', window.location.hostname);
  console.log('Current pathname:', window.location.pathname);
}

// Performance monitoring for development
if (process.env.NODE_ENV === 'development') {
  // Monitor CSS/Font performance
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        console.debug(`Resource loaded: ${entry.name}`, {
          duration: entry.duration,
          type: entry.initiatorType
        })
      }
    })
  })
  observer.observe({ entryTypes: ['resource'] })
}

// Create and configure app
const app = createApp(App)

// Create and register the head
const head = createHead()
app.use(head)

// Register plugins directly instead of using the shared registerPlugins function
// to avoid loading the promotion router
app.use(vuetify)
app.use(pinia)
app.use(helpers)
app.use(swal)

// Explicitly use the management router
app.use(router)

// Make router available globally
window.router = router;

app.component('VueDatePicker', VueDatePicker)

// Register service worker with refresh callback
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  }
})

// Mount app
app.mount('#app')