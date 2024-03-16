import { createApp } from 'vue';
import App from './App.vue'; // Assuming App.vue is your root component
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import router from './router'; 

// Import PrimeVue styles
import 'primeflex/primeflex.css'; // Corrected path
import 'primevue/resources/themes/md-dark-indigo/theme.css'; // Default theme
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Import your custom global styles, ensure this comes last
import './assets/styles.css'; 
import './assets/theme.css'; 


const app = createApp(App);

app.use(router); // Use the router
app.use(ToastService);
// Use PrimeVue
app.use(PrimeVue, { ripple: true }); // You can set global PrimeVue options here



// Other global configurations (e.g., router, store) can be added here
// ...

app.mount('#app');
