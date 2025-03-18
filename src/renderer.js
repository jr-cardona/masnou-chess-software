import './index.css';
import './fonts.css';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './Components/App.vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(BootstrapVue3);
app.use(i18n);
app.mount("#app");
