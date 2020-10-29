import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import initSocket from '@/socket';
import habits from './modules/habits';

Vue.use(Vuex);
const strict = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  modules: {
    habits
  },
  strict,
  plugins: [
    createMutationsSharer({ predicate: (mutation, state) => true }),
    createPersistedState({ key: 'catena' })
  ]
});

initSocket(store);

export default store;
