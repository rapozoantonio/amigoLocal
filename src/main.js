import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "@/styles/settings.scss";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import VueDatePicker from "@vuepic/vue-datepicker";

import App from "./App.vue";

// Components
// import 'dotenv/config'

const app = createApp(App);
registerPlugins(app);
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");
