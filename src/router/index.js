import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('views/index.vue')
const Home = () => import('views/home.vue')
const Blogs = () => import('views/blogs.vue')
const Community = () => import('views/community.vue')
const Login = () => import('views/login.vue')
const ArticleDetail = () => import('views/articleDetail.vue')
const Personal = () => import('views/personal.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    component: Index,
    redirect: '/home',
    children: [
      { path: '/home', component: Home },
      { path: '/blogs', component: Blogs },
      { path: '/community', component: Community },
      { path: '/article/:id', name: 'article', component: ArticleDetail },
      { path: '/personal/:id', name: 'personal', component: Personal },
    ]
  },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.localStorage.getItem("tokenValue")
  if (!tokenStr) return next('/login')
  next()
})

export default router
