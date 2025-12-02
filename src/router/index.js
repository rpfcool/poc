import { createRouter, createWebHistory } from 'vue-router'
import KanbanView from '../views/KanbanView.vue'
import BurndownView from '@/views/BurndownView.vue'
import VelocityView from '@/views/VelocityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'kanban',
      component: KanbanView,
      meta: { title: 'Kanban' }
    },
    {
      path: '/burndown',
      name: 'burndown',
      component: BurndownView,
      meta: { title: 'Gráfico de Burndown' }
    },
    {
      path: '/velocity',
      name: 'velocity',
      component: VelocityView,
      meta: { title: 'Gráfico de Velocidade da Sprint' }
    }
  ],
})

export default router
