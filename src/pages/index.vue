<template>
  <div>{{ store.count }}</div>
  <div class="flowchart-container">
    <svg :width="width" :height="height" class="svg-flowchart">
      <!-- 连接线 -->
      <path 
        v-for="(connection, index) in connections" 
        :key="`conn-${index}`"
        :d="calculatePath(connection)"
        class="connection-line"
        :class="connection.class"
        marker-end="url(#arrowhead)"
      />
      
      <!-- 条件分支文字 -->
      <text 
        v-for="(condition, index) in conditionTexts"
        :key="`condition-${index}`"
        :x="condition.x"
        :y="condition.y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="condition-text"
      >
        {{ condition.text }}
      </text>
      
      <!-- 节点 -->
      <g 
        v-for="node in nodes" 
        :key="node.id"
        @click="onNodeClick(node)"
        class="node-group"
      >
        <!-- 所有节点都是圆形 -->
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="nodeRadius"
          :class="{
            'start-node': node.type === 'start',
            'end-node': node.type === 'end',
            'process-node': node.type === 'process',
            'decision-node': node.type === 'decision'
          }"
        />
        
        <!-- 节点图片 -->
        <image
          v-if="node.image"
          :x="node.x - imageSize / 2"
          :y="node.y - imageSize / 2"
          :width="imageSize"
          :height="imageSize"
          :href="node.image"
          class="node-image"
        />
        
        <!-- 节点图标文字（无图片时显示） -->
        <text 
          v-else
          :x="node.x" 
          :y="node.y" 
          text-anchor="middle"
          dominant-baseline="middle"
          class="node-icon-text"
        >
          {{ node.icon }}
        </text>
        
        <!-- 节点名称文字 -->
        <text 
          :x="node.x" 
          :y="node.y + nodeRadius + 25" 
          text-anchor="middle"
          dominant-baseline="middle"
          class="node-text"
        >
          {{ node.name }}
        </text>
      </g>
      
      <!-- 箭头标记定义 -->
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            class="arrowhead"
          />
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {store} from '../store'
console.log(store.count)
const width = 1200
const height = 600
const nodeRadius = 25  // 减小圆形半径
const imageSize = nodeRadius * 2  // 图片尺寸与圆形直径一致

// 节点数据 - 包含分支的横向流程图
const nodes = ref([
  { 
    id: 'start', 
    name: '开始', 
    x: 100, 
    y: 300,
    type: 'start',
    image: 's.png'
  },
  { 
    id: 'process1', 
    name: '中消处理', 
    x: 250, 
    y: 300,
    type: 'process',
    image: 'c.png'
  },
  { 
    id: 'decision1', 
    name: '审核判断', 
    x: 400, 
    y: 300,
    type: 'decision',
    image: 'c.png'
  },
  { 
    id: 'approve', 
    name: '审核通过', 
    x: 550, 
    y: 200,
    type: 'process',
    image: 'c.png'
  },
  { 
    id: 'reject', 
    name: '审核驳回', 
    x: 550, 
    y: 400,
    type: 'process',
    image: 'c.png'
  },
  { 
    id: 'process2', 
    name: '继续处理', 
    x: 700, 
    y: 200,
    type: 'process',
    image: 'c.png'
  },
  { 
    id: 'process3', 
    name: '重新提交', 
    x: 700, 
    y: 400,
    type: 'process',
    image: 'c.png'
  },
  { 
    id: 'decision2', 
    name: '最终判断', 
    x: 850, 
    y: 300,
    type: 'decision',
    image: 'c.png'
  },
  { 
    id: 'end', 
    name: '结束', 
    x: 1000, 
    y: 300,
    type: 'end',
    image: 'e.png'
  }
])

// 连接线数据
const connections = computed(() => [
  // 主流程
  { source: nodes.value[0], target: nodes.value[1], class: 'main-flow' },
  { source: nodes.value[1], target: nodes.value[2], class: 'main-flow' },
  
  // 分支1 - 通过
  { source: nodes.value[2], target: nodes.value[3], class: 'approve-flow' },
  { source: nodes.value[3], target: nodes.value[5], class: 'approve-flow' },
  { source: nodes.value[5], target: nodes.value[7], class: 'approve-flow' },
  
  // 分支2 - 驳回
  { source: nodes.value[2], target: nodes.value[4], class: 'reject-flow' },
  { source: nodes.value[4], target: nodes.value[6], class: 'reject-flow' },
  { source: nodes.value[6], target: nodes.value[7], class: 'reject-flow' },
  
  // 最终流程
  { source: nodes.value[7], target: nodes.value[8], class: 'main-flow' }
])

// 条件文字
const conditionTexts = computed(() => [
  { x: 470, y: 250, text: '通过' },
  { x: 470, y: 350, text: '' },
  { x: 920, y: 250, text: '' },
  { x: 920, y: 350, text: '' }
])

