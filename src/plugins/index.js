/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import router from '../router';
import pinia from '../store';
import helpers from './helpers';
import swal from './sweetalert';
// Plugins
import vuetify from './vuetify';

export function registerPlugins(app) {
  app.use(vuetify).use(pinia).use(router).use(helpers).use(swal);
}
