import axios from 'axios';
import {
  SAVE_USER,
  SAVE_TOKEN,
  SAVE_TASKS,
  SAVE_TASK,
  DELETE_TASK,
  SAVE_SCHEDULE
} from './mutation-types';

export function saveTask({ commit }, task) {
  if (!task) return;

  commit(SAVE_TASK, task);
}

export function removeTask({ commit }, task) {
  if (!task) return;

  commit(DELETE_TASK, typeof task === 'object' ? task.id : task);
}

export function saveSchedule({ commit }, schedule) {
  if (!schedule) return;

  commit(SAVE_SCHEDULE, schedule);
}

export function saveUser({ commit }, user) {
  if (!user) return;

  commit(SAVE_USER, user);
}

export function fetchProfile(state) {
  return axios
    .get('/profile')
    .then(({ data: { success, data } }) => {
      if (success) saveUser(state, data);

      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function updateProfile(state, payload) {
  return axios
    .put('/profile', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) saveUser(state, data);
      
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function changePassword(_, payload) {
  return axios
    .post('/change_password', payload)
    .then(({ data: { success, message } }) => ({ success, message }))
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function signup(state, payload) {
  return axios
    .post('/signup', payload)
    .then(({ data: { success, data, token: { token } } }) => {
      if (success) {
        saveUser(state, data);
        state.commit(SAVE_TOKEN, token);
      }

      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function authenticate(state, payload) {
  return axios
    .post('/authenticate', payload)
    .then(({ data: { success, data, token: { token } } }) => {
      if (success) {
        state.commit(SAVE_TOKEN, token);
        saveUser(state, data);
      }
      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
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
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function deleteUser({ commit }) {
  commit(SAVE_USER, {});
  commit(SAVE_TOKEN, '');
  commit(SAVE_TASKS, []);
}

export function createTask(state, payload) {
  return axios
    .post('/tasks', payload)
    .then(({ data: { success, data, message } }) => {
      if (success) {
        saveTask(state, data);
      }
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function markTaskAsDone(state, task) {
  return axios
    .post(`/tasks/${task.id}/done`)
    .then(({ data: { success, data } }) => {
      if (success) {
        saveTask(state, data);
      }
      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
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
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function fetchTask(state, taskId) {
  return axios
    .get(`/public/tasks/${taskId}`)
    .then(({ data: { success, data } }) => {
      if (success) saveTask(state, data);
      
      return { success, data };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function updateTask(state, task) {
  return axios
    .put(`/tasks/${task.id}`, task)
    .then(({ data: { success, data, message } }) => {
      if (success) saveTask(state, data);
      
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function deleteTask(state, task) {
  const id = typeof task === 'object' ? task.id : task;
  return axios
    .delete(`/tasks/${id}`)
    .then(() => {
      removeTask(state, id);
      return true;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function archiveTask(state, task) {
  const id = typeof task === 'object' ? task.id : task;
  return axios
    .post(`/tasks/${id}/archive`)
    .then(({ data: { success, data, message } }) => {
      if (success) saveTask(state, data);
      
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function restoreTask(state, task) {
  const id = typeof task === 'object' ? task.id : task;
  return axios
    .post(`/tasks/${id}/restore`)
    .then(({ data: { success, data, message } }) => {
      if (success) saveTask(state, data);
      
      return { success, message };
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}

export function updateSchedule(state, schedule) {
  return axios
    .put(`/tasks/schedules/${schedule.id}`, schedule)
    .then(({ data: { success, data } }) => {
      if (success) {
        saveSchedule(state, data);
      }
      return success;
    })
    .catch(({ response: { data } }) => Promise.reject(data));
}
