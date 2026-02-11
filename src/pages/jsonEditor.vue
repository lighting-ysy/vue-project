<template>
  <div class="json-generator-container">
    <el-page-header content="JSON生成器" />

    <el-row :gutter="20" class="main-content">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">字段管理</div>
          </template>

          <el-space wrap class="action-buttons">
            <el-button type="primary" @click="addField('string')">
              <el-icon><Plus /></el-icon> 添加字段
            </el-button>
            <el-button type="primary" @click="addField('object')">
              <el-icon><FolderAdd /></el-icon> 添加对象
            </el-button>
            <el-button type="primary" @click="addField('array')">
              <el-icon><List /></el-icon> 添加数组
            </el-button>
            <el-button type="danger" @click="resetAll">
              <el-icon><Delete /></el-icon> 重置所有
            </el-button>
          </el-space>

          <el-table
            :data="flatFields"
            border
            v-loading="loading"
            style="margin-top: 20px"
            size="default"
            row-class-name="table-row-large"
          >
            <el-table-column label="字段名称" prop="name" width="240">
              <template #default="scope">
                <el-input
                  v-model="scope.row.name"
                  size="default"
                  @input="updateField(scope.row.id, 'name', scope.row.name)"
                />
              </template>
            </el-table-column>

            <el-table-column label="数据类型" prop="type" width="180">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  size="default"
                  @change="updateField(scope.row.id, 'type', scope.row.type)"
                >
                  <el-option label="字符串" value="string" />
                  <el-option label="数字" value="number" />
                  <el-option label="布尔值" value="boolean" />
                  <el-option label="空值" value="null" />
                  <el-option label="对象" value="object" />
                  <el-option label="数组" value="array" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="字段值" min-width="360">
              <template #default="scope">
                <div v-if="scope.row.type === 'string'">
                  <el-input
                    v-model="scope.row.value"
                    size="default"
                    @input="updateField(scope.row.id, 'value', scope.row.value)"
                  />
                </div>

                <div v-else-if="scope.row.type === 'number'">
                  <el-input-number
                    v-model="scope.row.value"
                    size="default"
                    @change="updateField(scope.row.id, 'value', scope.row.value)"
                  />
                </div>

                <div v-else-if="scope.row.type === 'boolean'">
                  <el-switch
                    v-model="scope.row.value"
                    active-text="是"
                    inactive-text="否"
                    @change="updateField(scope.row.id, 'value', scope.row.value)"
                  />
                </div>

                <div v-else-if="scope.row.type === 'null'">
                  <el-tag type="danger">null</el-tag>
                </div>

                <div v-else-if="scope.row.type === 'object'">
                  <el-tag type="success">嵌套对象</el-tag>
                  <el-button
                    size="default"
                    type="primary"
                    icon="Plus"
                    circle
                    @click="addField('string', scope.row.id, scope.row.nestedLevel + 1)"
                    style="margin-left: 10px"
                  />
                </div>

                <div v-else-if="scope.row.type === 'array'">
                  <el-tag type="warning">数组 ({{ getArrayItems(scope.row.id).length }} 项)</el-tag>
                  <el-button
                    size="default"
                    type="primary"
                    icon="Plus"
                    circle
                    @click="addArrayItem(scope.row.id)"
                    style="margin-left: 10px"
                  />

                  <div v-if="getArrayItems(scope.row.id).length" class="array-items">
                    <el-divider content-position="left">数组项</el-divider>
                    <div v-for="item in getArrayItems(scope.row.id)" :key="item.id" class="array-item">
                      <el-select
                        v-model="item.type"
                        size="default"
                        style="width: 140px"
                        @change="updateArrayItem(scope.row.id, item.id, 'type', item.type)"
                      >
                        <el-option label="字符串" value="string" />
                        <el-option label="数字" value="number" />
                        <el-option label="布尔值" value="boolean" />
                        <el-option label="空值" value="null" />
                        <el-option label="对象" value="object" />
                        <el-option label="数组" value="array" />
                      </el-select>

                      <el-input
                        v-if="item.type === 'string'"
                        v-model="item.value"
                        size="default"
                        style="width: 240px; margin-left: 10px"
                        @input="updateArrayItem(scope.row.id, item.id, 'value', item.value)"
                      />
                      <el-input-number
                        v-else-if="item.type === 'number'"
                        v-model="item.value"
                        size="default"
                        style="width: 240px; margin-left: 10px"
                        @change="updateArrayItem(scope.row.id, item.id, 'value', item.value)"
                      />
                      <el-switch
                        v-else-if="item.type === 'boolean'"
                        v-model="item.value"
                        style="margin-left: 10px"
                        @change="updateArrayItem(scope.row.id, item.id, 'value', item.value)"
                      />
                      <el-tag v-else-if="item.type === 'null'" type="danger" style="margin-left: 10px">null</el-tag>
                      <el-tag v-else-if="item.type === 'object'" type="success" style="margin-left: 10px">对象</el-tag>
                      <el-tag v-else-if="item.type === 'array'" type="warning" style="margin-left: 10px">数组</el-tag>

                      <el-button
                        size="default"
                        type="danger"
                        icon="Delete"
                        circle
                        @click="deleteArrayItem(scope.row.id, item.id)"
                        style="margin-left: 10px"
                      />

                      <div v-if="item.type === 'object'" class="array-object-fields">
                        <el-button
                          size="default"
                          type="primary"
                          icon="Plus"
                          @click="addFieldToArrayObject(scope.row.id, item.id)"
                          style="margin-left: 10px"
                        >
                          添加字段
                        </el-button>

                        <div v-for="objField in getArrayObjectFields(scope.row.id, item.id)" :key="objField.id" class="array-object-field">
                          <el-input
                            v-model="objField.name"
                            size="default"
                            placeholder="字段名"
                            style="width: 140px; margin-left: 20px"
                            @input="updateField(objField.id, 'name', objField.name, `${scope.row.id}_${item.id}`)"
                          />
                          <el-select
                            v-model="objField.type"
                            size="default"
                            style="width: 140px; margin-left: 10px"
                            @change="updateField(objField.id, 'type', objField.type, `${scope.row.id}_${item.id}`)"
                          >
                            <el-option label="字符串" value="string" />
                            <el-option label="数字" value="number" />
                            <el-option label="布尔值" value="boolean" />
                          </el-select>
                          <el-input
                            v-if="objField.type === 'string'"
                            v-model="objField.value"
                            size="default"
                            style="width: 200px; margin-left: 10px"
                            @input="updateField(objField.id, 'value', objField.value, `${scope.row.id}_${item.id}`)"
                          />
                          <el-input-number
                            v-else-if="objField.type === 'number'"
                            v-model="objField.value"
                            size="default"
                            style="width: 200px; margin-left: 10px"
                            @change="updateField(objField.id, 'value', objField.value, `${scope.row.id}_${item.id}`)"
                          />
                          <el-switch
                            v-else-if="objField.type === 'boolean'"
                            v-model="objField.value"
                            style="margin-left: 10px"
                            @change="updateField(objField.id, 'value', objField.value, `${scope.row.id}_${item.id}`)"
                          />
                          <el-button
                            size="default"
                            type="danger"
                            icon="Delete"
                            circle
                            @click="deleteField(objField.id, `${scope.row.id}_${item.id}`)"
                            style="margin-left: 10px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="220">
              <template #default="scope">
                <el-space size="middle">
                  <el-button
                    v-if="scope.row.type === 'object'"
                    size="default"
                    type="primary"
                    icon="Plus"
                    @click="addField('string', scope.row.id, scope.row.nestedLevel + 1)"
                  >
                    子字段
                  </el-button>
                  <el-button
                    v-if="scope.row.type === 'array'"
                    size="default"
                    type="primary"
                    icon="Plus"
                    @click="addArrayItem(scope.row.id)"
                  >
                    数组项
                  </el-button>
                  <el-button
                    size="default"
                    type="danger"
                    icon="Delete"
                    @click="deleteField(scope.row.id)"
                  >
                    删除
                  </el-button>
                </el-space>
              </template>
            </el-table-column>
          </el-table>

          <el-empty
            description="暂无字段，点击添加按钮开始构建JSON"
            v-if="flatFields.length === 0"
            style="margin: 40px 0"
          />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">JSON预览</div>
          </template>

          <el-space wrap class="preview-actions">
            <el-button type="success" @click="copyJson">
              <el-icon><Copy /></el-icon> 复制JSON
            </el-button>
            <el-button type="success" @click="downloadJson">
              <el-icon><Download /></el-icon> 下载JSON
            </el-button>
          </el-space>

          <el-scrollbar height="700px" class="json-preview">
            <pre v-html="highlightedJson"></pre>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <el-tooltip v-model="showTooltip" :content="tooltipText" placement="bottom" manual>
      <div class="tooltip-trigger"></div>
    </el-tooltip>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'


