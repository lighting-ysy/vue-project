diagnosis<template>
  <div class="app-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 核心操作区 -->
      <div class="content-body">
        <!-- 动态组件渲染区域 -->
        <div class="component-wrapper">
          <AuxiliaryDiagnosis v-if="activeTab === 'diagnosis'" />
          <TreatmentRecommendation v-else />
        </div>

        <!-- 切换按钮组：固定在底部 -->
        <div class="tab-switch">
          <el-button
            :color="activeTab === 'diagnosis' ? '#fa8c16' : '#1890ff'"
            @click="activeTab = 'diagnosis'"
            class="btn-diagnosis"
          >
            辅助诊断
          </el-button>
          <el-button
            :color="activeTab === 'treatment' ? '#fa8c16' : '#1890ff'"
            @click="activeTab = 'treatment'"
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
import { ref } from 'vue';
import AuxiliaryDiagnosis from '@/components/AuxiliaryDiagnosis.vue';
import TreatmentRecommendation from '@/components/TreatmentRecommendation.vue';
import { onMounted } from 'vue';
const props = defineProps({
  activeButton: {
    type: String,
    default: 'auxiliaryDiagnosis',
  },
});
const activeTab = ref('diagnosis');
onMounted(() => {
  activeTab.value = props.activeButton == 'auxiliaryDiagnosis' ? 'diagnosis' : 'treatment';
});
</script>

<style scoped>
.app-container {
  width: 100%;
  background-color: #f0f2f5;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
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
  position: relative;
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
  border-radius: 0 4px 4px 0;
  margin-left: -1px;
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