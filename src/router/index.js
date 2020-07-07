import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    meta: { title: '首页' },
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('../components/Welcome'),
        meta: { title: '欢迎' }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../components/users/Users'),
        meta: { title: ['用户管理', '用户列表'] }
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('../components/power/Rights'),
        meta: { title: ['权限管理', '权限列表'] }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('../components/power/Roles'),
        meta: { title: ['权限管理', '角色列表'] }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 登录页直接放行
  if (to.path === '/login') return next()
  // 获取报存的token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token，执行登录操作
  if (!tokenStr) return next('/login')
  // 已登录，直接放行
  next()
})

export default router
