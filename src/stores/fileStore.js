import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
  // 定义一个响应式的变量来存放文件
  const currentFile = ref(null)

  // 定义设置文件的方法
  const setFile = (file) => {
    currentFile.value = file
  }

  // 定义清除文件的方法
  const clearFile = () => {
    currentFile.value = null
  }

  return { currentFile, setFile, clearFile }
})