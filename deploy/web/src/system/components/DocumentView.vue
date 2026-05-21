<template>
  <div class="medical-record-container">
    <el-row :gutter="20" style="height: 100%">
      <!-- 左侧：病例原文展示 -->
      <el-col :span="9">
        <div class="original-doc">
          <h2 class="doc-title">病例原文</h2>
          <div class="doc-content" v-html="originalText"></div>
        </div>
      </el-col>

      <!-- 右侧：结构化录入表单 -->
      <el-col :span="15">
        <div class="structured-form">
          <!-- 顶部操作栏 -->
          <div class="form-header">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button type="danger" @click="handleDelete">删除</el-button>
            <el-button type="success" @click="handleAIRecognition" :loading="loading">
              AI识别
            </el-button>
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟左侧原始文本（带HTML标签用于展示样式）
const originalText = ref(`
  <h3>一、患者基本信息</h3>
  <p>女性，61岁，北京市崇文区人。</p>
  <h3>二、主诉与现病史</h3>
  <p><strong>2.1 主诉：</strong>发热1周余。</p>
  <p><strong>2.2 现病史：</strong>1周前受凉后出现间断高热，体温最高达39.9℃，伴有畏寒、寒战，偶有咳嗽，咳少量白色痰液，略稀薄，易咳出，伴乏力、咽痛及周身肌肉酸痛。无其他症状。就诊于我院门诊，考虑为呼吸道感染，给予泰诺林等对症治疗，病情无缓解。3天前体温最高达43℃？就诊我院WBC5.8*109/L, GR%69.4%, PLT 92*109/L。甲型、乙型流感病毒抗原检测均阴性。胸片未见异常，仍考虑为呼吸道感染，继续给予上述药物对症治疗，患者病情仍无改善。为求进一步诊治收入我科。</p>
  <h3>三、既往史及其他补充信息</h3>
  <p><strong>3.1 既往史：</strong>高血压、糖尿病、慢性支气管炎、高脂血症、双膝骨性关节炎及甲状腺结节病史，既往行剖宫产术、左下肢软骨瘤摘除术，术后恢复良好。</p>
`)

const loading = ref(false)

// 表单数据模型
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
  // 非特异性检查表格数据（固定一行用于演示，实际可多行）
  nonSpecificTests: [
    {
      ph: '',
      crp: '',
      glucose: '',
      alb: '',
      alt: '',
      ast: '',
      na: '',
      k: '',
      culture: '',
      syphilis: ''
    }
  ],
  // 特异性检查（动态数组）
  specificTests: [],
  diagnosisType: '',
  diagnosisDetail: '',
  treatment: '',
  other: ''
})

// 模拟AI识别功能
const handleAIRecognition = () => {
  loading.value = true

  // 模拟网络延迟
  setTimeout(() => {
    // 1. 解析基本信息
    form.name = '张三'
    form.gender = '女'
    form.age = '61'
    form.address = '北京市崇文区'

    // 2. 解析病史
    form.complaint = '发热一周余'
    form.historyPresent =
      '1周前受凉后出现间断高热，体温最高达39.9℃，畏寒、寒战，咳嗽，咳少量白色痰液，略稀薄，易咳出，伴乏力、咽痛及周身肌肉酸痛。'
    form.historyPast =
      '高血压、糖尿病、慢性支气管炎、高脂血症、双膝骨性关节炎及甲状腺结节病史，既往行剖宫产术、左下肢软骨瘤摘除术，术后恢复良好。'

    // 3. 解析体格检查
    form.examination = '双肺呼吸音粗，左下肺可闻及散在干性啰音。'

    // 4. 解析检查结果 (非特异性)
    form.nonSpecificTests[0] = {
      ph: '7.49',
      crp: '160',
      glucose: '11.15',
      alb: '31.6',
      alt: '112',
      ast: '89.6',
      na: '127.2',
      k: '3.13',
      culture: '阴性',
      syphilis: '阴性'
    }

    // 5. 解析特异性结果 (动态显示几个)
    // 假设AI从文本中“解析”出了这些隐含信息或者关联信息
    form.specificTests = ['副肿瘤综合征', '右肺原位腺癌', '慢性支气管炎', '高血压3级', '高脂血症', '2型糖尿病']

    // 6. 诊断与治疗
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
  ElMessageBox.confirm('确定要删除当前记录吗？', '警告', {
    type: 'error'
  }).then(() => {
    // 重置表单逻辑
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