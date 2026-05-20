<template>
  <div class="app-container">
    <!-- 左侧：固定宽度 -->
    <div class="layout-left">
      <PatientList @select="handlePatientSelect" />
    </div>

    <!-- 中部：自适应宽度 -->
    <div class="layout-center">
      <MedicalRecordForm />
    </div>

    <!-- 右侧：固定宽度 -->
    <div class="layout-right">
      <AiAssistant />
    </div>
  </div>
</template>

<script setup>
import PatientList from '@/components/PatientList.vue'
import MedicalRecordForm from '@/components/MedicalRecordForm.vue'
import AiAssistant from '@/components/AiAssistant.vue'

const handlePatientSelect = (id) => {
  console.log('切换到患者ID:', id)
  // 这里可以添加加载患者数据的逻辑
}
</script>

<style scoped>
/* 整体布局容器 */
.app-container {
  display: flex;
  height: 100vh; /* 占满整个视口高度 */
  width: 100vw;  /* 占满整个视口宽度 */
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

/* 左侧区域样式 */
.layout-left {
  width: 260px; /* 左侧固定宽度 */
  flex-shrink: 0; /* 防止被压缩 */
  border-right: 1px solid #dcdfe6;
  background-color: #fff;
}

/* 中间区域样式 */
.layout-center {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  background-color: #f0f2f5; /* 给中间区域一个浅灰背景，突出白色卡片 */
  overflow-y: auto;
}

/* 右侧区域样式 */
.layout-right {
  width: 340px; /* 右侧固定宽度 */
  flex-shrink: 0;
  background-color: #fff;
  border-left: 1px solid #dcdfe6;
}
</style>