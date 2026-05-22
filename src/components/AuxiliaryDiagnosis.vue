<template>
  <div class="right-analysis-panel">
    <div class="panel-header">
      <h3>检查指标分析</h3>
    </div>
    
    <div class="panel-body">
      <!-- 随机森林大类结果高亮 -->
      <div class="highlight-box infection">
        <span class="icon">🦠</span>
        <span class="label">大类推断：{{ randomForestType }}</span>
        <el-tag type="success" size="small" effect="dark" class="rate-tag">概率: {{ randomForestProb }}%</el-tag>
      </div>

      <!-- 疾病诊断列表（支持展开/收起） -->
      <div class="disease-list">
        <div v-for="(disease, dIndex) in diseaseList" :key="dIndex" class="disease-group">
          <!-- 疾病名称行（点击可展开） -->
          <div class="disease-item clickable" @click="toggleDisease(dIndex)">
            <span class="arrow" :class="{ expanded: disease.expanded }">▼</span>
            <span class="name">{{ disease.name }}</span>
            <span class="rate">匹配率: {{ disease.matchRate }}%</span>
          </div>

          <!-- 展开的子节点内容 -->
          <transition name="expand">
            <div v-if="disease.expanded" class="disease-children">
              <!-- 子节点：临床表现 -->
              <div class="children-section">
                <h4>临床表现</h4>
                <div class="symptom-list">
                  <div class="symptom-item" v-for="(sym, sIndex) in disease.clinical_matches" :key="sIndex">
                    <el-tag type="success" size="small" effect="plain">匹配</el-tag>
                    <span class="symptom-name">{{ sym.clinical_content }}</span>
                    <span class="symptom-rate">相似度: {{ sym.similarity }}%</span>
                  </div>
                  <div v-if="!disease.clinical_matches.length" class="empty-text">暂无匹配症状</div>
                </div>
              </div>

              <!-- 子节点：辅助检查 -->
              <div class="children-section">
                <h4>辅助检查</h4>
                <div class="check-list">
                  <div class="check-item" v-for="(idx, iIndex) in disease.index_matches" :key="iIndex">
                    <el-checkbox v-model="idx.checked" :disabled="true">{{ idx.index_name }}</el-checkbox>
                    <el-tag v-if="idx.status === '异常'" type="danger" size="small" class="status-tag">已报异常</el-tag>
                    <el-tag v-else type="info" size="small" class="status-tag">已完成</el-tag>
                  </div>
                  <div v-if="!disease.index_matches.length" class="empty-text">暂无匹配检查</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// 你提供的最新 JSON 数据
const apiData = {
  "results": [
    {
      "random_forest_results": { "disease_type": "感染性疾病", "probability": 65.72 },
      "graph_results": {
        "感染性胰腺坏死": {
          "probability": 15.564854,
          "clinical_matches": [{ "clinical_content": "腹痛", "similarity": 100, "weight": 9.4 }],
          "index_matches": [
            { "index_name": "CT", "patient_value": "1、急性胰腺炎...", "status": "已匹配", "checked": true },
            { "index_name": "C反应蛋白", "patient_value": "5.13", "status": "已匹配", "checked": true },
            { "index_name": "白细胞计数", "patient_value": "13.5", "status": "已匹配", "checked": true }
          ],
          "weight_calculation": { "total_weight": 37.2, "total_possible_weight": 239.0 }
        },
        "急性胰腺炎": {
          "probability": 13.403298,
          "clinical_matches": [
            { "clinical_content": "呕吐", "similarity": 100, "weight": 9.0 },
            { "clinical_content": "恶心", "similarity": 100, "weight": 9.0 }
          ],
          "index_matches": [
            { "index_name": "脂肪酶", "patient_value": "1201.1", "status": "异常", "checked": true },
            { "index_name": "血清淀粉酶", "patient_value": "518", "status": "异常", "checked": true },
            { "index_name": "CT", "patient_value": "1、急性胰腺炎...", "status": "已匹配", "checked": true }
          ],
          "weight_calculation": { "total_weight": 44.7, "total_possible_weight": 333.5 }
        },
        "急性坏死性胰腺炎": {
          "probability": 7.2,
          "clinical_matches": [{ "clinical_content": "腹痛", "similarity": 100, "weight": 7.2 }],
          "index_matches": [],
          "weight_calculation": { "total_weight": 7.2, "total_possible_weight": 100.0 }
        }
      }
    },
    { "random_forest_results": { "disease_type": "其他疾病", "probability": 21.23 }, "graph_results": {} },
    { "random_forest_results": { "disease_type": "肿瘤性疾病", "probability": 7.13 }, "graph_results": {} },
    { "random_forest_results": { "disease_type": "非感染性炎症性疾病", "probability": 5.93 }, "graph_results": {} }
  ]
};

