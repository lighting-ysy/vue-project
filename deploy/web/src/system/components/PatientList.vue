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
      <el-button size="small" :icon="Plus" style="margin-left: 5px;" @click="openAddDialog" title="新增患者" />
      <el-button size="small" :icon="Download" style="margin-left: 5px;" @click="triggerFileSelect" title="添加病例"/>
      
      <!-- 只显示查询内容 单选框 -->
      <el-radio-group v-model="queryOnly" class="search-radio">
        <el-radio
          label="1"
          @click.prevent="toggleQueryOnly"
        >只显示查询内容</el-radio>
      </el-radio-group>

      <el-button size="small" @click="openFilterDialog">
        更多查询
      </el-button>
    </div>

    <input 
      ref="fileInputRef" 
      type="file" 
      style="display: none" 
      accept=".pdf,.doc,.docx,.txt" 
      @change="handleFileChange"
    />

    <!-- 更多查询弹窗 -->
    <el-dialog
      v-model="filterDialogVisible"
      title="高级查询"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <data-info v-model="patientInfo" />
      <data-tag v-model="selectedSymptoms" />
      <data-item v-model="ruleConfig" />
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="filterDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="printForm">完成查询</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 患者与就诊记录列表 + 空白点击 -->
    <div class="patient-list" @click="handleBlankClick">
      <div
        v-for="patient in patients"
        :key="patient.patientId"
        class="patient-group"
        @click.stop
      >
        <div
          class="patient-card"
          :class="{ active: activeId === patient.patientId }"
          @click="selectPatient(patient)"
        >
          <span class="name">{{ patient.patientName }}</span>
          <span class="gender" :class="{ female: patient.patientGender === '女' }">
            {{ patient.patientGender }}
          </span>
        </div>

        <transition name="slide-fade">
          <div
            v-if="activeId === patient.patientId && patient.registerList && patient.registerList.length > 0"
            class="register-list"
          >
            <div
              v-for="(record, index) in filterRegisterList(patient.registerList)"
              :key="record.registerId || index"
              class="register-item"
              :class="{ active: selectedRegisterId === record.registerId }"
              @click.stop="selectRegister(record, patient)"
            >
              <span class="date">{{ record.createTime || record.date }}</span>
              <span class="diagnosis">{{ record.caseDiagnostic }}</span>
            </div>
          </div>
        </transition>
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

    <!-- 新增就诊弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增新建就诊"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form :model="addVisitForm" label-width="0px" ref="formRef">
        <div class="radio-group-container">
          <el-radio-group v-model="addVisitForm.mode" class="radio-group">
            <el-radio label="new">新建患者</el-radio>
            <el-radio label="bind">绑定患者</el-radio>
          </el-radio-group>
        </div>

        <div v-if="addVisitForm.mode === 'new'" class="new-patient-fields">
          <el-form-item>
            <el-input v-model="addVisitForm.newPatientName" placeholder="请输入姓名" class="input-field" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="addVisitForm.newPatientGender" placeholder="请输入性别" class="input-field" />
          </el-form-item>
        </div>

        <div v-if="addVisitForm.mode === 'bind'" class="bind-patient-field">
          <el-form-item>
            <el-select
              v-model="addVisitForm.bindPatientId"
              placeholder="请选择患者"
              class="select-field"
              filterable
              remote
              :remote-method="debounceSearch"
              @focus="featchPatientList"
            >
              <el-option
                v-for="p in addPatients"
                :key="p.patientId"
                :label="`${p.patientName}(${p.patientGender})`"
                :value="p.patientId"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddVisit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Download, Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import DataItem from './DataItem.vue'
import DataTag from './DataTag.vue'
import DataInfo from './DataInfo.vue'
import 'element-plus/es/components/message/style/css'

// 高级查询弹窗
const filterDialogVisible = ref(false)
// 打开高级查询弹窗
const openFilterDialog = () => {
  filterDialogVisible.value = true
}

const patientInfo = ref({})
const selectedRegisterId = ref('')
const selectedSymptoms = ref(['发热'])
const ruleConfig = ref([{ itemName: '心率', type: '等于', value1: null, value2: null }])

const patients = ref([])
const addPatients = ref([])
const searchQuery = ref('')
const activeId = ref('')
const fileInputRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dialogVisible = ref(false)
const queryOnly = ref('')

const toggleQueryOnly = () => {
  queryOnly.value = queryOnly.value === '1' ? '' : '1'
  handleSearch()
}

// 点击列表空白区域
const handleBlankClick = () => {
  console.log('点击了空白')
  emit('blank-clicked',false)
  // 这里可以额外写逻辑：比如清空选中
  activeId.value = ''
  selectedRegisterId.value = ''
}

// 核心过滤方法
const filterRegisterList = (list) => {
  if (!list) return []
  if (queryOnly.value === '1') {
    return list.filter(item => item.isSelected === true)
  }
  return list
}

const addVisitForm = ref({
  mode: 'new',
  newPatientName: '',
  newPatientGender: '',
  bindPatientId: ''
})

