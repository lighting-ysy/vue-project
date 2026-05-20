<template>
  <div class="left-panel">
    <h3 class="panel-title">病例列表</h3>

    <!-- 搜索区域 -->
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        size="small"
        placeholder="搜索患者姓名或症状..."
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch">确认</el-button>
        </template>
      </el-input>
      <el-button type="primary" size="small" :icon="Download" circle style="margin-left: 5px;" />
    </div>

    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="patient-card"
        :class="{ active: activeId === patient.id }"
        @click="selectPatient(patient.id)"
      >
        <span class="name">{{ patient.name }}</span>
        <span class="gender" :class="{ female: patient.gender === '女' }">
          {{ patient.gender }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'

// 模拟数据
const patients = ref([
  { id: 1, name: '张三', gender: '女' },
  { id: 2, name: '李四', gender: '男' },
  { id: 3, name: '王五', gender: '女' },
])

const searchQuery = ref('')
const activeId = ref(1) // 默认选中第一个

const emit = defineEmits(['select'])

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}

const selectPatient = (id) => {
  activeId.value = id
  emit('select', id)
}

// 简单的过滤逻辑
const filteredPatients = computed(() => {
  return patients.value.filter((p) =>
    p.name.includes(searchQuery.value)
  )
})
</script>

<style scoped>
.left-panel {
  padding: 15px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  margin: 0 0 15px 0;
  color: #409eff;
  font-weight: bold;
  text-align: center;
}

.search-box {
  margin-bottom: 15px;
}

.patient-list {
  flex: 1;
  overflow-y: auto;
}

.patient-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f7fa;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #333;
}

.patient-card:hover {
  background-color: #e1f3d8;
}

.patient-card.active {
  background-color: #409eff;
  color: #fff;
}

.gender {
  font-size: 12px;
  font-weight: normal;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e4e7ed;
  color: #606266;
}

.gender.female {
  background: #f56c6c;
  color: #fff;
}
</style>