// 提取随机森林大类结果
const randomForestType = apiData.results[0].random_forest_results.disease_type;
const randomForestProb = apiData.results[0].random_forest_results.probability;

// 将疾病数据处理成带有 expanded 状态的树形结构
const diseaseList = reactive(Object.keys(apiData.results[0].graph_results).map((key, index) => {
  const item = apiData.results[0].graph_results[key];
  // 动态计算匹配率
  const rate = ((item.weight_calculation.total_weight / item.weight_calculation.total_possible_weight) * 100).toFixed(2);
  return {
    name: key,
    matchRate: rate,
    expanded: index === 0, // 默认展开第一个（匹配率最高的）
    clinical_matches: item.clinical_matches,
    index_matches: item.index_matches
  };
}));

// 切换展开/收起的方法
const toggleDisease = (index) => {
  diseaseList[index].expanded = !diseaseList[index].expanded;
};
</script>

<style scoped>
.right-analysis-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  padding-right: 20px;
  overflow-y: auto;
}
.panel-header h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}
.highlight-box {
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.infection {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
}
.rate-tag { margin-left: auto; }

/* 疾病列表与交互样式 */
.disease-list { display: flex; flex-direction: column; gap: 10px; }
.disease-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #ecf5ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
  font-size: 14px;
  transition: background-color 0.2s;
}
.disease-item.clickable { cursor: pointer; }
.disease-item.clickable:hover { background-color: #d9ecff; }
.disease-item .arrow { 
  color: #409eff; 
  margin-right: 8px; 
  font-size: 10px; 
  transition: transform 0.3s; 
  display: inline-block;
}
.disease-item .arrow.expanded { transform: rotate(0deg); }
.disease-item .arrow:not(.expanded) { transform: rotate(-90deg); }
.disease-item .name { font-weight: 500; color: #303133; margin-right: auto; }
.disease-item .rate { color: #909399; font-size: 12px; }

/* 展开的子节点样式 */
.disease-children {
  background-color: #f5f7fa;
  border-radius: 0 0 4px 4px;
  padding: 10px 12px;
  margin-top: -8px; /* 向上靠拢，消除间隙 */
  border: 1px solid #e4e7ed;
  border-top: none;
}
.children-section { margin-bottom: 15px; }
.children-section:last-child { margin-bottom: 0; }
.children-section h4 { margin: 0 0 10px 0; font-size: 13px; color: #909399; font-weight: normal; }
.empty-text { font-size: 12px; color: #c0c4cc; padding-left: 5px; }

/* 列表样式 */
.symptom-list, .check-list { display: flex; flex-direction: column; gap: 8px; }
.symptom-item, .check-item { display: flex; align-items: center; font-size: 13px; padding: 2px 0; }
.symptom-name, .check-item .el-checkbox { color: #606266; flex: 1; }
.symptom-rate { color: #c0c4cc; font-size: 12px; margin-left: auto; }
.status-tag { margin-left: auto; }

/* Vue 展开收起动画 */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-10px); }
</style>