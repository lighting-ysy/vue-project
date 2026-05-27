<template>
  <div class="center-panel">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
      <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
    </div>

    <!-- 病历表单 -->
    <el-form :model="formData" label-width="120px" label-position="left" class="record-form" size="small">
      <el-row :gutter="20">
        <el-col :span="24" v-for="(item, index) in formItems" :key="index">
          <!-- 普通单行/多行文本输入 -->
          <el-form-item :label="item.label" v-if="item.type === 'input'">
            <el-input v-model="formData[item.prop]" type="textarea" :rows="1" :placeholder="`请输入${item.label}`" />
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
                <el-option label="感染性疾病" value="感染性疾病" />
                <el-option label="非感染性炎症性疾病" value="非感染性炎症性疾病" />
                <el-option label="肿瘤性疾病" value="肿瘤性疾病" />
                <el-option label="其他疾病" value="其他疾病" />
              </el-select>
              <!-- <el-select v-model="formData[item.prop2]" placeholder="明确诊断" style="flex: 1">
                <el-option label="感冒" value="感冒" />
                <el-option label="咳嗽" value="咳嗽" />
              </el-select> -->
              <el-input v-model="formData[item.prop2]"  placeholder="明确诊断"  style="flex: 1" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  patientInfo: {
    type: Object,
    default: {}
  }
})

// ... formItems 和 formData 的定义保持不变 ...
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
const emit = defineEmits(['case-info'])
// 定义表单引用，用于校验
const recordFormRef = ref(null)

// 1. 获取病例详情的方法
const fetchData = (id) => {
  if (!id) return
  const url = '/fuo-aiads/register/selectCase'
  
  // 模拟请求（实际使用时请替换为你的真实 axios.get）
  axios.get(url, { params: { registerId: id } }).then((res) => {
    // 这里假设 res.data 是你提供的 data 对象
    const data = res.data.data || {} 

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

    // 数组转字符串的辅助函数
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
emit('case-info', {...data,registerId:id})
  }).catch((err) => {
    console.error('❌ 请求失败:', err)
  })
}

// 2. 字符串解析回数组的辅助函数（核心新增逻辑）
const parseExamString = (str) => {
  if (!str || str.trim() === '') return []
  
  return str.split(' | ').map(itemStr => {
    // 匹配格式：名称: 数值单位 (例如 "身高: 176cm")
    // 使用正则提取：冒号前是 itemName，冒号后是数值和单位
    const match = itemStr.match(/^([^:]+):\s*(.+)$/)
    if (match) {
      const itemName = match[1].trim()
      const valueAndUnit = match[2].trim()
      
      // 简单提取单位：匹配末尾的字母或特殊单位符号，剩下的作为数值
      // 如果没有字母结尾，则整个作为数值，单位为空
      const unitMatch = valueAndUnit.match(/^(.+?)([a-zA-Z\/%]+)$/)
      
      if (unitMatch) {
        return {
          itemName: itemName,
          itemValue: unitMatch[1].trim(),
          itemUnit: unitMatch[2],
          itemId: "",
          itemExamId: ""
        }
      } else {
        return {
          itemName: itemName,
          itemValue: valueAndUnit,
          itemUnit: "",
          itemId: "",
          itemExamId: ""
        }
      }
    }
    // 如果格式不匹配，返回空对象或做容错处理
    return { itemName: itemStr, itemValue: "", itemUnit: "", itemId: "", itemExamId: "" }
  })
}
// const parseExamString = (str) => {
//   if (!str || str.trim() === '') return []

//   return str.split(' | ').map(itemStr => {
//     const match = itemStr.match(/^([^:]+):\s*(.+)$/)
//     if (match) {
//       const itemName = match[1].trim()
//       const valueAndUnit = match[2].trim()

//       const unitMatch = valueAndUnit.match(/^(.+?)([a-zA-Z\/%]+)$/)

