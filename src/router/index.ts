import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("/@/views/Home.vue"),
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
