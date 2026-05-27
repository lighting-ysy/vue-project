<template><div class="filter-container">
    <h3 class="filter-title">症状查询</h3>
  <div class="tag-selector-container">
    <!-- 循环渲染现有的 Tag -->
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      :type="isChecked(tag) ? 'primary' : 'info'"
      :effect="isChecked(tag) ? 'dark' : 'plain'"
      class="tag-item"
      @click="handleTagClick(tag)"
      :closable="false"
    >
      {{ tag.label }}
    </el-tag>

    <!-- 新增 Tag 按钮 / 输入框 -->
    <div v-if="inputVisible" class="input-new-tag">
      <el-input
        ref="InputRef"
        v-model="inputValue"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        style="width: 100px"
      />
    </div>
    <el-tag v-else class="tag-item add-tag" @click="showInput" type="primary" effect="plain">
      <el-icon><Plus /></el-icon> 新增
    </el-tag>
  </div></div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 定义 Props
const props = defineProps({
  // 使用 v-model 绑定的选中值数组
  modelValue: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// --- 数据源 ---
// 模拟你提供的图片中的初始数据
const tags = ref([
  { name: '头痛', label: '头痛' },
  { name: '发热', label: '发热' },
  { name: '呕吐', label: '呕吐' },
  { name: '昏迷', label: '昏迷' },
  { name: '咳嗽', label: '咳嗽' },
  { name: '出血', label: '出血' },
])

// --- 新增 Tag 逻辑 ---
const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref(null)

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    // 检查是否重复
    const exists = tags.value.some(tag => tag.name === inputValue.value)
    if (!exists) {
      tags.value.push({
        name: inputValue.value,
        label: inputValue.value
      })
      // 自动选中新添加的标签（可选逻辑）
      toggleTag({ name: inputValue.value })
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// --- 选中逻辑 ---

// 检查当前 tag 是否在选中的列表中
const isChecked = (tag) => {
  return props.modelValue.includes(tag.name)
}

// 点击 Tag 切换状态
const handleTagClick = (tag) => {
  toggleTag(tag)
}

const toggleTag = (tag) => {
  const currentValues = [...props.modelValue]
  const index = currentValues.indexOf(tag.name)

  if (index > -1) {
    // 已选中，点击则取消
    currentValues.splice(index, 1)
  } else {
    // 未选中，点击则添加
    currentValues.push(tag.name)
  }

  // 触发更新
  emit('update:modelValue', currentValues)
}
</script>

<style scoped>
.filter-container {
  width: 90%; /* 根据图片估算的宽度 */
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
    flex-direction: column;
    display: flex;
}
.tag-selector-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px; /* 标签之间的间距 */
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}
.filter-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: normal;
  color: #303133;
}
.tag-item {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

/* 选中状态的样式微调 (可选) */
.tag-item.is-primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

/* 新增按钮的特定样式 */
.add-tag {
  background-color: #fff;
  border-style: dashed;
  color: #606266;
}

.add-tag:hover {
  color: #409eff;
  border-color: #409eff;
}
</style>