//       if (unitMatch) {
//         return {
//           itemName: itemName,
//           itemValue: unitMatch[1].trim(),
//           itemUnit: unitMatch[2],
//           itemId: "",
//           itemExamId: ""
//         }
//       } else {
//         return {
//           itemName: itemName,
//           itemValue: valueAndUnit,
//           itemUnit: "",
//           itemId: "",
//           itemExamId: ""
//         }
//       }
//     }
//     // 这里修复：之前 itemStr 直接用，变量名冲突
//     return { 
//       itemName: itemStr.trim(), 
//       itemValue: "", 
//       itemUnit: "", 
//       itemId: "", 
//       itemExamId: "" 
//     }
//   })
// }
// 3. 改造后的 handleSave 方法
const handleSave = () => {
  if (!props.patientInfo.registerId) {
    ElMessage.warning('缺少患者登记ID，无法保存')
    return
  }
  console.log('开始保存')
  // 将前端展示用的字符串，转换回后端需要的对象数组
  const submitData = {
    registerId: props.patientInfo.registerId, // 带上主键ID用于后端更新
    caseId:props.patientInfo.caseId, // 带上病历ID用于后端更新
    patientId: props.patientInfo.patientId,
    caseChief: formData.caseChief,
    casePresent: formData.casePresent,
    casePast: formData.casePast,
    caseFamily: formData.caseFamily,
    caseAllergy: formData.caseAllergy,
    casePerson: formData.casePerson,
    caseDiseaseType: formData.caseDiseaseType,
    caseDiagnostic: formData.caseDiagnostic,
    caseTreatment: formData.caseTreatment,
    // 调用解析函数，将 "身高: 176cm" 还原为 [{ itemName: '身高', itemValue: '176', itemUnit: 'cm' }]
    casePhysicalExam: parseExamString(formData.casePhysicalExam).length > 0 ? parseExamString(formData.casePhysicalExam) : null,
    caseNormalExam: parseExamString(formData.caseNormalExam).length > 0 ? parseExamString(formData.caseNormalExam) : null,
    caseSpecificExam: parseExamString(formData.caseSpecificExam).length > 0 ? parseExamString(formData.caseSpecificExam) : null,
    caseOther: null,
    patientName:props.patientInfo.patientName,
    patientGender:props.patientInfo.patientGender,
    patientAge:props.patientInfo.patientAge || null,
    patientCareer:props.patientInfo.patientCareer || null,
    patientAddress:props.patientInfo.patientAddress || null,
  }

  console.log('💾 准备提交给后端的数据：', submitData)

  // 发送 POST 请求保存（假设后端保存接口为 /register/saveCase）
  axios.post('/fuo-aiads/register/updateCase', {data:submitData}).then((res) => {
    console.log('💾 保存成功', res.data)
    ElMessage.success('保存成功')
  }).catch((err) => {
    console.error('❌ 保存失败:', err)
    ElMessage.error('保存失败，请检查网络或联系管理员')
  })
}

const handleDelete = () => {
  // ... 删除逻辑保持不变 ...
  if (!props.patientInfo.registerId) {
    ElMessage.warning('请先选择患者')
    return
  }
  axios.get('/fuo-aiads/register/deleteRegisterLogically', {
    params: { registerId: props.patientInfo.registerId }
  }).then((res) => {
    console.log('删除成功', res.data)
    ElMessage.success('删除成功')
  }).catch((err) => {
    console.error('❌ 删除失败:', err)
  })
}

// 监听 registerId 的变化
watch(
  () => props.patientInfo.registerId,
  (newId) => {
    fetchData(newId)
  },
  { immediate: true }
)
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
  background-color: #f8f9fa;
  /* 保留灰色背景 */
  padding: 0 12px;
  line-height: 32px;
  /* border: 1px solid #dcdfe6;  <-- 去掉边框，防止文字溢出 */
  /* width: 120px !important;   <-- 去掉固定宽度，让宽度跟随文字自适应 */
  border-radius: 4px 0 0 4px;
  box-sizing: border-box;
  white-space: nowrap;
  /* 强制文字不换行 */
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