import { createRouter, createWebHistory } from 'vue-router';
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("/@/views/Home.vue"),
    mate: {
        isCore: true
    },
    children: [     
        {
            path: '/button',
            name: 'button',
            component: () => import("/@/core/button.vue"),
            mate: {
                en_name: 'button',
                zh_name: '按钮'
            }
        },
        {
            path: '/input',
            name: 'input',
            component: () => import("/@/core/input.vue"),
            mate: {
                en_name: 'input',
                zh_name: '输入框'
            }
        }
    ]
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
