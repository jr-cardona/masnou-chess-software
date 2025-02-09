/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 */

import './index.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './Components/App.vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(BootstrapVue3);
app.mount("#app");
