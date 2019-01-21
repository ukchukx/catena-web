import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import tasks from './modules/tasks';

Vue.use(Vuex);
const strict = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  modules: {
    tasks
  },
  strict,
  plugins: [
    createMutationsSharer({ predicate: (mutation, state) => true }),
    createPersistedState({ key: 'catena' })
  ]

});

export default store;
