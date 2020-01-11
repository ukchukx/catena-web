
const ws = window.adonis.Ws(process.env.WS_HOST, { reconnectionAttempts: 30 });

export default function initSocket(store) {
  if (!store.getters.token.length) return;

  ws.withJwtToken(store.getters.token).connect();

  if (ws.getSubscription('users')) return;

  const usersSubscription = ws.subscribe('users');

  usersSubscription.on('task_created', ({ task }) => {
    if (task.user_id === store.getters.user.id) store.dispatch('saveTask', task);
  });

  usersSubscription.on('task_updated', ({ task }) => {
    if (task.user_id === store.getters.user.id) store.dispatch('saveTask', task);
  });

  usersSubscription.on('task_deleted', ({ task }) => {
    if (task.user_id === store.getters.user.id) store.dispatch('removeTask', task);
  });

  usersSubscription.on('schedule_updated', ({ schedule }) => {
    if (schedule.user_id === store.getters.user.id) store.dispatch('saveSchedule', schedule);
  });

  usersSubscription.on('user_updated', ({ user }) => {
    if (user.id === store.getters.user.id) store.dispatch('saveUser', user);
  });
}
