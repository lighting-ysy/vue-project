<template>
  <div class="app-container">
    <!-- 左侧：固定宽度 -->
    <div class="layout-left">
      <PatientList @select="handlePatientSelect" @file-selected="handleFileUpload" @blank-clicked="clearMedicalForm"/>
    </div>

    <!-- 中部：自适应宽度 -->
    <div class="layout-center">
      <MedicalRecordForm  :patientInfo="patientInfo"  @function-click="handleAiAction" @case-info="handleCaseInfo"/>
    </div>

    <!-- 右侧：固定宽度 -->
    <div v-if="(showButton == 'auxiliaryDiagnosis'||showButton == 'treatmentRecommendation')&&rightPage" class="layout-right">
      <!-- <AiAssistant v-if="showButton != 'auxiliaryDiagnosis'&&showButton != 'treatmentRecommendation'" @function-click="handleAiAction" /> -->
      <RightPage :caseInfo="caseInfomation" :activeButton="showButton" />
    </div>
  </div>
</template>

<script setup>
import PatientList from '@/components/PatientList.vue'
import MedicalRecordForm from '@/components/MedicalRecordForm.vue'
import AiAssistant from '@/components/AiAssistant.vue'
import RightPage from '@/components/RightPage.vue'
import axios from 'axios'
import { onMounted,ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFileStore } from '@/stores/fileStore.js' // 引入刚才创建的 Store
import { ElMessage } from 'element-plus'
const router = useRouter()
const patientInfo = ref('')
const rightPage = ref(false)
const fileStore = useFileStore()
const caseInfomation  = ref({})
// 接收子组件传递过来的文件对象
const handleFileUpload = (file) => {
  console.log('父组件接收到文件：', file)
  
  // 1. 将文件存入全局 Store
  fileStore.setFile(file)
  
  // 2. 跳转到新页面
  router.push('/aiads/documentView') 
}
const showButton = ref('')
const handleCaseInfo = (caseInfo) => {
  console.log('父组件接收到病例信息:', caseInfo)
  caseInfomation.value = caseInfo
  // 这里可以添加加载患者数据的逻辑
}
// 接收子组件传递过来的标识，并做相应的逻辑处理
const handleAiAction = (actionType) => {
  console.log('子组件点击了：', actionType)
  
  if (actionType === 'auxiliaryDiagnosis' && Object.keys(patientInfo.value).length>0) {
    // 执行打开中医四诊辅助的逻辑
    console.log('打开中医四诊辅助面板')
    rightPage.value = true
    showButton.value = 'auxiliaryDiagnosis'

  } else if (actionType === 'treatmentRecommendation' && Object.keys(patientInfo.value).length>0) {
    // 执行打开智能处方推荐的逻辑
    console.log('打开智能处方推荐面板')
    rightPage.value = true
    showButton.value = 'treatmentRecommendation'
  }else{
    ElMessage.warning('请选择一条患者病例！')
  }
}
const clearMedicalForm = () => {
  // 1. 清空选中的患者信息（触发 MedicalRecordForm 重新加载空数据）
  patientInfo.value = {};
  rightPage.value = false
}
const handlePatientSelect = (patient) => {
  console.log('切换到患者ID:', patient.registerId)
  patientInfo.value = patient
  // 这里可以添加加载患者数据的逻辑
}
//http://portal.it.sunsheen.cn/cwaiads/service/api/doctor/selectDoctorDepartment?doctorId=40001
const fetchData = () => {
  // 完整请求地址
  const url = '/cwaiads/service/api/doctor/selectDoctorDepartment';
  
  axios.get(url, {
    params: {
      doctorId: 40001  // 自动拼在 ? 后面
    }
  }).then((res) => {
    console.log('✅ 获取医生科室数据成功:', res.data);
  }).catch((err) => {
    console.error('❌ 请求失败:', err);
  });
};
onMounted(()=>{
fetchData();
})
</script>

<style scoped>
/* 整体布局容器 */
.app-container {
  display: flex;
  height: 100vh; /* 占满整个视口高度 */
  width: 100vw;  /* 占满整个视口宽度 */
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

/* 左侧区域样式 */
.layout-left {
  width: 260px; /* 左侧固定宽度 */
  flex-shrink: 0; /* 防止被压缩 */
  border-right: 1px solid #dcdfe6;
  background-color: #fff;
}

/* 中间区域样式 */
.layout-center {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  background-color: #f0f2f5; /* 给中间区域一个浅灰背景，突出白色卡片 */
  overflow-y: auto;
}

/* 右侧区域样式 */
.layout-right {
  width: 340px;
  flex-shrink: 0;
  background-color: #fff;
  border-left: 1px solid #dcdfe6;
  /* 添加以下两行代码 */
  height: 100vh; /* 1. 让右侧容器高度占满视口 */
  overflow: hidden; /* 2. 防止内容溢出 */
}
</style>