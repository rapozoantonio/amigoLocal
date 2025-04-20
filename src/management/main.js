//management/main.js
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
  window.isAdminSubdomain = true
  window.ENTRY_POINT = 'management'
  
  // Add a class to body to help with CSS targeting
  document.body.classList.add('management-app')
  
  console.log('Management entry point initialized')
  console.log('Current hostname:', window.location.hostname)
  console.log('Current pathname:', window.location.pathname)
}

// Create and configure app
const app = createApp(App)

// Create and register the head
const head = createHead()
app.use(head)

// Register plugins directly
app.use(vuetify)
app.use(pinia)
app.use(helpers)
app.use(swal)

// Explicitly use the management router
app.use(router)

// Make router available globally for debugging
window.router = router

// Register components
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

// Force an initial navigation if needed
if ((window.location.pathname === '/' || window.location.pathname === '/admin') && 
    (window.isAdminSubdomain === true || window.location.hostname.startsWith('admin.'))) {
  console.log('Forcing initial navigation to management dashboard');
  setTimeout(() => {
    router.push({ name: 'dashboard' });
  }, 100);
}