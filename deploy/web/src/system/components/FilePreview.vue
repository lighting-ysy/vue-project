<template>
  <div class="word-preview">
    <!-- 上传区域 -->
    <div class="upload-area">
      <button class="upload-btn" @click="selectFile">选择 Word(.docx) 文件</button>
      <div v-if="fileName" class="file-tip">已选择：{{ fileName }}</div>
    </div>

    <!-- 预览内容 -->
    <div class="preview-box" v-if="htmlContent">
      <div class="preview-title">文档预览</div>
      <div class="preview-content" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import mammoth from 'mammoth'

const emit = defineEmits(['change'])

const fileName = ref('')
const htmlContent = ref('')

// 选择文件（H5）
const selectFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.docx'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    fileName.value = file.name
    await parseDocx(file)
    emit('change', { name: fileName.value, content: htmlContent.value })
  }
  input.click()
}

// 解析docx
const parseDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const res = await mammoth.convertToHtml({ arrayBuffer })
  htmlContent.value = res.value
}
</script>

<style scoped>
.word-preview {
  width: 100%;
  font-family: sans-serif; /* 增加基础字体，提升预览体验 */
}
.upload-area {
  margin-bottom: 20px;
}
.upload-btn {
  background: #007aff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer; /* 增加鼠标悬停手势 */
}
.file-tip {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}
.preview-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 增加阴影，提升层次感 */
}
.preview-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
.preview-content {
  line-height: 1.8;
  font-size: 16px;
}
</style>