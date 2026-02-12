<template>
    <div style="background-image: url('c.png'); background-size: cover;width:300px">
        <el-form ref="formRef" :model="form">
            <el-form-item label="用户名：" label-width="70px">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码：" label-width="70px">
                <el-input v-model="form.password" placeholder="请输入密码" type="password" />
            </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: center;">
            <el-button type="default" @click="handleSubmit">load</el-button>
        </div>
    </div>

</template>
<script setup>
import { reactive, ref } from 'vue'
const formRef = ref(null)
const form = reactive({
    username: '',
    password: ''
})
const handleSubmit = () => {
    console.log(formRef.value)
}
</script>