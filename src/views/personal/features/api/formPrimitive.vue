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
      rows="5"
      v-model="data"
      placeholder="请输入内容"
    />
  </div>
</template>
