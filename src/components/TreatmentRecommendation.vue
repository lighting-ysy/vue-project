<template>
  <div class="prescription-container">
    <!-- 循环渲染处方单 -->
    <div v-for="(item, index) in prescriptionList" :key="index" class="prescription-card">
      <!-- 顶部标题栏 -->
      <!-- 卡片头部 -->
<div class="card-header">
  <div>
    <!-- 在这里添加 :title 属性，绑定 item.bylaws -->
    <span class="title" :title="item.bylaws">{{ item.title }}</span>
    <span class="count">{{ item.count }}</span>
  </div>
  <el-button type="primary" link class="copy-btn">复用方案</el-button>
</div>

      <!-- 治疗方案/计划列表（复用原专利药列表样式） -->
      <div class="patent-list" v-if="item.patents && item.patents.length > 0">
        <div v-for="(plan, dIndex) in item.patents" :key="dIndex" class="drug-row">
          <!-- 这里只显示 name，隐藏掉 spec 和 count 等不相关的字段 -->
          <span class="drug-name">{{ plan.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 1. 模拟后端返回的 JSON 数据
const treatmentData = {
    "疾病诊断": {
      "disease_name": "急性胰腺炎",
      "disease_type": "感染性疾病",
      "probability": 98.0
    },
    "treatment_list": [
      {
        "treatment_id": "TP001",
        "treatment_content": "“Step-up”方式",
        "treatment_bylaws": "“Step-up”方式，即首先进行穿刺引流，对引流效果不佳的病人依次进行视频辅助清创和开腹手术。",
        "plan_list": [
          {
            "plan_id": "TS001",
            "plan_content": "外科视频辅助清创"
          },
          {
            "plan_id": "TS002",
            "plan_content": "开腹手术"
          },
          {
            "plan_id": "TS003",
            "plan_content": "经皮穿刺引流（PCD）"
          },
          {
            "plan_id": "TS004",
            "plan_content": "内镜下清创"
          },
          {
            "plan_id": "TS005",
            "plan_content": "内镜下穿刺引流"
          },
          {
            "plan_id": "TS006",
            "plan_content": "PCD及内镜下穿刺引流的指征与时机"
          }
        ]
      },
      {
        "treatment_id": "TP002",
        "treatment_content": "内镜下“Step-up”手术",
        "treatment_bylaws": "内镜下“Step-up”手术的使用逐渐增多。",
        "plan_list": [
          {
            "plan_id": "TS007",
            "plan_content": "PCD及内镜下穿刺引流的指征与时机"
          }
        ]
      },
      {
        "treatment_id": "TP003",
        "treatment_content": "液体治疗",
        "treatment_bylaws": "急性胰腺炎的液体治疗早期液体治疗可改善组织灌注，须在诊断急性胰腺炎后即刻进行。对于SAP，可采用目标导向的治疗模式，应反复评估血流动力学状态以指导液体滴注［9］。液体治疗首选乳酸林格液、生理盐水等晶体液［10］。开始时，推荐以5~10mL/（kg·h）的速度进行液体治疗，过程中应警惕液体负荷过重导致的组织水肿及器官功能障碍［11］。",
        "plan_list": [
          {
            "plan_id": "TS008",
            "plan_content": "晶体液液体治疗方案"
          },
          {
            "plan_id": "TS009",
            "plan_content": "给予去甲肾上腺素提升血压"
          }
        ]
      },
      {
        "treatment_id": "TP004",
        "treatment_content": "营养支持",
        "treatment_bylaws": "急性胰腺炎的早期治疗主要包括液体治疗、镇痛与营养支持，以及针对病因和早期并发症的治疗。",
        "plan_list": [
          {
            "plan_id": "TS010",
            "plan_content": "肠内营养启动时机方案"
          }
        ]
      },
      {
        "treatment_id": "TP005",
        "treatment_content": "镇痛",
        "treatment_bylaws": "急性胰腺炎的早期治疗主要包括液体治疗、镇痛与营养支持，以及针对病因和早期并发症的治疗。",
        "plan_list": [
          {
            "plan_id": "TS011",
            "plan_content": "使用镇痛药、镇静药、肌松药等"
          }
        ]
      }
    ]
  }

const prescriptionList = ref([])

// 2. 将治疗数据映射为页面所需的格式
onMounted(() => {
 prescriptionList.value = treatmentData.treatment_list.map(item => ({
  title: item.treatment_content,
  bylaws: item.treatment_bylaws, // 【新增】把治疗细则映射出来，供 title 或 tooltip 使用
  count: `${item.plan_list.length}项`,
  patents: item.plan_list.map(plan => ({
    name: plan.plan_content,
    // plan.bylaws: item.treatment_bylaws, // 如果标题用了提示，这里就可以删掉了
    spec: '',
    usage: '',
    count: ''
  }))
}))
})
</script>

<style scoped>
/* 容器：右侧区域通常较窄，去除外部边距 */
.prescription-container {
  padding: 10px;
  background-color: #f5f7fa; /* 轻微背景色，区分右侧区域 */
  height: 100%;
  overflow-y: auto;
}

/* 处方卡片 */
.prescription-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 15px; /* 卡片之间的间距 */
  overflow: hidden;
}

/* 卡片头部 */
.card-header {
  background-color: #f0f2f5;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.title {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.count {
  margin-left: 10px;
  font-weight: bold;
  color: #303133;
}

.copy-btn {
  padding: 0;
  font-size: 12px;
}

/* 中药表格样式 */
.herbal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.herbal-table td {
  border: 1px solid #ebeef5;
  padding: 6px 8px;
  vertical-align: middle;
}

.name-col {
  width: 35%;
  color: #606266;
}

.dosage-col {
  width: 15%;
  color: #909399;
  text-align: right;
  padding-right: 15px;
}

.herb-name {
  font-weight: 500;
}

.note {
  font-size: 12px;
  color: #f56c6c;
  margin-left: 4px;
}

/* 成药列表样式 */
.patent-list {
  display: flex;
  flex-direction: column;
  gap: 1px; /* 模拟行之间的分割线 */
  background-color: #ebeef5; /* 分割线颜色 */
}

.drug-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 8px 12px;
  font-size: 13px;
  color: #606266;
}

.drug-name {
  flex: 1;
  font-weight: 500;
}

.drug-usage {
  flex: 1.5;
  text-align: center;
  color: #909399;
}

.drug-count {
  flex: 1;
  text-align: right;
  color: #909399;
}
/* 让每一行治疗计划左对齐，并增加一点内边距 */
.drug-row {
  display: flex;
  justify-content: flex-start; /* 修改为左对齐 */
  align-items: center;
  background: #fff;
  padding: 10px 12px; /* 稍微增加高度，更易阅读 */
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #f5f7fa; /* 增加淡淡的底部分割线 */
}

.drug-row:last-child {
  border-bottom: none;
}

.drug-name {
  flex: 1;
  font-weight: 500;
  line-height: 1.5;
}
</style>