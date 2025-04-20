/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import router from '../promotion/router';
import pinia from '../promotion/store';
import helpers from './helpers';
import swal from './sweetalert';
// Plugins
import vuetify from './vuetify';

export function registerPlugins(app, options = {}) {
  app.use(vuetify).use(pinia).use(helpers).use(swal);
  
  // Only register the default router if not explicitly skipped
  if (!options.skipRouter) {
    app.use(router);
  }
}
