<template>
  <div class="contract-extract-container">
    <el-card shadow="hover" class="main-card">
      <!-- 标题 -->
      <div class="card-header">
        <h2>合同信息AI提取与校正</h2>
      </div>

      <!-- 1. 文件上传区域（模板部分不变） -->
      <div class="upload-section">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept=".pdf,.doc,.docx"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button type="primary" icon="el-icon-upload">选择合同文件</el-button>
          <div slot="tip" class="el-upload__tip">
            仅支持上传PDF/Word格式文件，单次最多上传1个文件
          </div>
        </el-upload>
        <el-button
          type="success"
          icon="el-icon-refresh-left"
          :disabled="!fileList.length"
          @click="extractContractInfo"
          class="ml-4"
        >
          AI提取信息
        </el-button>
      </div>

      <!-- 加载状态 -->
      <el-divider content-position="left">合同基础信息</el-divider>
      <el-skeleton v-if="loading" :rows="8" animated />

      <!-- 2. 合同基础信息表单（可校正） -->
      <el-form
        v-else
        ref="formRef"
        :model="contractForm"
        label-width="120px"
        class="form-section"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input class="no-border-input" v-model="contractForm.contractNo" placeholder="请校正合同编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input class="no-border-input" v-model="contractForm.contractName" placeholder="请校正合同名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲方名称" prop="partyA">
              <el-input class="no-border-input" v-model="contractForm.partyA" placeholder="请校正甲方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乙方名称" prop="partyB">
              <el-input class="no-border-input" v-model="contractForm.partyB" placeholder="请校正乙方名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker
                v-model="contractForm.signDate"
                type="date"
                placeholder="请校正签订日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额(元)" prop="amount">
              <el-input
                class="no-border-input"
                v-model="contractForm.amount"
                type="number"
                placeholder="请校正合同金额"
                precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同有效期" prop="validPeriod">
              <el-input class="no-border-input" v-model="contractForm.validPeriod" placeholder="例如：2025-01-01 至 2026-01-01" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同备注" prop="remark">
              <el-input
                class="no-border-input"
                v-model="contractForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请校正合同备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 3. 合同明细表格（可校正） -->
      <el-divider content-position="left">合同明细信息</el-divider>
      <div class="table-section">
        <el-table
          v-loading="loading"
          :data="contractTableData"
          border
          style="width: 100%"
          @cell-change="handleTableCellChange"
        >
          <el-table-column
            prop="itemName"
            label="明细项名称"
            min-width="200"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.itemName"
                placeholder="请校正明细项名称"
                @input="() => scope.row = { ...scope.row }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格型号"
            min-width="150"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.spec"
                placeholder="请校正规格型号"
                @input="() => scope.row = { ...scope.row }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            width="120"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.quantity"
                type="number"
                placeholder="请校正数量"
                @input="() => scope.row = { ...scope.row }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="unitPrice"
            label="单价(元)"
            width="120"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.unitPrice"
                type="number"
                precision="2"
                placeholder="请校正单价"
                @input="() => scope.row = { ...scope.row }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总价(元)"
            width="120"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.totalPrice"
                type="number"
                precision="2"
                placeholder="请校正总价"
                @input="() => scope.row = { ...scope.row }"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="handleDeleteRow(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          class="mt-4"
          @click="handleAddRow"
        >
          添加明细项
        </el-button>
      </div>

      <!-- 4. 操作按钮区 -->
      <div class="button-group">
        <el-button
          type="warning"
          icon="el-icon-refresh"
          @click="resetForm"
        >
          重置数据
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveCorrectedData"
        >
          保存校正结果
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, } from 'vue';
import { ElUpload, ElForm, ElTable,ElMessage  } from 'element-plus';
import axios from 'axios';

// ---------------------- 类型定义 ----------------------
// 合同基础信息类型
interface ContractForm {
  contractNo: string;
  contractName: string;
  partyA: string;
  partyB: string;
  signDate: string;
  amount: number | '';
  validPeriod: string;
  remark: string;
}

// 合同明细项类型
interface ContractTableItem {
  id: string;
  itemName: string;
  spec: string;
  quantity: number | '';
  unitPrice: number | '';
  totalPrice: number | '';
}

// ---------------------- 响应式数据 ----------------------
// 文件上传相关（修改类型：fileList为UploadFile[]，currentFile为File | null）
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const fileList = ref([]); // 关键修改：从File[]改为UploadFile[]
const currentFile = ref<File | null>(null);

// 加载状态
const loading = ref(false);

// 表单数据
const formRef = ref<InstanceType<typeof ElForm>>();
const contractForm = reactive<ContractForm>({
  contractNo: '',
  contractName: '',
  partyA: '',
  partyB: '',
  signDate: '',
  amount: '',
  validPeriod: '',
  remark: ''
});

