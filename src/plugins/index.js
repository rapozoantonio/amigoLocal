/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import pinia from '../store'
import router from '../router'
import helpers from './helpers'
import swal from './sweetalert'


export function registerPlugins(app) {
  app
    .use(pinia)
    .use(router)
    .use(helpers)
    .use(swal)
}
