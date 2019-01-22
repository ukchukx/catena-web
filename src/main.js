// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueFlashMessage from 'vue-flash-message';
import axios from 'axios';
import { setupCalendar, Calendar } from 'v-calendar';
import 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line import/no-extraneous-dependencies
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-flash-message/dist/vue-flash-message.min.css';
import 'v-calendar/lib/v-calendar.min.css';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
setupCalendar({ locale: 'en' });
Vue.component('v-calendar', Calendar);
Vue.use(VueFlashMessage, { createShortcuts: false });

window.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3333/api/v1';
axios.interceptors.request.use((config) => {
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
