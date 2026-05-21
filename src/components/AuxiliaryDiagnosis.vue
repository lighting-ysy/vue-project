<template>
  <!-- 移除了 el-row 和 el-col，直接作为右侧面板容器 -->
  <div class="right-analysis-panel">
    <div class="panel-header">
      <h3>检查指标</h3>
    </div>
    
    <div class="panel-body">
      <!-- 感染分类高亮框 -->
      <div class="highlight-box infection">
        <span class="icon">🦠</span>
        <span class="label">感染</span>
        <el-tag type="success" size="small" effect="dark" class="rate-tag">匹配率: 93.21%</el-tag>
      </div>

      <!-- 具体疾病 -->
      <div class="disease-item">
        <span class="arrow">▼</span>
        <span class="name">急性胰腺炎</span>
        <span class="rate">匹配率: 28.79%</span>
      </div>

      <hr />

      <!-- 症状列表 -->
      <div class="symptoms-section">
        <h4>表现</h4>
        <div class="symptom-list">
          <div class="symptom-item" v-for="(item, index) in symptoms" :key="index">
            <el-tag v-if="item.matched" type="success" size="small" effect="plain">匹配</el-tag>
            <span class="symptom-name">{{ item.name }}</span>
            <span class="symptom-rate">匹配率: {{ item.rate }}</span>
          </div>
        </div>
      </div>

      <hr />

      <!-- 检查列表 -->
      <div class="checks-section">
        <h4>检查</h4>
        <div class="check-list">
          <div class="check-item" v-for="(item, index) in checks" :key="index">
            <el-checkbox v-model="item.checked" :disabled="true">{{ item.name }}</el-checkbox>
            <el-tag v-if="item.status === 'abnormal'" type="danger" size="small" class="status-tag">已报异常</el-tag>
            <el-tag v-else-if="item.status === 'done'" type="info" size="small" class="status-tag">已完成</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const symptoms = reactive([
  { name: '上腹部持续性剧烈疼痛', matched: true, rate: '100%' },
  { name: '恶心', matched: true, rate: '100%' },
  { name: '呕吐', matched: true, rate: '100%' },
  { name: '心动过速', matched: false, rate: '60%' },
  { name: '低血压', matched: false, rate: '60%' },
  { name: '精神状态改变', matched: false, rate: '60%' },
  { name: '腹部轻压痛', matched: true, rate: '85%' },
  { name: '呼吸功能损害', matched: true, rate: '70%' },
]);

const checks = reactive([
  { name: 'C-反应蛋白', checked: true, status: 'abnormal' },
  { name: '腹部增强CT', checked: true, status: 'done' },
]);
</script>

<style scoped>
/* 右侧分析面板整体容器 */
.right-analysis-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent; /* 融入父页面背景 */
  padding-right: 20px; /* 防止内容紧贴父容器右边缘 */
  overflow-y: auto; /* 内容过多时内部滚动 */
}

/* 顶部标题 */
.panel-header h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
  border-left: 4px solid #409eff; /* 增加左侧装饰条 */
  padding-left: 10px;
}

/* 高亮盒子优化 */
.highlight-box {
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.infection {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
}
.rate-tag {
  margin-left: auto;
}

/* 疾病项优化 */
.disease-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #ecf5ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
  margin-bottom: 20px;
  font-size: 14px;
}
.disease-item .arrow { color: #409eff; margin-right: 8px; font-size: 10px; }
.disease-item .name { font-weight: 500; color: #303133; margin-right: auto; }
.disease-item .rate { color: #909399; font-size: 12px; }

/* 弱化分割线 */
hr {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 20px 0;
}

/* 症状与检查列表 */
h4 { 
  margin: 0 0 15px 0; 
  color: #606266; 
  font-size: 15px; 
  font-weight: 500;
}
.symptom-list, .check-list { display: flex; flex-direction: column; gap: 12px; }

.symptom-item { 
  display: flex; 
  align-items: center; 
  font-size: 13px; 
  padding: 4px 0;
}
.symptom-name { margin: 0 10px; color: #606266; flex: 1; }
.symptom-rate { color: #c0c4cc; font-size: 12px; }

.check-item { 
  display: flex; 
  align-items: center; 
  font-size: 13px;
  color: #606266;
}
.status-tag { margin-left: auto; }
</style>