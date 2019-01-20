import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Profile from '@/components/Profile';
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
      }
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
      next({ name: 'Login', query: { to: to.fullPath } });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.authRoute)) {
    const token = store.getters.token;
    if (token.length) { // authenticated? Send user away from here
      next({ name: 'Profile' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
