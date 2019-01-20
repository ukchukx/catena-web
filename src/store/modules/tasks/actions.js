import axios from 'axios';
import {
  SAVE_USER,
  SAVE_TOKEN,
  DELETE_USER,
  DELETE_TOKEN,
  SAVE_TASKS,
  SAVE_TASK,
  DELETE_TASK,
  SAVE_SCHEDULE
} from './mutation-types';

export function fetchProfile({ commit }) {
  axios
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
  axios
    .post('/update_profile', payload)
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_USER, data);
      }
      return success;
    })
    .catch(() => false);
}

export function changePassword(store, payload) {
  axios
    .post('/change_password', payload)
    .then(({ data: { success } }) => success)
    .catch(() => false);
}

export function signup({ commit }, payload) {
  axios
    .post('/signup', payload)
    .then(({ data: { success, data, token } }) => {
      if (success) {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
      }
      return success;
    })
    .catch(() => false);
}

export function authenticate({ commit }, payload) {
  axios
    .post('/authenticate', payload)
    .then(({ data: { success, data, token } }) => {
      if (success) {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
      }
      return success;
    })
    .catch(() => false);
}

export function deleteUser({ commit }) {
  commit(DELETE_USER);
  commit(DELETE_TOKEN);
}

export function createTask({ commit }, payload) {
  axios
    .post('/tasks', payload)
    .then(({ data: { success, data, token } }) => {
      if (success) {
        commit(SAVE_TASK, data);
      }
      return success;
    })
    .catch(() => false);
}

export function markTaskAsDone({ commit }, task) {
  axios
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
  axios
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
  axios
    .put(`/tasks/${task.id}`, task)
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_TASK, data);
      }
      return success;
    })
    .catch(() => false);
}

export function deleteTask({ commit }, task) {
  const id = typeof task === 'object' ? task.id : task;
  axios
    .delete(`/tasks/${id}`)
    .then(() => {
      commit(DELETE_TASK, id);
      return true;
    })
    .catch(() => false);
}

export function updateSchedule({ commit }, schedule) {
  axios
    .put(`/tasks/update_schedule/${schedule.id}`)
    .then(({ data: { success, data } }) => {
      if (success) {
        commit(SAVE_SCHEDULE, data);
      }
      return success;
    })
    .catch(() => false);
}
