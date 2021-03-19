// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
  abort,
} from '@/util/routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      route('首页', { default: 'Dashboard' }),
      route('用户管理', { default: 'User' }, 'user'),
    ]),
    layout('Fullscreen', [
      route('登录', { default: 'Login' }, 'login'),
    ]),
    layout('Default', [
      abort('Error'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.path.endsWith('/')) return next(trailingSlash(to.path))
  const token = localStorage.getItem('lys@Authorization')
  if (to.path.includes('login')) {
    return token ? next(to.query.redirectUrl) : next()
  }
  if (!token) return next('/login/?redirectUrl=' + to.path)
  next()
})

export default router
