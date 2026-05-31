import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView // Головна (Про магазин)
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('../views/ShopView.vue') // Магазин (Книги)
  },
  {
    path: '/print',
    name: 'print',
    component: () => import('../views/PrintView.vue') // Поліграфія
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../views/GameView.vue') // Гра Таро
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue') // Кошик
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue') // Замовлення
  },
  {
  path: '/reviews',
  name: 'reviews',
  component: () => import('../views/ReviewsView.vue') // Відгуки
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router