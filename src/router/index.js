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
        requiresAuth: false
      }
    },
    {
      path: '/app/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        requiresAuth: false
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
    const user = store.getters.user;

    if (!user.token) { // Not authenticated? Send user to login
      next({ name: 'Login', query: { to: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
