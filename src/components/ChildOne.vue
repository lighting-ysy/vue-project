<template>
    <div v-bind="$attrs" ><button @click="fun2">
            <slot :number="10" :date="new Date()"></slot>
        </button>
        <ul>
            <li v-for="i in props.data" :key="i">
                <slot name="for" v-bind="i"></slot>
            </li>
        </ul>
    </div>
</template>
<script setup>
    import {store} from '../store'
import { useAttrs } from 'vue'
const emits = defineEmits(['button-click'])
const fun2 = () =>{
    emits('button-click',10)
    store.fun1()
}
const formData = new URLSearchParams()
console.log('formData',formData)

const props = defineProps({
    data: {
        type: Array,
        default: []
    },
    size: {
        type: Number,
        default: 10
    }
})
const attrs = useAttrs()
console.log('attrs',attrs)
console.log(props.data)
</script>
<style scoped >
.button_2 {
    background-color: red;
}
</style>