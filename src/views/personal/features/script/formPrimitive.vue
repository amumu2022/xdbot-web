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
      class="!w-full"
      rows="15"
      v-model="data"
      readonly
    />
  </div>
</template>
<style scoped>
.el-input__inner::placeholder {
  color: #7b2727 !important;
}
</style>
