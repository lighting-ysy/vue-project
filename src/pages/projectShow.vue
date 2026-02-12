<template>
  <input v-model="title" />
  <input v-model="form.name" />
  <div class="dashboard-card">
    <div class="dashboard-title">{{ title }}</div>
    <div class="dashboard-title">{{ form.name }}</div>
    <slot name="subtitle"></slot>
  </div>
  <ChildOne @button-click="(n: any) => { console.log(n) }" :size="300" class="button_1"
    :data="[{ number: 1, date: '2022-01-01' }, { number: 2, date: '2022-01-02' }]"><template #default="data">{{
      data.number }}{{
        data.date }}</template>
    <template #info="i">{{ i.number }}--{{ i.date }}
      <hr />
    </template>
  </ChildOne>
  <el-button @click="exportPdf">导出PDF</el-button>
  <div id="exportContent">
    <!-- <Docx></Docx> 这里放置要导出的HTML内容 -->
     <span>content</span>
  </div>

  <Child :data="[{ number: 1, date: '2022-01-01' }, { number: 2, date: '2022-01-02' }]" class="button_3"></Child>
  <div>{{ datax }}</div>
</template>

<script lang="ts" setup>

import { reactive, ref, watch, useAttrs, watchEffect, provide, getCurrentInstance,onMounted } from 'vue'
import ChildOne from '@/components/ChildOne.vue'
import Child from '@/components/Child.vue'
import {getPdf} from './htmlToPdf.js'
const attrs = useAttrs()//除去props外的其他参数
//console.log(attrs)
const title = ref('')
const form = reactive({
  name: '',
})
const datax = ref(0)
let timer:any = null // 存储定时器标识，用于清除

function countNum() {
  // 重置计数器（避免重复调用时数值叠加）
  datax.value = 0
  // 先清除可能存在的旧定时器，防止多个定时器同时运行
  if (timer) clearInterval(timer)
  
  let count = 0 // 记录已递增的次数
  // 每1秒执行一次
  timer = setInterval(() => {
    datax.value++
    count++
    // 达到3600次时清除定时器，停止递增
    if (count >= 3600) {
      clearInterval(timer)
      timer = null // 清空标识
    }
  }, 1000)
}
//直接赋值
// const data1 = ref({
//   name: 'John',
//   age: 30,
//   nickName:['John1','John2','John3']
// })
// const data2 = data1.value
// data2.name = 'Mike'
// data2.nickName[1] = 'Mike2'
// console.log(data1.value)
// console.log(data2)
//浅拷贝
// const data1 = ref({
//   name: 'John',
//   age: 30,
//   nickName:['John1','John2','John3']
// })
// const data2 = Object.assign({}, data1.value)
// data2.name = 'Mike'
// data2.nickName[1] = 'Mike2'
// console.log(data1.value)
// console.log(data2)
//深拷贝
// const data1 = ref({
//   name: 'John',
//   age: 30,
//   nickName:['John1','John2','John3']
// })
// const data2 = ref(JSON.parse(JSON.stringify(data1.value)))
// data2.value.name = 'Mike'
// data2.value.nickName[1] = 'Mike2'
// console.log(data1.value)
// console.log(data2.value)
const data1 = ref({
  name: 'John',
  age: 30,
  nickName: ['John1', 'John2', 'John3']
})

const data2 = JSON.parse(JSON.stringify(data1.value))
data2.name = 'Mike'
data2.nickName[1] = 'Mike2'
//console.log(data1.value)
//console.log(data2)
watch(() => title.value, (newValue) => {
  //console.log(newValue)
})
watch(() => form.name, (newValue) => {
  //console.log(newValue)
})
watchEffect(() => {
  //console.log('data1:', data1.value)
  //console.log('data2:', data2)
  //console.log('title:', title.value)
})


const f1 = ref()
const function1 = (a: any, f: any) => {
  //console.log('f1', a)
  f1.value = f
  f1.value(a)
}

const function2 = (a: any) => {
  //console.log('f2', a)
}
function1('hello', function2)
provide('message', 'hello')
const instance = getCurrentInstance()
//console.log('instance', instance)

const exportPdf = () => {
  getPdf("exportContent","htmlToPdf")
}
onMounted(() => {
  countNum()
})
</script>
<style scoped>
.dashboard-card {
  display: grid;
}

.button_1 {
  background-color: rgb(227, 227, 236);
}
</style>