
<template>
  <div class="pdf-extractor">
    <h3>PDF 文本提取</h3>
    <!-- 文件选择 -->
    <input
      type="file"
      accept=".pdf"
      @change="handleFileChange"
      class="file-input"
    />
    <!-- 操作按钮 -->
    <button
      @click="extractAllText"
      :disabled="!selectedFile || isLoading"
      class="btn"
    >
      提取全部文本
    </button>
    <button
      @click="extractSpecifiedPage"
      :disabled="!selectedFile || isLoading"
      class="btn"
    >
      提取指定页码
    </button>
    <!-- 页码输入（提取指定页码时显示） -->
    <input
      v-if="showPageInput"
      v-model.number="targetPage"
      type="number"
      min="1"
      :max="totalPages || 1"
      placeholder="请输入页码"
      class="page-input"
    />
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">解析中，请稍等...</div>
    <!-- 错误提示 -->
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    <!-- 提取结果 -->
    <div v-if="extractResult" class="result">
      <pre>{{ JSON.stringify(extractResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy} from 'pdfjs-dist';

// 配置 pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';
// === 类型定义 ===
// 文件相关
interface SelectedFile {
  file: File;
  name: string;
  size: number; // 字节
}

// 单页文本结果
interface PageTextResult {
  pageNum: number;
  text: string;
  charCount: number;
}

// 提取结果
interface ExtractResult {
  fileName: string;
  fileSize: string; // 格式化后的大小（如 2.5MB）
  totalPages: number;
  pageTextList: PageTextResult[];
  fullText?: string; // 全部文本（仅提取全部时存在）
  specifiedPageText?: PageTextResult; // 指定页码文本（仅提取指定页时存在）
}

// === 响应式数据 ===
// 选中的PDF文件
const selectedFile = ref<SelectedFile | null>(null);
// 加载状态
const isLoading = ref(false);
// 错误信息
const errorMsg = ref('');
// 提取结果
const extractResult = ref<ExtractResult | null>(null);
// 总页数
const totalPages = ref(0);
// 是否显示页码输入框
const showPageInput = ref(false);
// 目标页码
const targetPage = ref(1);

// === 工具函数 ===
/**
 * 读取PDF文件为ArrayBuffer
 * @param file 选中的PDF文件
 */
const readPdfFile = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(new Error(`文件读取失败`));
  });
};

/**
 * 格式化文件大小（字节转MB/KB）
 * @param bytes 字节数
 */
const formatFileSize = (bytes: number): string => {
  if (bytes > 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  } else if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
};

/**
 * 加载PDF文档
 * @param arrayBuffer PDF文件的ArrayBuffer
 */
const loadPdfDocument = async (arrayBuffer: ArrayBuffer): Promise<PDFDocumentProxy> => {
  try {
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    totalPages.value = pdfDoc.numPages;
    return pdfDoc;
  } catch (err) {
    throw new Error(`PDF加载失败：${(err as Error).message}`);
  }
};

/**
 * 提取单页文本
 * @param pdfDoc PDF文档实例
 * @param pageNum 页码
 */
const extractSinglePageText = async (
  pdfDoc: PDFDocumentProxy,
  pageNum: number
): Promise<PageTextResult> => {
  const page = await pdfDoc.getPage(pageNum);
  const textContent = await page.getTextContent();
  const pageText = textContent.items.map((item:any) => item.str).join('');
  return {
    pageNum,
    text: pageText,
    charCount: pageText.length,
  };
};

// === 事件处理 ===
/**
 * 文件选择变更
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    selectedFile.value = null;
    extractResult.value = null;
    errorMsg.value = '';
    return;
  }

  // 校验文件类型
  if (file.type !== 'application/pdf') {
    errorMsg.value = '请选择PDF格式的文件！';
    selectedFile.value = null;
    return;
  }

  // 保存选中的文件信息
  selectedFile.value = {
    file,
    name: file.name,
    size: file.size,
  };
  errorMsg.value = '';
  extractResult.value = null;
  showPageInput.value = false;
};

/**
 * 提取全部文本
 */
const extractAllText = async () => {
  if (!selectedFile.value) return;

  isLoading.value = true;
  errorMsg.value = '';
  extractResult.value = null;

  try {
    // 1. 读取文件
    const arrayBuffer = await readPdfFile(selectedFile.value.file);
    // 2. 加载PDF
    const pdfDoc = await loadPdfDocument(arrayBuffer);
    // 3. 逐页提取文本
    const pageTextList: PageTextResult[] = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const pageResult = await extractSinglePageText(pdfDoc, pageNum);
      pageTextList.push(pageResult);
      fullText += pageResult.text + '\n\n';
    }

    // 4. 组装结果
    extractResult.value = {
      fileName: selectedFile.value.name,
      fileSize: formatFileSize(selectedFile.value.size),
      totalPages: pdfDoc.numPages,
      pageTextList,
      fullText,
    };
  } catch (err) {
    errorMsg.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

/**
 * 提取指定页码文本
 */
const extractSpecifiedPage = async () => {
  if (!selectedFile.value) return;

  // 显示页码输入框（首次点击时）
  if (!showPageInput.value) {
    showPageInput.value = true;
    return;
  }

  // 校验页码
  if (!targetPage.value || targetPage.value < 1 || (totalPages.value && targetPage.value > totalPages.value)) {
    errorMsg.value = `请输入有效的页码（1-${totalPages.value || 'N'}）`;
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  extractResult.value = null;

  try {
    // 1. 读取文件
    const arrayBuffer = await readPdfFile(selectedFile.value.file);
    // 2. 加载PDF
    const pdfDoc = await loadPdfDocument(arrayBuffer);
    // 3. 提取指定页码文本
    const specifiedPageText = await extractSinglePageText(pdfDoc, targetPage.value);

    // 4. 组装结果
    extractResult.value = {
      fileName: selectedFile.value.name,
      fileSize: formatFileSize(selectedFile.value.size),
      totalPages: pdfDoc.numPages,
      pageTextList: [],
      specifiedPageText,
    };
  } catch (err) {
    errorMsg.value = (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时的初始化（可选）
onMounted(() => {
  console.log('PDF提取组件已挂载');
});
</script>

<style scoped>
.pdf-extractor {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.file-input {
  margin: 10px 0;
}

.btn {
  margin: 0 8px 10px 0;
  padding: 6px 12px;
  cursor: pointer;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-input {
  margin: 0 8px;
  padding: 4px 8px;
  width: 80px;
}

.loading {
  color: #409eff;
  margin: 10px 0;
}

.error {
  color: #f56c6c;
  margin: 10px 0;
}

.result {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #f9f9f9;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
}
</style>