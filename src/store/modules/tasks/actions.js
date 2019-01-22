import axios from 'axios';
import {
  SAVE_USER,
  SAVE_TOKEN,
  DELETE_USER,
  DELETE_TOKEN,
  SAVE_TASKS,
  SAVE_TASK,
  DELETE_TASK,
  DELETE_TASKS,
  SAVE_SCHEDULE
} from './mutation-types';

export function fetchProfile({ commit }) {
  return axios
    .get('/me')
    .then(({ data: { success, data, token } }) => {
      if (success) {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
      }
      return success;
    })
    .catch(() => false);
}

export function updateProfile({ commit }, payload) {
  return axios
    .post('/update_profile', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) {
        commit(SAVE_USER, data);
      }
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function changePassword(store, payload) {
  return axios
    .post('/change_password', payload)
    .then(({ data: { success, message } }) => ({ success, message }))
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function signup({ commit }, payload) {
  return axios
    .post('/signup', payload)
    .then(({ data: { success, data, token: { token } } }) => {
      if (success) {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
      }
      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function authenticate({ commit }, payload) {
  return axios
    .post('/authenticate', payload)
    .then(({ data: { success, data, token: { token } } }) => {
      if (success) {
        commit(SAVE_TOKEN, token);
        commit(SAVE_USER, data);
      }
      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function deleteUser({ commit }) {
  commit(DELETE_USER);
  commit(DELETE_TOKEN);
  commit(DELETE_TASKS);
}

export function createTask({ commit }, payload) {
  return axios
    .post('/tasks', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) {
        commit(SAVE_TASK, data);
      }
      return { success, message };
    })
    .catch(({ success, message }) => Promise.reject({ success, message }));
}

export function markTaskAsDone({ commit }, task) {
  return axios
    .post(`/tasks/${task.id}/done`)
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_TASK, data);
      }
      return success;
    })
    .catch(() => false);
}

export function fetchTasks({ commit }) {
  return axios
    .get('/tasks')
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_TASKS, data);
      }
      return success;
    })
    .catch(() => false);
}

export function updateTask({ commit }, task) {
  return axios
    .put(`/tasks/${task.id}`, task)
    .then(({ data: { success, data, message } }) => {
      if (success) {
        commit(SAVE_TASK, data);
      }
      return { success, message };
    })
    .catch(({ success, message }) => Promise.reject({ success, message }));
}

export function deleteTask({ commit }, task) {
  const id = typeof task === 'object' ? task.id : task;
  return axios
    .delete(`/tasks/${id}`)
    .then(() => {
      commit(DELETE_TASK, id);
      return true;
    })
    .catch(({ success, message }) => Promise.reject({ success, message }));
}

export function updateSchedule({ commit }, schedule) {
  return axios
    .put(`/tasks/update_schedule/${schedule.id}`)
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_SCHEDULE, data);
      }
      return success;
    })
    .catch(() => false);
}
