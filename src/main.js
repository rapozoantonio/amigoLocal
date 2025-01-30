import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "@/styles/settings.scss";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import VueDatePicker from "@vuepic/vue-datepicker";

// 🔽 Add PWA service worker registration (pick one option below 🔽)
import { registerSW } from 'virtual:pwa-register'; // For Vite projects
// import './registerServiceWorker'; // For Vue CLI projects

import App from "./App.vue";

const app = createApp(App);
registerPlugins(app);
app.component("VueDatePicker", VueDatePicker);

// 🔽 Initialize PWA (add this line)
registerSW(); // For Vite projects
// (No extra line needed for Vue CLI - the import above auto-registers)

app.mount("#app");