const loading = ref(false)
const showTooltip = ref(false)
const tooltipText = ref('')

const fieldData = reactive({
  root: [],
  nested: {},
  arrayObjectFields: {},
  arrayItems: {}
})

const counters = reactive({ field: 0, arrayItem: 0 })

const getDefaultValue = (type) => {
  switch (type) {
    case 'string': return ''
    case 'number': return 0
    case 'boolean': return true
    case 'null': return null
    case 'object': return {}
    case 'array': return []
    default: return ''
  }
}

const addField = (type = 'string', parentId = null, nestedLevel = 0, arrayObjectKey = null) => {
  counters.field++
  const fieldId = counters.field
  const newField = {
    id: fieldId,
    name: `field${fieldId}`,
    type,
    value: getDefaultValue(type),
    parentId,
    nestedLevel,
    arrayObjectKey
  }
  if (arrayObjectKey) {
    if (!fieldData.arrayObjectFields[arrayObjectKey]) fieldData.arrayObjectFields[arrayObjectKey] = []
    fieldData.arrayObjectFields[arrayObjectKey].push(newField)
  } else if (parentId) {
    if (!fieldData.nested[parentId]) fieldData.nested[parentId] = []
    fieldData.nested[parentId].push(newField)
  } else {
    fieldData.root.push(newField)
  }
}

