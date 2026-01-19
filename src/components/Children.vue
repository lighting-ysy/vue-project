<template>
    <div>2
    </div>
</template>
<script setup>
import {inject} from 'vue'
const message = inject('message')
console.log(message)
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

console.log(props.data)
</script>
<style >
</style>