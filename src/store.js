import {reactive} from 'vue'
export const store = reactive({
  count: 0,
  fun1() {
    this.count++
  }
})