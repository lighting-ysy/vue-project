import { createWebHistory, createRouter } from 'vue-router'
const list:any = import.meta.glob([
  './login/**/*.vue','./pages/**/*.vue',
  
])
const routes:Array<any> = [] //工作流
Object.keys(list).forEach((key:any) => {
  const path = key.match(/\.\/(.+)\.vue$/)[1]//0:完整内容;1:捕获组内容
  const component = list[key]
  routes.push({ path: '/'+path.split('/')[1], component: component, meta:{title:path.split('/').pop()} })
})
console.log(routes)
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
