<template>
  <div class="center-panel">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <el-button type="primary" size="small">保存</el-button>
      <el-button type="danger" size="small">删除</el-button>
    </div>

    <!-- 病历表格 -->
    <el-table :data="tableData" border show-header class="record-table">
      <el-table-column prop="label" label="项目" width="120" align="center" class-name="label-col" />
      <el-table-column prop="value" label="内容" align="center">
        <template #default="scope">
          <!-- 根据字段类型渲染不同的组件 -->
          <template v-if="scope.row.type === 'select'">
            <el-select v-model="scope.row.value" placeholder="请选择" size="small" style="width: 100%">
              <el-option label="外感" value="外感" />
              <el-option label="内伤" value="内伤" />
            </el-select>
          </template>
          <template v-else-if="scope.row.type === 'input'">
            <el-input v-model="scope.row.value" size="small" type="textarea" :rows="1" />
          </template>
          <template v-else>
            <span class="text-placeholder" v-if="!scope.row.value">点击编辑...</span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部治疗区域 -->
    <div class="treatment-section">
      <div class="treatment-box">
        <span class="treatment-label">治疗</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// 模拟表格数据结构
const tableData = reactive([
  { label: '主诉', value: '', type: 'input' },
  { label: '现病史', value: '', type: 'input' },
  { label: '既往史', value: '', type: 'input' },
  { label: '家族史', value: '', type: 'input' },
  { label: '过敏史', value: '', type: 'input' },
  { label: '个人史', value: '', type: 'input' },
  { label: '体格检查', value: '', type: 'input' },
  { label: '非特异性检查结果', value: '', type: 'input' },
  { label: '特异性检查结果', value: '', type: 'input' },
  { label: '诊断结果', value: '', type: 'complex' }, // 特殊行
])
</script>

<style scoped>
.center-panel {
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 10px;
}

.record-table {
  flex: 1;
  width: 100%;
}

/* 表格样式微调 */
:deep(.label-col) {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.text-placeholder {
  color: #ccc;
  font-size: 12px;
}

/* 底部治疗区域 */
.treatment-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}

.treatment-box {
  width: 80%;
  height: 120px;
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #67c23a;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>