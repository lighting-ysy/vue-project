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
            <el-button type="success" @click="handleAIRecognition" :loading="loading">提取</el-button>
            <el-button type="primary" >新增</el-button>
          </div>
          <el-form :model="form" label-width="80px" size="small" label-position="right">
            <!-- 基本信息 -->
            <el-table :data="[form]" border style="width: 100%; margin-bottom: 10px">
              <el-table-column label="编号" width="80">
                <template #default="scope">
                  <el-input v-model="scope.row.id" disabled />
                </template>
              </el-table-column>
              <el-table-column label="姓名" width="120">
                <template #default="scope">
                  <el-input v-model="scope.row.name" />
                </template>
              </el-table-column>
              <el-table-column label="性别" width="80">
                <template #default="scope">
                  <el-select v-model="scope.row.gender" placeholder="性别">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="年龄" width="80">
                <template #default="scope">
                  <el-input v-model="scope.row.age" />
                </template>
              </el-table-column>
              <el-table-column label="职业" width="120">
                <template #default="scope">
                  <el-input v-model="scope.row.occupation" />
                </template>
              </el-table-column>
              <el-table-column label="住址">
                <template #default="scope">
                  <el-input v-model="scope.row.address" />
                </template>
              </el-table-column>
            </el-table>

            <!-- 主诉与病史 -->
            <el-form-item label="主诉">
              <el-input v-model="form.complaint" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="现病史">
              <el-input v-model="form.historyPresent" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="既往史">
              <el-input v-model="form.historyPast" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="家族史">
              <el-input v-model="form.historyFamily" />
            </el-form-item>
            <el-form-item label="过敏史">
              <el-input v-model="form.historyAllergy" />
            </el-form-item>
            <el-form-item label="个人史">
              <el-input v-model="form.historyPersonal" />
            </el-form-item>
            <el-form-item label="体格检查">
              <el-input v-model="form.examination" type="textarea" :rows="2" />
            </el-form-item>

            <!-- 非特异性检查结果 (表格形式) -->
            <el-form-item label="非特异性检查">
              <el-table :data="form.nonSpecificTests" border style="width: 100%">
                <el-table-column prop="ph" label="PH" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.ph" />
                  </template>
                </el-table-column>
                <el-table-column prop="crp" label="C反应蛋白" width="100">
                  <template #default="scope">
                    <el-input v-model="scope.row.crp" />
                  </template>
                </el-table-column>
                <el-table-column prop="glucose" label="血糖" width="100">
                  <template #default="scope">
                    <el-input v-model="scope.row.glucose" />
                  </template>
                </el-table-column>
                <el-table-column prop="alb" label="ALB" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.alb" />
                  </template>
                </el-table-column>
                <el-table-column prop="alt" label="ALT" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.alt" />
                  </template>
                </el-table-column>
                <el-table-column prop="ast" label="AST" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.ast" />
                  </template>
                </el-table-column>
                <el-table-column prop="na" label="Na+" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.na" />
                  </template>
                </el-table-column>
                <el-table-column prop="k" label="K+" width="80">
                  <template #default="scope">
                    <el-input v-model="scope.row.k" />
                  </template>
                </el-table-column>
                <el-table-column prop="culture" label="血培养" width="100">
                  <template #default="scope">
                    <el-input v-model="scope.row.culture" />
                  </template>
                </el-table-column>
                <el-table-column prop="syphilis" label="艾梅乙丙" width="100">
                  <template #default="scope">
                    <el-input v-model="scope.row.syphilis" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <!-- 特异性检查结果 (动态渲染) -->
            <el-form-item label="特异性检查">
              <div class="dynamic-tags">
                <el-tag 
                  v-for="(tag, index) in form.specificTests" 
                  :key="index" 
                  type="info" 
                  style="margin-right: 10px; margin-bottom: 10px"
                  closable 
                  @close="form.specificTests.splice(index, 1)"
                >
                  {{ tag }}
                </el-tag>
                <span v-if="form.specificTests.length === 0" class="empty-text">
                  暂无特异性检查结果，AI将自动解析
                </span>
              </div>
            </el-form-item>

            <!-- 诊断结果 -->
            <el-form-item label="诊断结果">
              <div style="display: flex; align-items: center">
                <span style="margin-right: 10px; font-weight: bold; color: red">病因类型</span>
                <el-select v-model="form.diagnosisType" placeholder="请选择" style="width: 150px; margin-right: 20px">
                  <el-option label="感染性疾病" value="感染性疾病" />
                  <el-option label="非感染性疾病" value="非感染性疾病" />
                </el-select>
                <span style="margin-right: 10px; font-weight: bold; color: red">明确诊断</span>
                <el-input v-model="form.diagnosisDetail" type="textarea" :rows="2" />
              </div>
            </el-form-item>

            <!-- 治疗与其他 -->
            <el-form-item label="治疗">
              <el-input v-model="form.treatment" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="其他">
              <el-input v-model="form.other" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import mammoth from 'mammoth' // 引入 mammoth 库
import { useFileStore } from '@/stores/fileStore.js'

const fileStore = useFileStore()
console.log(fileStore.currentFile)
// 1. 定义响应式数据
const originalText = ref('') // 用于存储解析后的 HTML
const loading = ref(false)
const loadingError = ref(false)

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

const handleSave = () => {
  ElMessage.success('保存成功')
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除当前记录吗？', '警告', { type: 'error' }).then(() => {
    ElMessage.success('删除成功')
  })
}
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
</style>