import * as actions from './actions';
import * as getters from './getters';
import {
  SAVE_USER,
  SAVE_TOKEN,
  SAVE_TASKS,
  SAVE_TASK,
  DELETE_TASK,
  SAVE_SCHEDULE
} from './mutation-types';

const initialState = {
  user: {},
  token: '',
  tasks: []
};

const saveTask = (state, task) => {
  const idx = state.tasks.findIndex(({ id }) => task.id === id);

  if (idx !== -1) {
    state.tasks.splice(idx, 1, task);
  } else {
    state.tasks.push(task);
  }
};

const saveTasks = (state, tasks) => {
  state.tasks = tasks;
};

const mutations = {
  [SAVE_TOKEN](state, token) {
    state.token = token;
  },
  [SAVE_USER](state, profile) {
    const { tasks = [] } = profile;
    saveTasks(state, tasks);
    delete profile.tasks;
    state.user = profile;
  },
  [SAVE_TASKS](state, tasks) {
    saveTasks(state, tasks);
  },
  [SAVE_TASK](state, task) {
    saveTask(state, task);
  },
  [SAVE_SCHEDULE](state, schedule) {
    const task = state.tasks.find(({ id }) => schedule.task_id === id);

    if (task) {
      const idx = task.schedules.findIndex(({ id }) => schedule.id === id);

      if (idx !== -1) {
        task.schedules.splice(idx, 1, schedule);
      } else {
        task.schedules.push(schedule);
      }

      saveTask(state, task);
    }
  },
  [DELETE_TASK](state, id) {
    state.tasks = state.tasks.filter(task => id !== task.id);
  }
};

export default {
  state: Object.assign({}, initialState),
  actions,
  getters,
  mutations
};
