// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Toasted from 'vue-toasted';
import axios from 'axios';
import { setupCalendar, Calendar } from 'v-calendar';
import 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'flatpickr/dist/flatpickr.css'; // eslint-disable-line import/no-extraneous-dependencies
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
setupCalendar({ locale: 'en' });
Vue.component('v-calendar', Calendar);
Vue.use(Toasted, { position: 'bottom-center', duration: 5000 });

window.axios = axios;
axios.defaults.baseURL = `${process.env.API_HOST}/api`;
axios.interceptors.request.use((config) => {
  if (!store.getters.token.length) return config;
  config.headers.Authorization = `Bearer ${store.getters.token}`;
  return config;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
