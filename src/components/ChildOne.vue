<template>
  <div v-bind="$attrs">
    <button @click="fun2">
      <!-- 默认插槽：绑定number、date，date做字符串格式化，避免父组件显示对象 -->
      <slot :number="10" :date="new Date().toLocaleDateString()"></slot>
    </button>
    <ul>
      <!-- v-for遍历：绑定唯一key + 强类型推导，i的类型不再是any -->
      <li v-for="i in props.data" :key="i.number">
        <!-- 命名插槽info：解构绑定当前遍历项的所有属性(number+date) -->
        <slot name="info" v-bind="i"></slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { store } from '@/store.js'
import { useAttrs } from 'vue'
import type { PropType } from 'vue' // 必须引入，用于数组复杂类型声明

// ✅ 【核心修复】给props声明严格的TS类型，指定data数组的具体结构
const props = defineProps({
  data: {
    // 声明data是：数组，每一项必须包含 number(number类型) + date(string类型)
    type: Array as PropType<Array<{ number: number; date: string }>>,
    default: () => [] // 数组的默认值推荐写函数，避免引用类型污染
  },
  size: {
    type: Number,
    default: 10
  }
})

// 声明自定义事件，指定参数类型为number，更严谨
const emits = defineEmits<{
  (e: 'button-click', val: number): void
}>()

const fun2 = () => {
  emits('button-click', 10)
  store.fun1()
}

const formData = new URLSearchParams()
console.log('formData', formData)

const attrs = useAttrs()
console.log('attrs', attrs)
console.log(props.data)
</script>

<style scoped>
.button_2 {
  background-color: red;
}
</style>