const addArrayItem = (fieldId, itemType = 'string') => {
  counters.arrayItem++
  const itemId = counters.arrayItem
  if (!fieldData.arrayItems[fieldId]) fieldData.arrayItems[fieldId] = []
  fieldData.arrayItems[fieldId].push({
    id: itemId, type: itemType, value: getDefaultValue(itemType)
  })
}

const addFieldToArrayObject = (fieldId, itemId, fieldType = 'string') => {
  addField(fieldType, null, 2, `${fieldId}_${itemId}`)
}

const findField = (fieldId, arrayObjectKey = null) => {
  if (arrayObjectKey && fieldData.arrayObjectFields[arrayObjectKey]) {
    return fieldData.arrayObjectFields[arrayObjectKey].find(f => f.id === fieldId)
  }
  const root = fieldData.root.find(f => f.id === fieldId)
  if (root) return root
  for (const k in fieldData.nested) {
    const f = fieldData.nested[k].find(f => f.id === fieldId)
    if (f) return f
  }
  return null
}

const updateField = (fieldId, prop, value, arrayObjectKey = null) => {
  const f = findField(fieldId, arrayObjectKey)
  if (!f) return
  if (prop === 'type') {
    f.type = value
    f.value = getDefaultValue(value)
  } else {
    f[prop] = value
  }
}

const updateArrayItem = (fieldId, itemId, prop, value) => {
  const items = fieldData.arrayItems[fieldId]
  if (!items) return
  const it = items.find(i => i.id === itemId)
  if (!it) return
  if (prop === 'type') {
    it.type = value
    it.value = getDefaultValue(value)
  } else {
    it[prop] = value
  }
}

const deleteField = (fieldId, arrayObjectKey = null) => {
  if (arrayObjectKey && fieldData.arrayObjectFields[arrayObjectKey]) {
    const i = fieldData.arrayObjectFields[arrayObjectKey].findIndex(f => f.id === fieldId)
    if (i !== -1) {
      fieldData.arrayObjectFields[arrayObjectKey].splice(i, 1)
      if (fieldData.arrayObjectFields[arrayObjectKey].length === 0) delete fieldData.arrayObjectFields[arrayObjectKey]
    }
    return
  }
  const ri = fieldData.root.findIndex(f => f.id === fieldId)
  if (ri !== -1) {
    fieldData.root.splice(ri, 1)
    return
  }
  for (const k in fieldData.nested) {
    const i = fieldData.nested[k].findIndex(f => f.id === fieldId)
    if (i !== -1) {
      fieldData.nested[k].splice(i, 1)
      if (fieldData.nested[k].length === 0) delete fieldData.nested[k]
      return
    }
  }
}

