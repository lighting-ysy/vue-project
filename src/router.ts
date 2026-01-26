import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/home.vue')},//logicflow
  { path: '/index', component: () => import('@/pages/index.vue') },
  { path: '/pdf', component: () => import('@/pages/pdfExtractor.vue') },
  { path: '/pdfFile', component: () => import('@/pages/pdfFile.vue') },
  { path: '/fileComponent', component: () => import('@/pages/fileComponent.vue'), meta:{title:"合同填写"} },
  { path: '/projectShow', component: () => import('@/pages/projectShow.vue'), meta:{title:"测试"} }] //工作流

const router = createRouter({
  history: createWebHistory(),
  //history: createWebHashHistory(),
  routes,
})
router.beforeEach((to, _from, next) => {

    document.title = to.meta.title? String(to.meta.title) : '未命名'

  next()
})
export { router }
