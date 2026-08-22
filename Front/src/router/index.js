import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const LoginView = () => import('../views/LoginView.vue')
const HomeView = () => import('../views/HomeView.vue')
const BlueExhibitionView = () => import('../views/BlueExhibitionView.vue')
const BuildingTourView = () => import('../views/BuildingTourView.vue')
const KnowledgeGraph = () => import('../views/KnowledgeGraph.vue')
const LanranKnowledgeGraph = () => import('../views/LanranKnowledgeGraph.vue')
const DJLKnowledgeGraph = () => import('../views/DJLKnowledgeGraph.vue')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, role: 'user' },
      children: [
        {
          path: 'blue-exhibition',
          name: 'blueExhibition',
          component: BlueExhibitionView
        },
        {
          path: 'building-tour',
          name: 'buildingTour',
          component: BuildingTourView
        }
      ]
    },
    {
      path: '/knowledge-graph',
      name: 'knowledgeGraph',
      component: KnowledgeGraph,
      meta: { requiresAuth: true, role: 'researcher' },
      children: [
        {
          path: 'lanran-knowledge-graph',
          name: 'lanranKnowledgeGraph',
          component: LanranKnowledgeGraph
        },
        {
          path: 'djl-knowledge-graph',
          name: 'djlKnowledgeGraph',
          component: DJLKnowledgeGraph
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.isInitialized) {
    userStore.initialize()
  }

  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      next({ name: 'login' })
      return
    }

    if (to.meta.role && to.meta.role !== userStore.userRole) {
      if (userStore.userRole === 'user') {
        next({ name: 'home' })
      } else if (userStore.userRole === 'researcher') {
        next({ name: 'knowledgeGraph' })
      } else {
        next({ name: 'login' })
      }
      return
    }

    next()
    return
  }

  if (to.name === 'login' && userStore.isLoggedIn) {
    if (userStore.userRole === 'user') {
      next({ name: 'home' })
    } else if (userStore.userRole === 'researcher') {
      next({ name: 'knowledgeGraph' })
    } else {
      next()
    }
    return
  }

  next()
})

export default router
