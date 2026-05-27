<template>
  <div class="filter-container">
    <h3 class="filter-title">个人信息</h3>

    <el-input
      v-model="searchQuery"
      placeholder="请输入姓名或首拼"
      class="search-input"
      clearable
    />

    <!-- 核心修改：改成可取消选中的单选组 -->
    <el-radio-group v-model="gender" class="gender-group">
      <el-radio :label="1" border @click.native.prevent="handleGenderClick(1)">男</el-radio>
      <el-radio :label="0" border @click.native.prevent="handleGenderClick(0)">女</el-radio>
    </el-radio-group>

    <div class="filter-row">
      <div
        v-for="(item, index) in localList"
        :key="index"
        class="rule-item-wrapper"
      >
        <div class="rule-builder">
          <!-- 第一行：指标 + 运算符 -->
          <div class="row">
            <el-select v-model="item.metric" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="opt in metricOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>

            <el-select v-model="item.ageType" placeholder="=" style="width: 100%">
              <el-option
                v-for="opt in operatorOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>

          <!-- 第二行：数值1 + 数值2 -->
          <div class="row">
            <el-input v-model="item.ageValue1" placeholder="数值1" />
            <el-input v-model="item.ageValue2" placeholder="数值2" :disabled="item.ageType !== '范围'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 1. 接收父组件传入的值
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const localList = ref([{
  metric: 'age',
  ageType: '等于',
  ageValue1: null,
  ageValue2: null
}])

// 2. 定义更新事件
const emit = defineEmits(['update:modelValue'])

// 3. 把所有数据绑定到 props.modelValue 上
const searchQuery = ref('')
// 初始值改为 null = 不选中任何性别
const gender = ref(null)

// 性别点击处理：实现取消选中
const handleGenderClick = (val) => {
  // 如果点击的是当前选中的值，就清空
  if (gender.value === val) {
    gender.value = null
  } else {
    // 否则选中
    gender.value = val
  }
}

// 4. 自动同步给父组件
const syncToParent = () => {
  emit('update:modelValue', {
    patientName: searchQuery.value,
    // 空值时传 null，更规范
    patientGender: gender.value === 1 ? '男' : gender.value === 0 ? '女' : null,
    ageType: localList.value[0].ageType,
    ageValue1: localList.value[0].ageValue1,
    ageValue2: localList.value[0].ageValue2
  })
}

const addItem = () => {
  localList.value.push({
    metric: '',
    ageType: '',
    ageValue1: null,
    ageValue2: null
  })
}

// --- 选项数据 ---
const metricOptions = [
  { label: '年龄', value: 'age' },
  { label: '血压', value: 'blood_pressure' },
  { label: '心率', value: 'heart_rate' }
]

const operatorOptions = [
  { label: '等于', value: '等于' },
  { label: '大于', value: '大于'},
  { label: '小于', value: '小于' },
  { label: '大于等于', value: '大于等于' },
  { label: '小于等于', value: '小于等于' },
  { label: '范围', value: '范围' }
]

// 监听变化自动同步
watch([searchQuery, gender, localList], syncToParent, { deep: true })
</script>

<style scoped>
.filter-container {
  width: 90%;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  flex-direction: column;
  display: flex;
}

.filter-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: normal;
  color: #303133;
}

.search-input {
  width: 100%;
  margin-bottom: 15px;
}

.gender-group {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.add-btn {
  border-radius: 50%;
}

/* 每个 Item 的外层间距 */
.rule-item-wrapper {
  margin-bottom: 10px;
}

/* 具体的卡片样式 */
.rule-builder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: #f0f5ff;
  border-radius: 8px;
  border: 1px solid #d9ecff;
  width: 80%;
}

.row {
  display: flex;
  gap: 10px;
}

.row > * {
  flex: 1;
}
</style>