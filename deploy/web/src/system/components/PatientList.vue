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
      <el-button size="small" :icon="Plus" style="margin-left: 5px;" @click="openAddDialog" title="新增患者" />
      <el-button size="small" :icon="Download" style="margin-left: 5px;" @click="triggerFileSelect" title="添加病例"/>
    </div>

    <!-- 隐藏的 input 标签，用于唤起系统文件选择器 -->
    <!-- 注意：accept 属性建议补充 .doc,.txt 等完整类型 -->
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
        v-for="patient in patients"
        :key="patient.patientId"
        class="patient-card"
        :class="{ active: activeId === patient.registerId }"
        @click="selectPatient(patient)"
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        small
      />
    </div>

    <!-- 新增患者弹窗 -->
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
import { ref, computed, onMounted } from 'vue'
import { Search, Download, Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 1. 响应式数据定义
const patients = ref([]) // 存储当前页的患者列表
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

// 2. 分页与搜索逻辑 (核心补全部分)

// 补全：处理每页条数变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  // 改变每页条数后，通常需要回到第一页重新查询
  currentPage.value = 1 
  fetchData()
}

// 补全：处理当前页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 修正：搜索逻辑，点击确认或回车触发
const handleSearch = () => {
  // 搜索时重置到第一页
  currentPage.value = 1
  fetchData()
}

// 3. 数据请求逻辑 (核心修正：带上分页和搜索参数)
const fetchData = async () => {
  const url = '/api/v1/register/selectCaseList'
  
  // 构建请求参数
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }
  
  // 如果有搜索关键词，加入参数
  if (searchQuery.value.trim()) {
    params.patientName = searchQuery.value.trim()
  }

  try {
    const res = await axios.get(url, { params })
    console.log('✅ 获取病例列表数据成功:', res.data)
    
    const data = res.data.data || {}
    // 假设后端返回的数据结构是 { registerList: [], total: 100 }
    patients.value = data.registerList || []
    total.value = data.total || 0
  } catch (err) {
    console.error('❌ 请求失败:', err)
    ElMessage.error('数据加载失败')
  }
}

// 4. 其他交互逻辑

// 选择患者
const selectPatient = (patient) => {
  activeId.value = patient.registerId
  emit('select', patient)
}

// 打开新增弹窗
const openAddDialog = () => {
  newPatientForm.value = { patientName: '', patientGender: '男', patientAge: 18 }
  dialogVisible.value = true
}

// 提交新增患者
const submitNewPatient = async () => {
  if (!newPatientForm.value.patientName.trim()) {
    ElMessage.warning('请输入患者姓名')
    return
  }

  try {
    const res = await axios.post('/api/v1/register/createRegistedPatient', { 
      data: newPatientForm.value 
    })
    
    console.log('✅ 新增患者成功:', res.data)
    ElMessage.success('新增患者成功')
    dialogVisible.value = false
    
    // 新增成功后，刷新列表 (保持当前页码，除非是搜索状态，否则可能需要重置到第一页)
    // 通常建议重置到第一页以查看最新数据
    currentPage.value = 1
    fetchData()
  } catch (err) {
    console.error('❌ 新增失败:', err)
  }
}

// 文件导入逻辑
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('选中的文件：', file.name)
    emit('file-selected', file)
    // 清空 input 的 value，以便可以选择同一个文件
    event.target.value = ''
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 保持原有样式不变 */
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
  margin-bottom: 10px;
}

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