const calculatePath = (connection) => {
  const source = connection.source
  const target = connection.target
  
  const startX = source.x + nodeRadius
  const startY = source.y
  const endX = target.x - nodeRadius
  const endY = target.y
  
  // 如果是水平连接，直接直线
  if (Math.abs(startY - endY) < 50) {
    return `M ${startX} ${startY} L ${endX} ${endY}`
  }
  
  // 如果是垂直分支，添加折线
  const midX = (startX + endX) / 2
  return `M ${startX} ${startY} 
          L ${midX} ${startY} 
          L ${midX} ${endY} 
          L ${endX} ${endY}`
}

const onNodeClick = (node) => {
  console.log('点击节点:', node.name)
  // 节点点击处理逻辑
}
const str = "{\"uniquekey\":\"newProcess1758184492262\",\"name\":\"22\",\"description\":\"20250924测试\",\"initNum\":20,\"nodes\":{\"HKFlow_node_3\":{\"key\":\"HKFlow_node_3\",\"name\":\"开始\",\"left\":115,\"top\":222,\"type\":\"start\",\"width\":60,\"height\":48,\"alt\":true},\"HKFlow_node_4\":{\"key\":\"HKFlow_node_4\",\"name\":\"结束\",\"left\":851,\"top\":324,\"type\":\"end\",\"width\":60,\"height\":48,\"alt\":true},\"HKFlow_node_11\":{\"key\":\"HKFlow_node_11\",\"name\":\"提检申请\",\"left\":135,\"top\":338,\"type\":\"custom\",\"width\":60,\"height\":48,\"alt\":true,\"config\":{\"classname\":\"\"},\"mode\":\"0\"},\"HKFlow_node_12\":{\"key\":\"HKFlow_node_12\",\"name\":\"申请处理\",\"left\":321,\"top\":238,\"type\":\"custom\",\"width\":60,\"height\":48,\"alt\":true,\"config\":{\"classname\":\"\"},\"mode\":\"0\"},\"HKFlow_node_13\":{\"key\":\"HKFlow_node_13\",\"name\":\"任务处理\",\"left\":449,\"top\":340,\"type\":\"custom\",\"width\":60,\"height\":48,\"alt\":true,\"config\":{\"classname\":\"\"},\"mode\":\"0\"},\"HKFlow_node_14\":{\"key\":\"HKFlow_node_14\",\"name\":\"任务审核\",\"left\":593,\"top\":224,\"type\":\"custom\",\"width\":60,\"height\":48,\"alt\":true,\"config\":{\"classname\":\"\"}}},\"lines\":{\"HKFlow_line_15\":{\"type\":\"sl\",\"from\":\"HKFlow_node_3\",\"to\":\"HKFlow_node_11\",\"name\":\"\",\"lp\":\"109,278\",\"mode\":\"common\"},\"HKFlow_line_16\":{\"type\":\"sl\",\"from\":\"HKFlow_node_11\",\"to\":\"HKFlow_node_12\",\"name\":\"\",\"lp\":\"212,286\",\"mode\":\"common\"},\"HKFlow_line_17\":{\"type\":\"sl\",\"from\":\"HKFlow_node_12\",\"to\":\"HKFlow_node_13\",\"name\":\"\",\"lp\":\"369,287\",\"mode\":\"common\"},\"HKFlow_line_18\":{\"type\":\"sl\",\"from\":\"HKFlow_node_13\",\"to\":\"HKFlow_node_14\",\"name\":\"\",\"lp\":\"505,280\",\"mode\":\"common\"},\"HKFlow_line_19\":{\"type\":\"sl\",\"from\":\"HKFlow_node_14\",\"to\":\"HKFlow_node_4\",\"name\":\"\",\"lp\":\"706,272\",\"mode\":\"common\"}},\"areas\":{},\"config\":{\"completeStatus\":1,\"completeCallback\":2,\"selectedNodes\":[]}}"
const jj = JSON.parse(str)
console.log(jj)
</script>

<style scoped>
.flowchart-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.svg-flowchart {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}

.connection-line {
  fill: none;
  stroke-width: 2;
  transition: all 0.3s;
}

.main-flow {
  stroke: #409EFF;
}

.approve-flow {
  stroke: #409EFF;
}

.reject-flow {
  stroke: #409EFF;
}

.condition-text {
  fill: #666;
  font-size: 12px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  pointer-events: none;
}

.node-group {
  cursor: pointer;
  transition: all 0.3s;
}

.node-circle {
  stroke-width: 2;
  transition: all 0.3s;
}

.start-node {
  fill: #fafafa;
  stroke: #fafafa;
}

.process-node {
  fill: #fafafa;
  stroke: #fafafa;
}

.decision-node {
  fill: #fafafa;
  stroke: #fafafa;
}

.end-node {
  fill: #fafafa;
  stroke: #fafafa;
}

.node-group:hover .node-circle {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  transform: scale(1.05);
}

.node-image {
  pointer-events: none;
}

.node-icon-text {
  fill: white;
  font-size: 16px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  pointer-events: none;
}

.node-text {
  fill: #333;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 500;
  pointer-events: none;
}

.arrowhead {
  fill: #409EFF;
}

.main-flow ~ marker .arrowhead {
  fill: #409EFF;
}

.approve-flow ~ marker .arrowhead {
  fill: #67C23A;
}

.reject-flow ~ marker .arrowhead {
  fill: #F56C6C;
}
</style>