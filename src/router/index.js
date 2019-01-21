import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Profile from '@/components/Profile';
import Tasks from '@/components/Tasks';
import CreateTask from '@/components/CreateTask';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/app/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
        authRoute: true
      }
    },
    {
      path: '/app/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        requiresAuth: false,
        authRoute: true
      }
    },
    {
      path: '/app/me',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'Tasks',
          component: Tasks
        },
        {
          path: 'create-task',
          name: 'CreateTask',
          component: CreateTask
        }
      ]
    },
    {
      path: '/*',
      redirect: { name: 'Login' }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = store.getters.token;

    if (!token.length) { // Not authenticated? Send user to login
      next({ name: 'Login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.authRoute)) {
    const token = store.getters.token;
    if (token.length) { // authenticated? Send user away from here
      next({ name: 'Tasks' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
