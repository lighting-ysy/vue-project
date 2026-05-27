<template>
  <div class="prescription-container">
    <!-- 循环渲染处方单 -->
    <div v-for="(item, index) in prescriptionList" :key="index" class="prescription-card">
      <!-- 顶部标题栏 -->
      <div class="card-header">
        <div>
          <span class="title" :title="item.bylaws">{{ item.title }}</span>
          <span class="count">{{ item.count }}</span>
        </div>
        <el-button type="primary" link class="copy-btn">复用方案</el-button>
      </div>

      <!-- 治疗方案/计划列表 -->
      <div class="patent-list" v-if="item.patents && item.patents.length > 0">
        <div v-for="(plan, dIndex) in item.patents" :key="dIndex" class="drug-row">
          <span class="drug-name">{{ plan.name }}</span>
        </div>
      </div>
    </div>

    <!-- 空数据提示 -->
    <div v-if="prescriptionList.length === 0" class="empty-tip">
      暂无治疗方案数据
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  treatment: {
    type: Object,
    default: () => ({})
  },
})

// 处方列表数据
const prescriptionList = ref([])

// 核心：监听 props 变化，自动更新数据
watch(
  () => props.treatment,
  (newVal) => {
    console.log('接收到治疗数据：', newVal);
    
    // 数据合法才处理
    if (newVal && newVal.treatment_list && newVal.treatment_list.length) {
      prescriptionList.value = newVal.treatment_list.map(item => ({
        title: item.treatment_content,
        bylaws: item.treatment_bylaws,
        count: `${item.plan_list.length}项`,
        patents: item.plan_list.map(plan => ({
          name: plan.plan_content,
          spec: '',
          usage: '',
          count: ''
        }))
      }))
    } else {
      // 无数据时清空
      prescriptionList.value = []
    }
  },
  { deep: true, immediate: true } // 深度监听 + 立即执行
)
</script>

<style scoped>
.prescription-container {
  padding: 10px;
  background-color: #f5f7fa;
  height: 100%;
  overflow-y: auto;
}

.prescription-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
}

.card-header {
  background-color: #f0f2f5;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.title {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.count {
  margin-left: 10px;
  font-weight: bold;
  color: #303133;
}

.copy-btn {
  padding: 0;
  font-size: 12px;
}

.patent-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #ebeef5;
}

.drug-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  padding: 10px 12px;
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #f5f7fa;
}

.drug-row:last-child {
  border-bottom: none;
}

.drug-name {
  flex: 1;
  font-weight: 500;
  line-height: 1.5;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #909399;
  font-size: 13px;
}
</style>