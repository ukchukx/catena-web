import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Login = () => import(/* webpackChunkName: "auth" */ '@/components/Login');
const Signup = () => import(/* webpackChunkName: "auth" */ '@/components/Signup');
const Forgot = () => import(/* webpackChunkName: "auth" */ '@/components/Forgot');
const Reset = () => import(/* webpackChunkName: "auth" */ '@/components/Reset');
const Profile = () => import('@/components/Profile');
const DueTasks = () => import('@/components/DueTasks');
const Tasks = () => import('@/components/Tasks');
const CreateTask = () => import('@/components/CreateTask');
const UpdateTask = () => import('@/components/UpdateTask');
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
      path: '/app/t/:id/view',
      name: 'PublicTaskReport',
      component: PublicTaskReport,
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
      path: '/app/tasks/today',
      name: 'DueTasks',
      component: DueTasks,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/tasks',
      name: 'Tasks',
      component: Tasks,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/tasks/create',
      name: 'CreateTask',
      component: CreateTask,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/t/:id/edit',
      name: 'UpdateTask',
      component: UpdateTask,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/app/t/:id',
      name: 'TaskReport',
      component: TaskReport,
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
      next({ name: 'Tasks' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