const printForm = () => {
  console.log(ruleConfig.value)
  const hasEmptyValue1 = ruleConfig.value.some(item => {
    return item.value1 === null || item.value1 === '';
  });

  if (hasEmptyValue1) {
    ruleConfig.value = [];
    ElMessage.warning('检测到数值1有空值，已清空检查结果列表');
  }

  let multiParam = {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
    patientInfo: patientInfo.value,
    symptomList: selectedSymptoms.value,
    examList: ruleConfig.value,
  }
  
  fetchData(multiParam)
  // 关闭弹窗
  filterDialogVisible.value = false
}

const emit = defineEmits(['select', 'file-selected','blank-clicked'])

// 分页与搜索
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  fetchData()
}
const handlePageChange = (page) => {
  currentPage.value = page
  fetchData()
}
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 防抖
let timer = null
const debounce = (fn, delay = 300) => {
  return (val) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(val)
    }, delay)
  }
}

// 弹窗搜索患者
const featchPatientList = async (keyword = '') => {
  const url = '/api/v1/mainsuit/patientList'
  const params = { patientName: keyword.trim() }
  try {
    const res = await axios.get(url, { params })
    addPatients.value = res.data.data || []
  } catch (err)
  {
    console.error('❌ 患者搜索失败:', err)
    ElMessage.error('患者搜索失败')
  }
}
const debounceSearch = debounce(featchPatientList, 300)

// 获取病例列表
const fetchData = async (multiParam) => {
  const url = '/api/v1/mainsuit/selectCaseList'
  const params = multiParam || {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    patientInfo:{
      patientName:'',
      patientGender:'',
      ageType:'范围',
      ageValue1: null,
      ageValue2: null,
    }
  }

  if (searchQuery.value.trim()) {
    params.patientInfo.patientName = searchQuery.value.trim()
  }

  try {
    const res = await axios.post(url, { data: params })
    const data = res.data.data || {}
    patients.value = data.patientList || []
    total.value = data.total || 0
    patientInfo.value = {}
    selectedSymptoms.value = ['发热']
    ruleConfig.value = [{ itemName: '心率', type: '等于', value1: null, value2: null }]
  } catch (err) {
    console.error('❌ 数据加载失败:', err)
    ElMessage.error('数据加载失败')
  }
}

// 打开弹窗
const openAddDialog = () => {
  addVisitForm.value = { mode: 'new', newPatientName: '', newPatientGender: '', bindPatientId: '' }
  dialogVisible.value = true
}

// 提交新增就诊
const submitAddVisit = async () => {
  if (addVisitForm.value.mode === 'new') {
    if (!addVisitForm.value.newPatientName.trim()) return ElMessage.warning('请输入患者姓名')
    if (!addVisitForm.value.newPatientGender.trim()) return ElMessage.warning('请输入患者性别')

    try {
      await axios.post('/api/v1/mainsuit/createVisit', {
        data: {
          patientName: addVisitForm.value.newPatientName,
          patientGender: addVisitForm.value.newPatientGender,
        }
      })
      ElMessage.success('新建患者并创建就诊成功')
      dialogVisible.value = false
      fetchData()
    } catch (err) {
      console.error('❌ 新建失败:', err)
      ElMessage.error('操作失败')
    }
  } else {
    if (!addVisitForm.value.bindPatientId) return ElMessage.warning('请选择要绑定的患者')
    try {
      await axios.post('/api/v1/mainsuit/createVisit', {
        data: {
          patientId: addVisitForm.value.bindPatientId
        }
      })
      ElMessage.success('绑定患者并创建就诊成功')
      dialogVisible.value = false
      fetchData()
    } catch (err) {
      console.error('❌ 绑定失败:', err)
      ElMessage.error('操作失败')
    }
  }
}

const triggerFileSelect = () => fileInputRef.value?.click()

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('file-selected', file)
    event.target.value = ''
  }
}

const selectPatient = (patient) => {
  if (activeId.value === patient.patientId) {
    activeId.value = ''
    selectedRegisterId.value = ''
    emit('select', null)
  } else {
    activeId.value = patient.patientId
    selectedRegisterId.value = ''
    if (!patient.registerList) patient.registerList = []
    emit('select', patient)
  }
}

const selectRegister = (record, patient) => {
  selectedRegisterId.value = record.registerId
  emit('select', {
    ...record,
    patientId: patient.patientId,
    patientName: patient.patientName,
    patientAge: patient.patientAge || null,
    patientGender: patient.patientGender
  })
}

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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.search-radio {
  margin-left: 8px;
}

.patient-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.patient-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f7fa;
  margin-bottom: 2px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #333;
}
.patient-card:hover { background-color: #e1f3d8; }
.patient-card.active {
  background-color: #409eff;
  color: #fff;
}

.register-list {
  margin-left: 15px;
  margin-bottom: 10px;
  border-left: 2px solid #409eff;
}

.register-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px dashed #eee;
}

.register-item:last-child { border-bottom: none; }
.register-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.register-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: bold;
}
.register-item .date { color: #909399; font-size: 12px; }
.register-item.active .date { color: #409eff; }

.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.radio-group-container { margin-bottom: 20px; }
.radio-group { display: flex; align-items: center; }
.radio-label { font-size: 18px; margin-right: 30px; }
.new-patient-fields { display: flex; gap: 20px; }
.input-field { flex: 1; }
.bind-patient-field { width: 100%; }
.select-field { width: 100%; }
</style>