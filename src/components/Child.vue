<template>
    <div>1<Children></Children>
    </div>
    
</template>
<script setup>
    import Children from './Children.vue'
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