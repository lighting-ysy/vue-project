<template>
    <el-form ref="formRef">
        <el-form-item>
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { reactive, ref } from 'vue'
const formRef = ref(null)
const form = reactive({
    username: '',
    password: ''
})

</script>