<template>
  <div class="app-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 核心操作区 -->
      <div class="content-body">
        <!-- 动态组件渲染区域 -->
        <div class="component-wrapper">
          <!-- 增加非空判断，确保数据加载完成后再渲染子组件 -->
          <AuxiliaryDiagnosis
            :knowledge="knowledgeGraphResults"
            v-if="activeTab === 'diagnosis' && Object.keys(knowledgeGraphResults).length"
          />
          <!-- 加载中占位（可选） -->
          <div v-if="activeTab === 'diagnosis' && !Object.keys(knowledgeGraphResults).length" class="loading">
            诊断数据加载中...
          </div>
          <TreatmentRecommendation
            :treatment="treatmentResults"
            v-else-if="activeTab === 'treatment'"
          />
        </div>

        <!-- 切换按钮组：固定在底部 -->
        <div class="tab-switch">
          <el-button
            :color="activeTab === 'diagnosis' ? '#fa8c16' : '#1890ff'"
            @click="switchTab('diagnosis')"
            class="btn-diagnosis"
          >
            辅助诊断
          </el-button>
          <el-button
            :color="activeTab === 'treatment' ? '#fa8c16' : '#1890ff'"
            @click="switchTab('treatment')"
            class="btn-treatment"
          >
            治疗建议与用药推荐
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import AuxiliaryDiagnosis from '@/components/AuxiliaryDiagnosis.vue';
import TreatmentRecommendation from '@/components/TreatmentRecommendation.vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const props = defineProps({
  activeButton: {
    type: String,
    default: 'auxiliaryDiagnosis',
  },
  caseInfo: {
    type: Object,
    default: () => ({}),
  },
});

const activeTab = ref('diagnosis');
const knowledgeGraphResults = ref({});
const treatmentResults = ref({});

// 初始化标签
activeTab.value = props.activeButton === 'auxiliaryDiagnosis' ? 'diagnosis' : 'treatment';

// 统一请求入口：根据当前标签请求对应接口
const loadData = async () => {
  // 没有病例信息不请求
  if (!props.caseInfo || Object.keys(props.caseInfo).length === 0) {
    knowledgeGraphResults.value = {}
    treatmentResults.value = {}
    return;
  }

  try {
    if (activeTab.value === 'diagnosis') {
      // 请求辅助诊断接口
      let res = await axios.post('/fuo-aiads/business/diagnosis', {
        data: props.caseInfo,
      });
      if (res.data.code) {
        knowledgeGraphResults.value = res.data.data || {};
        console.log('辅助诊断结果:', knowledgeGraphResults.value);
      }
    } else {
      // 请求治疗建议接口
      let res = await axios.post('/fuo-aiads/business/treatment', {
        data: props.caseInfo,
      });
      if (res.data.code) {
        treatmentResults.value = res.data.data.treatment_results || {};
        console.log('治疗建议结果:', treatmentResults.value);
      }
    }
  } catch (err) {
    ElMessage.error('数据请求失败，请重试');
    console.error(err);
  }
};

// 切换标签并刷新数据
const switchTab = (tab) => {
  activeTab.value = tab;
  loadData();
};

// 监听 activeButton 变化 → 自动切换标签
watch(
  () => props.activeButton,
  (newVal) => {
    // 父组件切换按钮时，自动同步切换
    if (newVal === 'auxiliaryDiagnosis') {
      activeTab.value = 'diagnosis';
    } else {
      activeTab.value = 'treatment';
    }
    loadData(); // 切换后重新加载数据
  }
);

// 监听：标签变化 → 重新请求
watch(activeTab, () => {
  loadData();
});

// 监听：病例信息变化 → 重新请求当前标签数据
watch(
  () => props.caseInfo,
  () => {
    loadData();
  },
  { deep: true }
);

// 初始加载
loadData();
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  background: #fff;
  border-left: 1px solid #e8e8e8;
}

.component-wrapper {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.tab-switch {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  z-index: 10;
}

.btn-diagnosis {
  color: white;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 4px 0 0 4px;
  width: 50%;
}

.btn-treatment {
  color: white;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
  width: 50%;
}
</style>