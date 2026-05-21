<template>
  <div class="left-panel">
    <h3 class="panel-title">病例列表</h3>

    <!-- 搜索区域 -->
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        size="small"
        placeholder="搜索患者姓名..."
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch">确认</el-button>
        </template>
      </el-input>
      <!-- 新增患者按钮 -->
      <el-button size="small" :icon="Plus" style="margin-left: 5px;" @click="openAddDialog" />
      <el-button size="small" :icon="Download" style="margin-left: 5px;" @click="triggerFileSelect" />
    </div>

    <!-- 隐藏的 input 标签，用于唤起系统文件选择器 -->
    <input 
      ref="fileInputRef" 
      type="file" 
      style="display: none" 
      accept=".pdf,.doc,.docx,.txt" 
      @change="handleFileChange"
    />

    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        v-for="patient in filteredPatients"
        :key="patient.patientId"
        class="patient-card"
        :class="{ active: activeId === patient.registerId }"
        @click="selectPatient(patient.registerId)"
      >
        <span class="name">{{ patient.patientName }}</span>
        <span class="gender" :class="{ female: patient.patientGender === '女' }">
          {{ patient.patientGender }}
        </span>
      </div>
    </div>

    <!-- 分页条 -->
    <div class="pagination-box">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        small
      />
    </div>

    <!-- 新增患者弹窗 (保持不变...) -->
    <el-dialog
      v-model="dialogVisible"
      title="新增患者"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="newPatientForm" label-width="60px" ref="formRef">
        <el-form-item label="姓名" prop="patientName">
          <el-input v-model="newPatientForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="patientGender">
          <el-radio-group v-model="newPatientForm.patientGender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="patientAge">
          <el-input type="number" v-model.number="newPatientForm.patientAge" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewPatient">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Download, Plus } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const patients = ref([])
const searchQuery = ref('')
const activeId = ref('')
const fileInputRef = ref(null)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0) // 总条目数

// 新增弹窗相关数据
const dialogVisible = ref(false)
const newPatientForm = ref({
  patientName: '',
  patientGender: '男',
  patientAge: 18
})

const emit = defineEmits(['select', 'file-selected'])

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 搜索时通常应该重置到第一页并重新请求
  currentPage.value = 1
  fetchData()
}

const selectPatient = (id) => {
  activeId.value = id
  emit('select', id)
}

// 打开新增弹窗
const openAddDialog = () => {
  newPatientForm.value = { patientName: '', patientGender: '男', patientAge: 18 }
  dialogVisible.value = true
}

// 提交新增患者
const submitNewPatient = () => {
  if (!newPatientForm.value.patientName.trim()) {
    ElMessage.warning('请输入患者姓名')
    return
  }

  axios.post('/fuo-aiads/register/createRegistedPatient', { data: newPatientForm.value })
    .then((res) => {
      console.log('✅ 新增患者成功:', res.data)
      // 新增成功后，建议刷新当前列表，或者将新数据插入到列表顶部
      // 这里采用重新请求第一页的方式，保证数据绝对同步
      currentPage.value = 1
      fetchData()
      
      ElMessage.success('新增患者成功')
      dialogVisible.value = false
    })
    .catch((err) => {
      console.error('❌ 请求失败:', err)
    })
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchData()
}

const triggerFileSelect = () => {
  fileInputRef.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('选中的文件：', file.name)
    emit('file-selected', file)
    event.target.value = ''
  }
}

// 配合搜索框过滤当前页的数据
const filteredPatients = computed(() => {
  return patients.value.filter((p) =>
    p.patientName.includes(searchQuery.value)
  )
})

// 获取病例列表数据（后端分页）
const fetchData = () => {
  const url = '/fuo-aiads/register/selectCaseList';
  axios.get(url, {
    params: {
      pageSize: pageSize.value,
      pageNum: currentPage.value
    }
  }).then((res) => {
    console.log('✅ 获取病例列表数据成功:', res.data);
    // 假设后端返回的数据结构是 res.data.data.registerList，总条数是 res.data.data.total
    patients.value = res.data.data.registerList || []
    total.value = res.data.data.total || 0 
  }).catch((err) => {
    console.error('❌ 请求失败:', err);
  });
};

onMounted(() => {
  fetchData()
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
  margin-bottom: 10px; /* 给分页条留出一点间距 */
}

/* 分页条样式 */
.pagination-box {
  display: flex;
  justify-content: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
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