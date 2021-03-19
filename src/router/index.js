import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Login = () => import(/* webpackChunkName: "auth" */ '@/components/Login');
const Signup = () => import(/* webpackChunkName: "auth" */ '@/components/Signup');
const Forgot = () => import(/* webpackChunkName: "auth" */ '@/components/Forgot');
const Reset = () => import(/* webpackChunkName: "auth" */ '@/components/Reset');
const Profile = () => import('@/components/Profile');
const DueHabits = () => import('@/components/DueHabits');
const Habits = () => import('@/components/Habits');
const CreateHabit = () => import('@/components/CreateHabit');
const UpdateHabit = () => import('@/components/UpdateHabit');
const HabitReport = () => import('@/components/HabitReport');
const PublicHabitReport = () => import('@/components/PublicHabitReport');

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
      path: '/app/forgot',
      name: 'Forgot',
      component: Forgot,
      meta: {
        requiresAuth: false,
        authRoute: true
      }
    },
    {
      path: '/app/reset',
      name: 'Reset',
      component: Reset,
      meta: {
        requiresAuth: false,
        authRoute: true
      }
    },
    {
      path: '/app/habits/:id/view',
      name: 'PublicHabitReport',
      component: PublicHabitReport,
      meta: {
        requiresAuth: false,
        authRoute: false
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
      path: '/app/today',
      name: 'DueHabits',
      component: DueHabits,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/habits',
      name: 'Habits',
      component: Habits,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/habits/create',
      name: 'CreateHabit',
      component: CreateHabit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/habits/:id/edit',
      name: 'UpdateHabit',
      component: UpdateHabit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/habits/:id',
      name: 'HabitReport',
      component: HabitReport,
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
      next({ name: 'Login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.authRoute)) {
    const token = store.getters.token;
    if (token.length) { // authenticated? Send user away from here
      next({ name: 'DueHabits' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
