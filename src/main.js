// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import axios from 'axios';
import 'iview/dist/styles/iview.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(iView);
window.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3333';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
