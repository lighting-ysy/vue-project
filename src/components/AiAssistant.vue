<template>
  <div class="right-panel">
    <!-- 顶部标题 -->
    <div class="ai-header">
      <h4>AI辅助诊断</h4>
      <p>中西医结合智能助手</p>
    </div>

    <!-- 欢迎卡片 -->
    <el-card shadow="hover" class="welcome-card">
      <div class="icon-container">
        <!-- 这里使用 Element Plus 图标模拟医疗图标 -->
        <el-icon :size="40" color="#409eff"><MedicineBottle /></el-icon>
      </div>
      <div class="welcome-text">
        <strong>欢迎使用AI辅助诊断系统</strong>
        <p>点击左侧患者信息或中部诊断区域，获取相关AI辅助建议</p>
      </div>
    </el-card>

    <!-- 功能列表 -->
    <div class="function-list">
      <div class="section-title">AI辅助功能</div>

      <!-- 功能项 1 -->
      <div class="func-item">
        
        <el-button type="primary" size="small" round @click="handleFuncClick('auxiliaryDiagnosis')">辅助诊断</el-button>
      </div>

      <!-- 功能项 2 -->
      <div class="func-item">
        
        <el-button type="primary" size="small" round @click="handleFuncClick('treatmentRecommendation')">治疗建议与用药推荐</el-button>
      </div>

      <!-- 功能项 3 -->
      
    </div>
  </div>
</template>

<script setup>
//import { MedicineBottle, Brain, Food, Microscope } from '@element-plus/icons-vue'
const emit = defineEmits(['function-click'])

// 2. 处理按钮点击，向父组件传递对应的标识
const handleFuncClick = (actionType) => {
  emit('function-click', actionType)
}
</script>

<style scoped>
.right-panel {
  padding: 15px;
  background-color: #f5f7fa; /* 稍微深一点的背景色区分 */
  height: 100%;
  overflow-y: auto;
}

.ai-header {
  text-align: center;
  margin-bottom: 20px;
}

.ai-header h4 {
  margin: 0;
  color: #333;
}

.ai-header p {
  margin: 5px 0 0;
  color: #999;
  font-size: 12px;
}

.welcome-card {
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
  border: none;
  background: linear-gradient(180deg, #eef1f6 0%, #fff 100%);
}

.icon-container {
  margin-bottom: 10px;
}

.welcome-text p {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  margin-bottom: 15px;
  color: #333;
}

.func-item {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.func-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.func-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.func-info .el-icon {
  font-size: 24px;
  color: #409eff;
}

.text .title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.text .desc {
  font-size: 12px;
  color: #999;
}
</style>