const deleteArrayItem = (fieldId, itemId) => {
  const items = fieldData.arrayItems[fieldId]
  if (!items) return
  const i = items.findIndex(it => it.id === itemId)
  if (i === -1) return
  items.splice(i, 1)
  const key = `${fieldId}_${itemId}`
  if (fieldData.arrayObjectFields[key]) delete fieldData.arrayObjectFields[key]
  if (items.length === 0) delete fieldData.arrayItems[fieldId]
}

const resetAll = () => {
  fieldData.root = []
  fieldData.nested = {}
  fieldData.arrayObjectFields = {}
  fieldData.arrayItems = {}
  counters.field = 0
  counters.arrayItem = 0
}

const flatFields = computed(() => {
  const arr = [...fieldData.root]
  const walk = (pid) => {
    if (!fieldData.nested[pid]) return
    fieldData.nested[pid].forEach(f => {
      arr.push(f)
      walk(f.id)
    })
  }
  fieldData.root.forEach(f => walk(f.id))
  for (const k in fieldData.arrayObjectFields) {
    arr.push(...fieldData.arrayObjectFields[k])
  }
  return arr
})

const getArrayItems = (fieldId) => fieldData.arrayItems[fieldId] || []
const getArrayObjectFields = (fid, iid) => fieldData.arrayObjectFields[`${fid}_${iid}`] || []

const getFieldValue = (f) => {
  switch (f.type) {
    case 'string': case 'number': case 'boolean': case 'null':
      return f.value
    case 'object':
      const o = {}
      if (fieldData.nested[f.id]) fieldData.nested[f.id].forEach(nf => o[nf.name] = getFieldValue(nf))
      return o
    case 'array':
      const arr = []
      const items = fieldData.arrayItems[f.id] || []
      items.forEach(it => {
        if (it.type !== 'object') {
          arr.push(it.value)
          return
        }
        const o = {}
        const key = `${f.id}_${it.id}`
        if (fieldData.arrayObjectFields[key]) fieldData.arrayObjectFields[key].forEach(of => o[of.name] = getFieldValue(of))
        arr.push(o)
      })
      return arr
    default:
      return ''
  }
}

const generateJson = () => {
  const res = {}
  fieldData.root.forEach(f => res[f.name] = getFieldValue(f))
  return res
}

const highlightedJson = computed(() => {
  const s = JSON.stringify(generateJson(), null, 2)
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\.|[^"\\])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?)/g, m => {
      let c = 'number'
      if (/^"/.test(m)) c = /:$/.test(m) ? 'key' : 'string'
      else if (/true|false/.test(m)) c = 'boolean'
      else if (/null/.test(m)) c = 'null'
      return `<span class="json-${c}">${m}</span>`
    })
})

const copyJson = async () => {
  await navigator.clipboard.writeText(JSON.stringify(generateJson(), null, 2))
  tooltipText.value = '复制成功'
  showTooltip.value = true
  setTimeout(() => showTooltip.value = false, 1500)
}

const downloadJson = () => {
  const s = JSON.stringify(generateJson(), null, 2)
  const blob = new Blob([s], { type: 'application/json' })
  const u = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = u
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(u)
  tooltipText.value = '已下载'
  showTooltip.value = true
  setTimeout(() => showTooltip.value = false, 1500)
}

const initExample = () => {
  addField('string')
  updateField(1, 'name', 'name')
  updateField(1, 'value', '张三')
  addField('number')
  updateField(2, 'name', 'age')
  updateField(2, 'value', 25)
  addField('array')
  updateField(3, 'name', 'hobbies')
  addArrayItem(3, 'string')
  updateArrayItem(3, 1, 'value', '游泳')
}
initExample()
</script>

<style scoped>
.json-generator-container {
  padding: 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.main-content {
  margin-top: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-table__cell) {
  padding: 14px 12px !important;
}

.table-row-large {
  height: auto !important;
}

.array-items {
  margin-top: 12px;
}

.array-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 6px;
  flex-wrap: wrap;
  gap: 8px;
}

.array-object-fields {
  width: 100%;
  margin-top: 10px;
}

.array-object-field {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 8px;
}

.json-preview {
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 6px;
}

.json-preview pre {
  font-family: Consolas, Monaco, monospace;
  font-size: 14px;
  line-height: 1.6;
}

.json-key { color: #7dd3fc; }
.json-string { color: #bbf7d0; }
.json-number { color: #f0abfc; }
.json-boolean { color: #fbbf24; }
.json-null { color: #f87171; }

.tooltip-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>