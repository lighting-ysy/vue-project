<template>
  <div class="prescription-container">
    <!-- 循环渲染处方单 -->
    <div v-for="(item, index) in prescriptionList" :key="index" class="prescription-card">
      <!-- 顶部标题栏 -->
      <div class="card-header">
        <span class="title">{{ item.title }}</span>
        <span class="count">{{ item.count }}</span>
        <el-button type="primary" link class="copy-btn">复用</el-button>
      </div>

      <!-- 中药处方表格 -->
      <table class="herbal-table" v-if="item.herbs && item.herbs.length > 0">
        <tbody>
          <tr v-for="(row, rIndex) in item.herbs" :key="rIndex">
            <td class="name-col">
              <span class="herb-name">{{ row.name }}</span>
              <span v-if="row.note" class="note">{{ row.note }}</span>
            </td>
            <td class="dosage-col">{{ row.dosage }}</td>
            <td class="name-col">
              <span class="herb-name">{{ row.name2 }}</span>
            </td>
            <td class="dosage-col">{{ row.dosage2 }}</td>
            <td class="name-col">
              <span class="herb-name">{{ row.name3 }}</span>
            </td>
            <td class="dosage-col">{{ row.dosage3 }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 成药处方列表 -->
      <div class="patent-list" v-if="item.patents && item.patents.length > 0">
        <div v-for="(drug, dIndex) in item.patents" :key="dIndex" class="drug-row">
          <span class="drug-name">{{ drug.name }}</span>
          <span class="drug-spec">{{ drug.spec }}</span>
          <span class="drug-usage">{{ drug.usage }}</span>
          <span class="drug-count">{{ drug.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const prescriptionList = ref([
  {
    title: '麻杏石甘汤加减',
    count: '5剂',
    herbs: [
      { name: '麻黄', note: '先煎', dosage: '6g', name2: '地龙', dosage2: '10g', name3: '苦杏仁', dosage3: '6g' },
      // 如果需要更多行，可以在这里添加
    ]
  },
  {
    title: '成药处方',
    count: '',
    patents: [
      { name: '蒲地蓝消炎片', spec: '', usage: '早晚一次，每次两片', count: '一盒' },
      { name: '对乙酰氨基酚片', spec: '', usage: '每日一片', count: '2片' }
    ]
  },
  // 重复数据以模拟截图效果
  {
    title: '麻杏石甘汤加减',
    count: '5剂',
    herbs: [
      { name: '麻黄', note: '先煎', dosage: '6g', name2: '地龙', dosage2: '10g', name3: '苦杏仁', dosage3: '6g' },
    ]
  },
  {
    title: '成药处方',
    count: '',
    patents: [
      { name: '蒲地蓝消炎片', spec: '', usage: '早晚一次，每次两片', count: '一盒' },
      { name: '对乙酰氨基酚片', spec: '', usage: '每日一片', count: '2片' }
    ]
  }
])
</script>

<style scoped>
/* 容器：右侧区域通常较窄，去除外部边距 */
.prescription-container {
  padding: 10px;
  background-color: #f5f7fa; /* 轻微背景色，区分右侧区域 */
  height: 100%;
  overflow-y: auto;
}

/* 处方卡片 */
.prescription-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 15px; /* 卡片之间的间距 */
  overflow: hidden;
}

/* 卡片头部 */
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

/* 中药表格样式 */
.herbal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.herbal-table td {
  border: 1px solid #ebeef5;
  padding: 6px 8px;
  vertical-align: middle;
}

.name-col {
  width: 35%;
  color: #606266;
}

.dosage-col {
  width: 15%;
  color: #909399;
  text-align: right;
  padding-right: 15px;
}

.herb-name {
  font-weight: 500;
}

.note {
  font-size: 12px;
  color: #f56c6c;
  margin-left: 4px;
}

/* 成药列表样式 */
.patent-list {
  display: flex;
  flex-direction: column;
  gap: 1px; /* 模拟行之间的分割线 */
  background-color: #ebeef5; /* 分割线颜色 */
}

.drug-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 8px 12px;
  font-size: 13px;
  color: #606266;
}

.drug-name {
  flex: 1;
  font-weight: 500;
}

.drug-usage {
  flex: 1.5;
  text-align: center;
  color: #909399;
}

.drug-count {
  flex: 1;
  text-align: right;
  color: #909399;
}
</style>