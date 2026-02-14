import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'campaigns',
      component: () => import('../views/CampaignList.vue')
    },
    {
      path: '/campaigns/new',
      name: 'campaign-create',
      component: () => import('../views/CampaignForm.vue')
    },
    {
      path: '/campaigns/:id',
      name: 'campaign-detail',
      component: () => import('../views/CampaignDetail.vue')
    },
    {
      path: '/campaigns/:id/edit',
      name: 'campaign-edit',
      component: () => import('../views/CampaignForm.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
