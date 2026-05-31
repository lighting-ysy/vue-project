<template>
  <div class="medical-record-container">
    <el-row :gutter="20" style="height: 100%">
      <!-- 左侧：病例原文展示 -->
      <el-col :span="9">
        <div class="original-doc">
          <h2 class="doc-title">病例原文</h2>
          <!-- 使用 v-html 渲染 Mammoth 解析后的 HTML -->
          <div class="doc-content" v-html="originalText"></div>
          <!-- 加载状态提示 -->
          <div v-if="!originalText && !loadingError" class="empty-state">正在加载文档...</div>
          <div v-if="loadingError" class="error-state">文档解析失败，请检查文件格式</div>
        </div>
      </el-col>

      <!-- 右侧：结构化录入表单 -->
      <el-col :span="15">
        <div class="structured-form">
          <!-- 顶部操作栏 -->
          <div class="form-header">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button type="danger" @click="handleDelete">删除</el-button>
            <el-button type="success" @click="fetchData" >提取</el-button>
            <el-button type="primary" >新增</el-button>
          </div>
          <el-form :model="formData" label-width="120px" label-position="left" class="record-form" size="small">
      <el-row :gutter="20">
        <el-col :span="24" v-for="(item, index) in formItems" :key="index">
          <!-- 普通单行/多行文本输入 -->
          <el-form-item :label="item.label" v-if="item.type === 'input'">
            <el-input v-model="formData[item.prop]" type="textarea" :rows="1" autosize :placeholder="`请输入${item.label}`" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import mammoth from 'mammoth'
import { useFileStore } from '@/stores/fileStore.js'
import axios from 'axios'
const file = ref(null)
const fileStore = useFileStore()
// 1. 定义响应式数据
const originalText = ref('') // 用于存储解析后的 HTML
const loading = ref(false)
const loadingError = ref(false)
const formItems = [
  { label: '编号', prop: 'patientId', type: 'input' },
  { label: '姓名', prop: 'patientName', type: 'input' },
  { label: '性别', prop: 'patientGender', type: 'input' },
  { label: '年龄', prop: 'patientAge', type: 'input' },
  { label: '职业', prop: 'patientCareer', type: 'input' },
  { label: '住址', prop: 'patientAddress', type: 'input' },
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
  { label: '治疗方案', prop: 'caseTreatment', type: 'input' },
  { label: '其他', prop: 'caseOther', type: 'input' }
]

const formData = reactive({
  patientId: '',
  patientName: '',
  patientGender: '',
  patientAge: '',
  patientCareer: '',
  patientAddress: '',
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
  caseTreatment: '',
  caseOther: ''
})

// 定义表单引用，用于校验
const recordFormRef = ref(null)


