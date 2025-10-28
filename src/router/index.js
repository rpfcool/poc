import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GraficoView from '@/views/GraficoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Kanban' }
    },
    {
      path: '/grafico',
      name: 'grafico',
      component: GraficoView,
      meta: { title: 'Gráfico de Burndown' }
    }
  ],
})

export default router
