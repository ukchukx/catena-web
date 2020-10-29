import * as actions from './actions';
import * as getters from './getters';
import {
  SAVE_USER,
  SAVE_TOKEN,
  SAVE_HABITS,
  SAVE_HABIT,
  DELETE_HABIT,
  UPDATE_HABIT_HISTORY
} from './mutation-types';

const initialState = {
  user: {},
  token: '',
  habits: []
};

const saveHabit = (state, habit) => {
  const idx = state.habits.findIndex(({ id }) => habit.id === id);

  if (idx !== -1) {
    state.habits.splice(idx, 1, habit);
  } else {
    state.habits.push(habit);
  }
};

const saveHabits = (state, habits) => {
  state.habits = habits;
};

const updateHabitHistory = (state, history) => {
  state.habits = state.habits.map((habit) => {
    if (habit.id === history.habit_id) {
      habit.history = habit.history.map(h => h.date === history.date ? history : h);
    }

    return habit;
  });
};

const mutations = {
  [SAVE_TOKEN](state, token) {
    state.token = token;
  },
  [SAVE_USER](state, profile) {
    const { habits = [] } = profile;
    saveHabits(state, habits);
    delete profile.habits;
    state.user = profile;
  },
  [SAVE_HABITS](state, habits) {
    saveHabits(state, habits);
  },
  [SAVE_HABIT](state, habit) {
    saveHabit(state, habit);
  },
  [DELETE_HABIT](state, id) {
    state.habits = state.habits.filter(habit => id !== habit.id);
  },
  [UPDATE_HABIT_HISTORY](state, history) {
    updateHabitHistory(state, history);
  }
};

export default {
  state: Object.assign({}, initialState),
  actions,
  getters,
  mutations
};