// 1. 获取病例详情的方法
const fetchData = () => {
  const fileToUse = fileStore.currentFile;
  
  if (!fileToUse) {
    ElMessage.warning('请先选择或上传文件');
    return;
  }

  // ✅ 中央进度条加载
  const loadingInstance = ElLoading.service({
    target: document.body,
    fullscreen: false,
    lock: true,
    text: '正在提取数据 0%',
    background: 'rgba(255, 255, 255, 0.85)',
    customClass: 'center-loading progress-loading'
  })

  // 模拟进度条
  let progress = 0
  const progressTimer = setInterval(() => {
    progress += 5
    if (progress > 95) progress = 95
    loadingInstance.setText(`正在提取数据 ${progress}%`)
  }, 1000)

  const url = '/fuo-aiads/business/extract';
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    try {
      const arrayBuffer = e.target.result;
      const response = await axios.post(url, {
        file: fileToUse
      }, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data.data || {};
      formData.patientId = data.patientId || '' 
      formData.patientName = data.patientName || ''
      formData.patientGender = data.patientGender || ''
      formData.patientAge = data.patientAge || ''
      formData.patientCareer = data.patientCareer || ''
      formData.patientAddress = data.patientAddress || ''
      formData.caseChief = data.caseChief || ''
      formData.casePresent = data.casePresent || ''
      formData.casePast = data.casePast || ''
      formData.caseFamily = data.caseFamily || ''
      formData.caseAllergy = data.caseAllergy || ''
      formData.casePerson = data.casePerson || ''
      formData.caseTreatment = data.caseTreatment || ''
      formData.caseDiseaseType = data.caseDiseaseType || ''
      formData.caseDiagnostic = data.caseDiagnostic || ''
      formData.caseOther = data.caseOther || ''

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
      
      ElMessage.success('提取成功')
    } catch (err) {
      console.error('❌ 请求失败:', err);
      ElMessage.error('提取失败');
    } finally {
      clearInterval(progressTimer)
      loadingInstance.setText('正在提取数据 100%')
      setTimeout(() => {
        loadingInstance.close()
      }, 200)
    }
  };
  
  reader.onerror = () => {
    clearInterval(progressTimer)
    loadingInstance.close()
    ElMessage.error('文件读取失败');
  };
  
  reader.readAsArrayBuffer(fileToUse);
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

// 3. 改造后的 handleSave 方法
const handleSave = async () => {
  if (!formData.patientName || !formData.patientAge || !formData.patientGender) {
    ElMessage.warning('缺少患者登记信息，无法保存')
    return
  }
  let responseId = {}
  let newPatientForm = {patientName: formData.patientName, patientGender: formData.patientGender, patientAge: Number(formData.patientAge)}
  console.log('开始保存')
  let res = await axios.post('/fuo-aiads/register/createRegistedPatient', { data: newPatientForm })
  if(res.data){
    responseId = res.data.data
    console.log('保存成功', responseId)
  }
  await delay(2000) // 延迟 1 秒，等待后端处理完成
  update(responseId)
  // 将前端展示用的字符串，转换回后端需要的对象数组
}
const update = (responseId)=>{
    const submitData = {
    registerId: responseId.registerId, // 带上主键ID用于后端更新
    caseId:responseId.caseId, // 带上病历ID用于后端更新
    patientId: responseId.patientId,
    patientName: formData.patientName,
    patientGender: formData.patientGender,
    patientAge: formData.patientAge,
    patientCareer: formData.patientCareer,
    patientAddress: formData.patientAddress,
    caseChief: formData.caseChief,
    casePresent: formData.casePresent,
    casePast: formData.casePast,
    caseFamily: formData.caseFamily,
    caseAllergy: formData.caseAllergy,
    casePerson: formData.casePerson,
    caseDiseaseType: formData.caseDiseaseType,
    caseDiagnostic: formData.caseDiagnostic,
    caseTreatment: formData.caseTreatment,
    caseOther: formData.caseOther,
    // 调用解析函数，将 "身高: 176cm" 还原为 [{ itemName: '身高', itemValue: '176', itemUnit: 'cm' }]
   casePhysicalExam: parseExamString(formData.casePhysicalExam).length > 0 ? parseExamString(formData.casePhysicalExam) : null,
    caseNormalExam: parseExamString(formData.caseNormalExam).length > 0 ? parseExamString(formData.caseNormalExam) : null,
    caseSpecificExam: parseExamString(formData.caseSpecificExam).length > 0 ? parseExamString(formData.caseSpecificExam) : null,
  }
  console.log('💾 准备提交给后端的数据：', submitData)
  // 发送 POST 请求保存（假设后端保存接口为 /register/saveCase）
  axios.post('/fuo-aiads/register/updateCase', {data:submitData}).then((res) => {
    ElMessage.success('保存成功',res.data)
  }).catch((err) => {
    console.error('❌ 保存失败:', err)
    ElMessage.error('保存失败，请检查网络或联系管理员')
  })
}
// 封装一个延迟函数，单位是毫秒
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
// 表单数据模型 (保持不变)
const form = reactive({
  id: '',
  name: '',
  gender: '',
  age: '',
  occupation: '',
  address: '',
  complaint: '',
  historyPresent: '',
  historyPast: '',
  historyFamily: '',
  historyAllergy: '',
  historyPersonal: '',
  examination: '',
  nonSpecificTests: [{
    ph: '', crp: '', glucose: '', alb: '', alt: '', ast: '', na: '', k: '', culture: '', syphilis: ''
  }],
  specificTests: [],
  diagnosisType: '',
  diagnosisDetail: '',
  treatment: '',
  other: ''
})
// 3. 解析文档的核心方法
const loadDocument = async (file) => {
  // 重置状态
  loadingError.value = false
  originalText.value = '正在解析文档...'

  try {
    // 检查文件类型
    if (!file.type || !file.type.includes("word") && !file.name.endsWith(".docx")) {
      throw new Error("请上传有效的 .docx 文件")
    }

    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    
    // 获取解析后的 HTML 字符串
    originalText.value = result.value 
    
    // 可选：处理警告信息
    if (result.messages.length > 0) {
      console.warn("文档解析警告:", result.messages)
    }
  } catch (err) {
    console.error("文档解析失败:", err)
    loadingError.value = true
    originalText.value = `<div style="color: red; font-size: 12px;">解析错误: ${err.message}</div>`
    ElMessage.error('文档解析失败，请检查文件是否损坏')
  }
}

// 2. 监听 Store 中的文件变化
watch(
  () => fileStore.currentFile,
  (newFile) => {
    if (newFile) {
      loadDocument(newFile)
    } else {
      originalText.value = '<p>暂无文档，请在左侧选择或上传文件。</p>'
    }
  },
  { immediate: true } // 立即执行一次，处理页面加载时已存在的文件
)


// 模拟AI识别功能 (保持不变)
const handleAIRecognition = () => {
  loading.value = true
  setTimeout(() => {
    form.name = '张三'
    form.gender = '女'
    form.age = '61'
    form.address = '北京市崇文区'
    form.complaint = '发热一周余'
    form.historyPresent = '1周前受凉后出现间断高热，体温最高达39.9℃，畏寒、寒战，咳嗽，咳少量白色痰液，略稀薄，易咳出，伴乏力、咽痛及周身肌肉酸痛。'
    form.historyPast = '高血压、糖尿病、慢性支气管炎、高脂血症、双膝骨性关节炎及甲状腺结节病史，既往行剖宫产术、左下肢软骨瘤摘除术，术后恢复良好。'
    form.examination = '双肺呼吸音粗，左下肺可闻及散在干性啰音。'
    form.nonSpecificTests[0] = {
      ph: '7.49', crp: '160', glucose: '11.15', alb: '31.6',
      alt: '112', ast: '89.6', na: '127.2', k: '3.13',
      culture: '阴性', syphilis: '阴性'
    }
    form.specificTests = ['副肿瘤综合征', '右肺原位腺癌', '慢性支气管炎', '高血压3级', '高脂血症', '2型糖尿病']
    form.diagnosisType = '感染性疾病'
    form.diagnosisDetail = '副肿瘤综合征、右肺原位腺癌、慢性支气管炎、高血压3级、高脂血症、2型糖尿病......'
    form.treatment = '右肺占位切除术、停用其它所有药物'
    form.other = '术后未再发热，同时未再服用激素，于2020年9月1日主因非ST抬高心肌梗死再次入我院心内科，2年间患者未再发热'
    loading.value = false
    ElMessage.success('AI识别完成，已自动填充表单')
  }, 1500)
}
onMounted(( )=>{
  file.value = fileStore.currentFile
  console.log('file', file.value)
})

</script>

<style scoped>
.medical-record-container {
  padding: 20px;
  background-color: #f5f7fa;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

/* 左侧文档样式 */
.original-doc {
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  border-radius: 4px;
}

.doc-title {
  background-color: #ffeb3b;
  display: inline-block;
  padding: 2px 8px;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.doc-content {
  font-family: 'Songti SC', 'SimSun', serif;
  line-height: 1.8;
  color: #333;
  font-size: 14px;
}

.doc-content h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #000;
}

.doc-content p {
  text-indent: 2em;
  margin-bottom: 10px;
  text-align: justify;
}

/* 空状态和错误状态样式 */
.empty-state,
.error-state {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.error-state {
  color: #f56c6c;
}

/* 右侧表单样式 */
.structured-form {
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  border-radius: 4px;
}

.form-header {
  text-align: right;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.empty-text {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
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
/* 进度条加载样式 */
:deep(.progress-loading .el-loading-text) {
  margin-top: 12px;
  font-size: 14px;
  color: #409eff;
}
:deep(.progress-loading .el-loading-spin) {
  margin-bottom: 6px;
}
:deep(.progress-loading .el-loading-spin svg) {
  animation: rotating 1.2s linear infinite;
  color: #409eff;
}
</style>