// 表格数据
const contractTableData = ref<ContractTableItem[]>([]);

// ---------------------- 方法定义 ----------------------
// 文件选择变化（核心修改：参数类型改为UploadFile和UploadFiles）
const handleFileChange = (uploadFile: any, uploadFiles: any[]) => {
  // 从UploadFile中获取原生File对象（raw属性）
  if (uploadFile.raw) {
    currentFile.value = uploadFile.raw;
  }
};

// 文件超出数量限制（不变）
const handleExceed = () => {
  ElMessage.warning('只能上传一个合同文件，请先删除已选择的文件');
};

// AI提取合同信息（逻辑不变，仅类型已适配）
const extractContractInfo = async () => {
  if (!currentFile.value) {
    ElMessage.warning('请先选择要提取的合同文件');
    return;
  }

  try {
    loading.value = true;

    // 1. 构建FormData（使用currentFile.value.raw已改为原生File）
    const formData = new FormData();
    formData.append('file', currentFile.value); // 此处currentFile是原生File，类型正确

    // 2. 模拟接口调用（不变）
    const extractData = {
      form: {
        contractNo: 'HT20250122001',
        contractName: '2025年度服务器采购合同',
        partyA: 'XX科技有限公司',
        partyB: 'XX云计算有限公司',
        signDate: '2025-01-22',
        amount: 120000.00,
        validPeriod: '2025-01-22 至 2026-01-21',
        remark: '此合同为年度框架合同，按月结算'
      },
      table: [
        {
          id: '1',
          itemName: '服务器（型号：SR650）',
          spec: 'SR650/2*Intel Xeon 4310/64G/2*1.92T SSD',
          quantity: 10,
          unitPrice: 12000.00,
          totalPrice: 120000.00
        }
      ]
    };

    // 3. 填充数据（不变）
    Object.assign(contractForm, extractData.form);
    contractTableData.value = extractData.table;

    ElMessage.success('AI提取合同信息成功，请核对校正');
  } catch (error) {
    console.error('提取合同信息失败：', error);
    ElMessage.error(`提取失败：${(error as Error).message || '服务器异常，请稍后重试'}`);
  } finally {
    loading.value = false;
  }
};

// 表格单元格变化（可选：用于实时计算总价等）
const handleTableCellChange = (row: ContractTableItem) => {
  // 示例：自动计算总价（数量*单价）
  if (row.quantity && row.unitPrice) {
    row.totalPrice = Number(row.quantity) * Number(row.unitPrice);
  }
};

// 添加表格行
const handleAddRow = () => {
  contractTableData.value.push({
    id: Date.now().toString(), // 唯一ID
    itemName: '',
    spec: '',
    quantity: '',
    unitPrice: '',
    totalPrice: ''
  });
};

// 删除表格行
const handleDeleteRow = (row: ContractTableItem) => {
  const index = contractTableData.value.findIndex(item => item.id === row.id);
  if (index > -1) {
    contractTableData.value.splice(index, 1);
    ElMessage.info('已删除该明细项');
  }
};

// 重置表单和表格数据
const resetForm = () => {
  // 重置表单
  Object.assign(contractForm, {
    contractNo: '',
    contractName: '',
    partyA: '',
    partyB: '',
    signDate: '',
    amount: '',
    validPeriod: '',
    remark: ''
  });
  // 重置表格
  contractTableData.value = [];
  // 清空文件
  fileList.value = [];
  currentFile.value = null;
  ElMessage.info('数据已重置');
};

// 保存校正后的结果
const saveCorrectedData = async () => {
  try {
    loading.value = true;

    // 构建提交数据
    const submitData = {
      fileId: currentFile.value?.name || '', // 实际项目中用文件上传后的ID
      formData: contractForm,
      tableData: contractTableData.value
    };

    // 调用保存接口（替换为你的实际接口地址）
    // const res = await axios.post('/api/contract/save', submitData);

    // 模拟保存成功
    ElMessage.success('校正数据保存成功');
    console.log('提交的校正数据：', submitData);
  } catch (error) {
    console.error('保存校正数据失败：', error);
    ElMessage.error(`保存失败：${(error as Error).message || '服务器异常，请稍后重试'}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
  /* 深度选择器（::v-deep / :deep()）穿透 scoped 样式 */
:deep(.no-border-input .el-input__wrapper) {
  border: none !important;
  box-shadow: none !important;
  /* 可选：移除圆角，让输入框更扁平 */
  border-radius: 0 !important;
}
.contract-extract-container {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.main-card {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
}

.upload-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.form-section {
  margin-bottom: 30px;
}

.table-section {
  margin-bottom: 30px;
}

.button-group {
  text-align: right;
  margin-top: 20px;
}

.button-group .el-button {
  margin-left: 10px;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .upload-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .ml-4 {
    margin-left: 0 !important;
    margin-top: 10px;
  }
}
</style>