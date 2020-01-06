import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Login = () => import('@/components/Login');
const Signup = () => import('@/components/Signup');
const Forgot = () => import('@/components/Forgot');
const Reset = () => import('@/components/Reset');
const Profile = () => import(/* webpackChunkName: "group-profile" */ '@/components/Profile');
const Tasks = () => import(/* webpackChunkName: "group-profile" */ '@/components/Tasks');
const CreateTask = () => import('@/components/CreateTask');
const TaskReport = () => import('@/components/TaskReport');
const PublicTaskReport = () => import('@/components/PublicTaskReport');

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
      path: '/app/t/:id',
      name: 'PublicTaskReport',
      component: PublicTaskReport,
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
          path: 'create',
          name: 'CreateTask',
          component: CreateTask
        },
        {
          path: 't/:id',
          name: 'TaskReport',
          component: TaskReport
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
