
const { Socket } = require('phoenix-channels');

export default function initSocket(store) {
  const user = store.getters.user;
  const token = store.getters.token;

  if (!token.length) return;

  const socket = new Socket(process.env.WS_HOST, { params: { token } });
  socket.connect();

  const channel = socket.channel(`user:${user.id}`, {});

  channel.on('habit_created', ({ habit }) => {
    store.dispatch('saveHabit', habit);
  });

  channel.on('habit_updated', ({ habit }) => {
    store.dispatch('saveHabit', habit);
  });

  channel.on('habit_deleted', ({ habit }) => {
    store.dispatch('removeHabit', habit);
  });

  // channel.on('user_updated', ({ user }) => {
  //   if (user.id === store.getters.user.id) store.dispatch('saveUser', user);
  // });

  channel.join()
    .receive('ok', (resp) => { 
      console.info('Joined successfully', resp);
    })
    .receive('error', (resp) => { 
      console.warn('Unable to join', resp);
    });
}
