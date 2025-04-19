import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'RoleSelection',
    component: () => import('@/views/RoleSelection.vue')
  },
  {
    path: '/family-tree/:id?',
    name: 'FamilyTree',
    component: () => import('@/views/FamilyTree.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 