<template>
  <div class="center-panel">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
      <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
    </div>

    <!-- 病历表单 -->
    <el-form 
      :model="formData" 
      label-width="120px" 
      label-position="left"
      class="record-form"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="24" v-for="(item, index) in formItems" :key="index">
          <!-- 普通单行/多行文本输入 -->
          <el-form-item :label="item.label" v-if="item.type === 'input'">
            <el-input 
              v-model="formData[item.prop]" 
              type="textarea" 
              :rows="1" 
              :placeholder="`请输入${item.label}`"
            />
          </el-form-item>

          <!-- 单一下拉框 -->
          <el-form-item :label="item.label" v-else-if="item.type === 'select'">
            <el-select v-model="formData[item.prop]" placeholder="请选择" style="width: 100%">
              <el-option label="外感" value="外感" />
              <el-option label="内伤" value="内伤" />
            </el-select>
          </el-form-item>

          <!-- 复杂/多组件行 (诊断结果) -->
          <el-form-item :label="item.label" v-else-if="item.type === 'multi-select'">
            <div class="multi-inputs">
              <el-select v-model="formData[item.prop1]" placeholder="病因类型" style="flex: 1">
                <el-option label="外感" value="外感" />
                <el-option label="内伤" value="内伤" />
              </el-select>
              <el-select v-model="formData[item.prop2]" placeholder="明确诊断" style="flex: 1">
                <el-option label="感冒" value="感冒" />
                <el-option label="咳嗽" value="咳嗽" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  registerId: {
    type: String,
    default: ''
  }
})

// 1. 定义表单配置（字段名、标签、类型）
const formItems = [
  { label: '主诉', prop: 'caseChief', type: 'input' },
  { label: '现病史', prop: 'casePresent', type: 'input' },
  { label: '既往史', prop: 'casePast', type: 'input' },
  { label: '家族史', prop: 'caseFamily', type: 'input' },
  { label: '过敏史', prop: 'caseAllergy', type: 'input' },
  { label: '个人史', prop: 'casePerson', type: 'input' },
  { label: '体格检查', prop: 'casePhysicalExam', type: 'input' },
  { label: '非特异性检查结果', prop: 'caseNormalExam', type: 'input' },
  { label: '特异性检查结果', prop: 'caseSpecificExam', type: 'input' },
  { label: '诊断结果', prop1: 'caseDiseaseType', prop2: 'caseDiagnostic', type: 'multi-select' },
  { label: '治疗方案', prop: 'caseTreatment', type: 'input' }
]

// 2. 定义表单绑定的数据对象
const formData = reactive({
  caseChief: '',
  casePresent: '',
  casePast: '',
  caseFamily: '',
  caseAllergy: '',
  casePerson: '',
  casePhysicalExam: '',
  caseNormalExam: '',
  caseSpecificExam: '',
  caseDiseaseType: '',
  caseDiagnostic: '',
  caseTreatment: ''
})

// 3. 获取病例详情的方法
const fetchData = (id) => {
  if (!id) return
  
  const url = '/fuo-aiads/register/selectCase'
  
  axios.get(url, {
    params: { registerId: id }
  }).then((res) => {
    const data = res.data.data 
    
    // 基础文本字段直接赋值
    formData.caseChief = data.caseChief || ''
    formData.casePresent = data.casePresent || ''
    formData.casePast = data.casePast || ''
    formData.caseFamily = data.caseFamily || ''
    formData.caseAllergy = data.caseAllergy || ''
    formData.casePerson = data.casePerson || ''
    formData.caseTreatment = data.caseTreatment || ''
    formData.caseDiseaseType = data.caseDiseaseType || ''
    formData.caseDiagnostic = data.caseDiagnostic || ''

    // 数组类型数据转换为字符串展示
    const formatExamArray = (arr) => {
      if (!arr || arr.length === 0) return ''
      return arr.map(item => {
        const unit = item.itemUnit ? item.itemUnit : ''
        return `${item.itemName}: ${item.itemValue}${unit}`
      }).join(' | ')
    }

    formData.casePhysicalExam = formatExamArray(data.casePhysicalExam)
    formData.caseNormalExam = formatExamArray(data.caseNormalExam)
    formData.caseSpecificExam = formatExamArray(data.caseSpecificExam)

  }).catch((err) => {
    console.error('❌ 请求失败:', err)
  })
}

// 监听 registerId 的变化
watch(
  () => props.registerId,
  (newId) => {
    fetchData(newId)
  },
  { immediate: true }
)

const handleSave = () => {
  console.log('保存的数据：', formData)
  ElMessage.success('保存成功')
}

const handleDelete = () => {
  ElMessage.warning('点击了删除')
}
</script>

<style scoped>
.center-panel {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  gap: 10px;
}

.record-form {
  flex: 1;
  overflow-y: auto;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* --- 核心修改区域开始 --- */

/* 调整左侧 Label 的样式 */
:deep(.el-form-item__label) {
  font-weight: bold;
  color: #333;
  background-color: #f8f9fa; /* 保留灰色背景 */
  padding: 0 12px;
  line-height: 32px;
  /* border: 1px solid #dcdfe6;  <-- 去掉边框，防止文字溢出 */
  /* width: 120px !important;   <-- 去掉固定宽度，让宽度跟随文字自适应 */
  border-radius: 4px 0 0 4px;
  box-sizing: border-box;
  white-space: nowrap; /* 强制文字不换行 */
}

/* 调整右侧 input/select 的边框 */
:deep(.el-form-item__content) {
  margin-left: 0 !important;
}

:deep(.el-input__wrapper), 
:deep(.el-select .el-input__wrapper) {
  border-radius: 0 4px 4px 0;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  /* border-left: none;  <-- 恢复左边框，因为左边Label没有边框了 */
}

/* --- 核心修改区域结束 --- */

:deep(.el-textarea__inner) {
  border-radius: 0 4px 4px 0;
}

.multi-inputs {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>