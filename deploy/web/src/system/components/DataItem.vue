<template>
  <div class="rule-builder-group">
    <!-- 头部：标题 + 新增按钮 -->
    <div class="group-header">
      <h3 class="title">检查结果</h3>
      <el-button type="primary" :icon="Plus" circle size="small" @click="addItem" class="add-btn" />
    </div>

    <!-- 循环渲染每一个规则项 -->
    <div v-for="(item, index) in localList" :key="index" class="rule-item-wrapper">
      <div class="rule-builder">
        <!-- 第一行：指标 + 运算符 -->
        <div class="row">
          <!-- 在 el-select 上添加 filterable 属性 -->
          <el-select v-model="item.itemName" placeholder="请选择" filterable remote :remote-method="fetchMetricOptions"
            :loading="loading" style="width: 100%">
            <el-option v-for="opt in metricOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>

          <el-select v-model="item.type" placeholder="=" style="width: 100%">
            <el-option v-for="opt in operatorOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </div>

        <!-- 第二行：数值1 + 数值2 -->
        <div class="row">
          <el-input v-model="item.value1" placeholder="数值1" />
          <el-input v-model="item.value2" placeholder="数值2" :disabled="item.type !== '范围'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
// --- 1. Props & Emits ---
// 接收一个数组
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})
const loading = ref(false)
const emit = defineEmits(['update:modelValue'])

// --- 2. 本地数据同步 ---
// 使用本地 ref 来存储列表，避免直接修改 Props
const localList = ref([])

// 初始化或监听外部变化
watch(
  () => props.modelValue,
  (val) => {
    // 如果外部传进来的是数组，深拷贝一份（简单处理，生产环境建议用 lodash.cloneDeep）
    localList.value = val.map(item => ({ ...item }))
  },
  { immediate: true, deep: true }
)

// 监听本地变化，同步给父组件
watch(
  () => localList.value,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true }
)

// --- 3. 逻辑方法 ---

// 新增 Item
const addItem = () => {
  localList.value.push({
    itemName: '',
    type: '等于',
    value1: null,
    value2: null
  })
}

// --- 4. 选项数据 ---
const metricOptions = ref([])

const operatorOptions = [
  { label: '等于', value: '等于' },
  { label: '大于', value: '大于' },
  { label: '小于', value: '小于' },
  { label: '大于等于', value: '大于等于' },
  { label: '小于等于', value: '小于等于' },
  { label: '范围', value: '范围' }
]
const fetchMetricOptions = async (query = '') => {
  loading.value = true
  try {
    let res = await axios.get('/fuo-aiads/mainsuit/examItemList', {
      params: {
        isDigital: 1,
        itemName: query // 将用户输入的关键词传给后端
      }
    })
    if (res.data.code) {
      metricOptions.value = res.data.data.map(item => ({
        label: item.itemName,
        value: item.itemName
      }))
    }
  } catch (error) {
    console.error("获取指标失败", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 页面加载时，默认拉取一次空搜索的数据
  fetchMetricOptions()
})

</script>

<style scoped>
.rule-builder-group {
  width: 80%;
  /* 如果需要最大宽度限制 */
  /* max-width: 500px; */
}

/* 头部样式 */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  /* margin: 0 0 15px 0; */
  font-size: 16px;
  font-weight: normal;
  color: #303133;
}

.add-btn {
  border-radius: 50%;
}

/* 每个 Item 的外层间距 */
.rule-item-wrapper {
  margin-bottom: 10px;
}

/* 具体的卡片样式 (保持你之前的样式) */
.rule-builder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: #f0f5ff;
  border-radius: 8px;
  border: 1px solid #d9ecff;
  width: 100%;
}

.row {
  display: flex;
  gap: 10px;
}

.row>* {
  flex: 1;
}
</style>