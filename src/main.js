import '@/styles/fonts.css'
import '@/styles/settings.scss'
import '@vuepic/vue-datepicker/dist/main.css'
import 'flag-icons/css/flag-icons.min.css'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import VueDatePicker from '@vuepic/vue-datepicker'

// Replace vue-meta with @vueuse/head
import { createHead } from '@vueuse/head'

// PWA registration
import { registerSW } from 'virtual:pwa-register'

// App import
import App from './App.vue'

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

// Register plugins
registerPlugins(app)
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