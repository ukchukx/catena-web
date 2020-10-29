import axios from 'axios';
import { SAVE_USER, SAVE_TOKEN, SAVE_HABITS, SAVE_HABIT, DELETE_HABIT, UPDATE_HABIT_HISTORY } from './mutation-types';

const httpErrorHandler = ({ response: { status, data } }) => 
  Promise.reject(status === 403 ? { ...data, tokenExpired: true } : data);


export function saveHabit({ commit }, habit) {
  if (!habit) return;

  commit(SAVE_HABIT, habit);
}

export function removeHabit({ commit }, habit) {
  if (!habit) return;

  commit(DELETE_HABIT, typeof habit === 'object' ? habit.id : habit);
}

export function saveUser({ commit }, user) {
  if (!user) return;

  commit(SAVE_USER, user);
}

export function fetchProfile(state) {
  return axios
    .get('/me')
    .then(({ data: { success, data } }) => {
      if (success) saveUser(state, data);

      return success;
    })
    .catch(httpErrorHandler);
}

export function updateProfile(state, payload) {
  return axios
    .put('/profile', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) saveUser(state, data);

      return { success, message };
    })
    .catch(httpErrorHandler);
}

export function changePassword(_, payload) {
  return axios
    .post('/change_password', payload)
    .then(({ data: { success, message } }) => ({ success, message }))
    .catch(httpErrorHandler);
}

export function signup(state, payload) {
  return axios
    .post('/signup', payload)
    .then(({ data: { success, data, token } }) => {
      if (success) {
        saveUser(state, data);
        state.commit(SAVE_TOKEN, token);
      }

      return success;
    })
    .catch(httpErrorHandler);
}

export function authenticate(state, payload) {
  return axios
    .post('/signin', payload)
    .then(({ data: { success, data, token } }) => {
      if (success) {
        state.commit(SAVE_TOKEN, token);
        saveUser(state, data);
      }
      return success;
    })
    .catch(httpErrorHandler);
}

export function forgotPassword(_, payload) {
  return axios
    .post('/forgot', payload)
    .then(({ data }) => data)
    .catch(({ response: { data } }) => data);
}

export function resetPassword(state, payload) {
  return axios
    .post('/reset', payload)
    .then(({ data: { success, data, token: { token } } }) => {
      if (success) {
        saveUser(state, data);
        state.commit(SAVE_TOKEN, token);
      }
      return success;
    })
    .catch(httpErrorHandler);
}

export function deleteUser({ commit }) {
  commit(SAVE_USER, {});
  commit(SAVE_TOKEN, '');
  commit(SAVE_HABITS, []);
}

export function createHabit(state, payload) {
  return axios
    .post('/habits', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) {
        saveHabit(state, data);
      }
      return { success, message };
    })
    .catch(httpErrorHandler);
}

export function markPendingHabit({ commit }, { id }) {
  return axios
    .post(`/habits/${id}/mark-pending`)
    .then(({ data: { success, data } }) => {
      if (success) commit(UPDATE_HABIT_HISTORY, data);
      
      return success;
    })
    .catch(httpErrorHandler);
}

export function fetchHabits({ commit }) {
  return axios
    .get('/habits')
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_HABITS, data);
      }
      return success;
    })
    .catch(httpErrorHandler);
}

export function fetchHabit(state, habitId) {
  return axios
    .get(`/public/habits/${habitId}`)
    .then(({ data: { success, data } }) => {
      if (success) saveHabit(state, data);

      return { success, data };
    })
    .catch(httpErrorHandler);
}

export function updateHabit(state, habit) {
  return axios
    .put(`/habits/${habit.id}`, habit)
    .then(({ data: { success, data, message } }) => {
      if (success) saveHabit(state, data);

      return { success, message };
    })
    .catch(httpErrorHandler);
}

export function updateSchedule(state, { id, repeats, start_date }) {
  return axios
    .put(`/habits/${id}/schedule`, { start_date, repeats })
    .then(({ data: { success, data, message } }) => {
      if (success) saveHabit(state, data);

      return { success, message };
    })
    .catch(httpErrorHandler);
}

export function deleteHabit(state, habit) {
  const id = typeof habit === 'object' ? habit.id : habit;
  return axios
    .delete(`/habits/${id}`)
    .then(() => {
      removeHabit(state, id);
      return true;
    })
    .catch(httpErrorHandler);
}

export function archiveHabit(state, habit) {
  return axios
    .put(`/habits/${typeof habit === 'object' ? habit.id : habit}`, { archived: true })
    .then(({ data: { success, data, message } }) => {
      if (success) saveHabit(state, data);

      return { success, message };
    })
    .catch(httpErrorHandler);
}

export function restoreHabit(state, habit) {
  return axios
    .put(`/habits/${typeof habit === 'object' ? habit.id : habit}`, { archived: false })
    .then(({ data: { success, data, message } }) => {
      if (success) saveHabit(state, data);

      return { success, message };
    })
    .catch(httpErrorHandler);
}
