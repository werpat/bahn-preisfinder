import "bootstrap/dist/css/bootstrap.css"
import './assets/main.css'
import './assets/vue3-simple-typeahead-custom.css'
import './assets/date-extentions.js'

import { createApp } from 'vue'
import App from './App.vue'
import SimpleTypeahead from 'vue3-simple-typeahead';
import "bootstrap/dist/js/bootstrap.js"
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App)
    .use(SimpleTypeahead)
    .mount('#app')

