<template>
  <div class="app-container">
    <!-- 模拟左侧菜单栏 -->
    <div class="sidebar-left">
      <div class="logo">Logo</div>
      <el-menu default-active="1" class="menu" background-color="#001529" text-color="#fff" active-text-color="#1890ff">
        <el-menu-item index="1">工作台</el-menu-item>
        <el-menu-item index="2">病历管理</el-menu-item>
      </el-menu>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部导航或标题 -->
      <header class="top-header">
        <h2>智能辅助诊疗系统</h2>
      </header>

      <!-- 核心操作区 -->
      <div class="content-body">
        <!-- 切换按钮组 -->
        <div class="tab-switch">
          <el-button
            :type="activeTab === 'diagnosis' ? 'primary' : 'default'"
            @click="activeTab = 'diagnosis'"
            class="btn-diagnosis"
          >
            辅助诊断
          </el-button>
          <el-button
            :type="activeTab === 'treatment' ? 'primary' : 'default'"
            @click="activeTab = 'treatment'"
            class="btn-treatment"
          >
            治疗建议与用药推荐
          </el-button>
        </div>

        <!-- 动态组件渲染 -->
        <div class="component-wrapper">
          <AuxiliaryDiagnosis v-if="activeTab === 'diagnosis'" />
          <TreatmentRecommendation v-else />
        </div>
      </div>
    </div>

    <!-- 模拟右侧信息栏（可选） -->
    <div class="sidebar-right">
      <div class="patient-info">
        <h4>患者信息</h4>
        <p>姓名：张三</p>
        <p>年龄：45岁</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuxiliaryDiagnosis from '@/components/AuxiliaryDiagnosis.vue';
import TreatmentRecommendation from '@/components/TreatmentRecommendation.vue';

// 当前激活的标签页
const activeTab = ref('diagnosis');
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

/* 左侧边栏模拟 */
.sidebar-left {
  width: 200px;
  background-color: #001529;
  color: white;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  background-color: #002140;
}
.menu {
  border-right: none;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  background: #fff;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  z-index: 1;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;
}

/* 按钮切换区域 */
.tab-switch {
  margin-bottom: 20px;
  text-align: center;
}

.btn-diagnosis {
  background-color: #fa8c16; /* 图中黄色/橙色风格 */
  border-color: #fa8c16;
  color: white;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 4px 0 0 4px;
}
.btn-diagnosis:hover, .btn-diagnosis.is-active {
  background-color: #fa8c16;
  border-color: #fa8c16;
  opacity: 0.9;
}

.btn-treatment {
  background-color: #1890ff; /* 图中蓝色风格 */
  border-color: #1890ff;
  color: white;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 0 4px 4px 0;
  margin-left: -1px; /* 连接两个按钮 */
}
.btn-treatment:hover, .btn-treatment.is-active {
  background-color: #1890ff;
  border-color: #1890ff;
  opacity: 0.9;
}

/* 右侧边栏模拟 */
.sidebar-right {
  width: 250px;
  background: #fff;
  padding: 20px;
  border-left: 1px solid #e8e8e8;
}
</style>