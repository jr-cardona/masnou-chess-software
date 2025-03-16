import './index.css';
import {createApp} from 'vue';
import TournamentTimer from './components/TournamentTimer.vue';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(TournamentTimer);
app.use(BootstrapVue3);
app.mount("#timer");
