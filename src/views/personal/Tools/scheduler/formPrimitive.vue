<!--
 * @Author: xdteam
 * @Date: 2024-08-07 22:11:24
 * @LastEditTime: 2024-08-07 22:26:31
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \vue-pure-admin\src\views\personal\Tools\scheduler\formPrimitive.vue
 * 版权声明
-->
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
// 声明 props 类型
export interface FormProps {
  data: string;
}

const props = withDefaults(defineProps<FormProps>(), {
  data: () => ""
});

// 使用 vueuse 的双向绑定工具
const emit = defineEmits(["update:data"]);
const data = useVModel(props, "data", emit);
</script>

<template>
  <div style="width: 100%">
    <el-input
      type="textarea"
      class="custom-input"
      rows="15"
      v-model="data"
      readonly
    />
  </div>
</template>

<style scoped>
.custom-input .el-textarea__inner {
  background-color: #0d0d0c; /* 设置输入框底色 */
  color: #bbd9e2; /* 设置输入文字颜色 */
}

.custom-input .el-textarea__inner::placeholder {
  color: #7b2727 !important;
}
</style>
