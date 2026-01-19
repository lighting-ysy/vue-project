<template>
    <div>child</div>
    <button @click="count++">{{ count }}</button>
</template>
<script setup>
    const count = ref(0)
</script>