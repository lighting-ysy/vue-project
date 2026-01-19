<template>
  <input v-model="title" />
  <input v-model="form.name" />
  <div class="dashboard-card">
    <div class="dashboard-title">{{ title }}</div>
    <div class="dashboard-title">{{ form.name }}</div>
    <slot name="subtitle"></slot>
  </div>
  <ChildOne @button-click="(n: any) => { console.log(n) }" :size="300" class="button_1"
    :data="[{ number: 1, date: '2022-01-01' }, { number: 2, date: '2022-01-02' }]"><template #default="data">{{ data.number }}{{
      data.date }}</template>
    <template #info="i">{{ i.number }}--{{ i.date }}
      <hr />
    </template>
  </ChildOne>
  <Docx></Docx>
  <Child :data="[{ number: 1, date: '2022-01-01' }, { number: 2, date: '2022-01-02' }]" class="button_3"></Child>
</template>

<script lang="ts" setup>

import { reactive, ref, watch, useAttrs, watchEffect, provide, getCurrentInstance } from 'vue'
import ChildOne from '@/components/ChildOne.vue'
import Child from '@/components/Child.vue'
import Docx from '@/components/Docx.vue'
import { store } from '@/store.js'
console.log(store.count)
const attrs = useAttrs()
console.log(attrs)
const title = ref('')
const form = reactive({
  name: '',
})
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
console.log(data1.value)
console.log(data2)
watch(() => title.value, (newValue) => {
  console.log(newValue)
})
watch(() => form.name, (newValue) => {
  console.log(newValue)
})
watchEffect(() => {
  console.log('data1:', data1.value)
  console.log('data2:', data2)
  console.log('title:', title.value)
})


const f1 = ref()
const function1 = (a: any, f: any) => {
  console.log('f1', a)
  f1.value = f
  f1.value(a)
}

const function2 = (a: any) => {
  console.log('f2', a)
}
function1('hello', function2)
provide('message', 'hello')
const instance = getCurrentInstance()
console.log('instance', instance)
</script>
<style scoped>
.dashboard-card {
  display: grid;
}

.button_1 {
  background-color: rgb(227, 227, 236);
}
</style>