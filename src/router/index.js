import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/views/Layout/index.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: 'category/:id',
          component: () => import('@/views/Category/index.vue')
        },
        {
          path: 'category/sub/:id',
          component: () => import('@/views/SubCatgory/index.vue')
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/Detail/index.vue')
        },
        {
          path: 'cartlist',
          component: () => import('@/views/CartList/index.vue')
        },
        {
          path: 'checkout',
          meta: { requiresAuth: true },
          component: () => import('@/views/Checkout/index.vue')
        },
        {
          path: 'pay',
          meta: { requiresAuth: true },
          component: () => import('@/views/Pay/index.vue')
        },
        {
          path: 'payback',
          meta: { requiresAuth: true },
          component: () => import('@/views/Pay/PayBack.vue')
        },
        {
          path: 'member',
          meta: { requiresAuth: true },
          redirect: '/member/user',
          component: () => import('@/views/Member/index.vue'),
          children: [
            {
              path: 'user',
              component: () => import('@/views/Member/components/UserInfo.vue')
            },
            {
              path: 'order',
              component: () => import('@/views/Member/components/UserOrder.vue')
            }
          ]
        },
        {
          path: ':pathMatch(.*)*',
          component: () => import('@/views/NotFound.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useUserStore().userInfo.token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
