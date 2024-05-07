<!--
 * @Author: xdteam
 * @Date: 2024-04-18 21:36:31
 * @LastEditTime: 2024-04-18 22:12:11
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \vue-pure-admin\src\views\personal\Tools\scheduler\fileDetial.vue
 * 版权声明
-->
<!--
 * @Author: xdteam
 * @Date: 2024-04-18 21:36:31
 * @LastEditTime: 2024-04-18 22:10:12
 * @LastEditors: YourName
 * @Description: 
 * 版权声明
-->
<script setup lang="ts">
import { ref } from "vue";
import { defineAsyncComponent } from "vue";
import ReCol from "@/components/ReCol";
import { FileItemProps } from "./utils/types";
const scCodeEditor = defineAsyncComponent(
  () => import("@/components/CodeEditor/CodeEditor.vue")
);

const ruleFormRef = ref();
const props = withDefaults(defineProps<FileItemProps>(), {
  title: "查看",
  name: "",
  content: ""
});
const newFormInline = ref(props);
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-position="top"
    label-width="82px"
  >
    <el-main>
      <el-row :gutter="15">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="脚本名称" prop="name">
            <el-input v-model="newFormInline.name" clearable read-only />
          </el-form-item>
        </re-col>
        <el-col :lg="24">
          <el-form-item label="脚本内容" prop="content">
            <sc-code-editor
              read-only
              v-model="newFormInline.content"
              mode="python"
              theme="darcula"
              height="550px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-main>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
}
.sc-code-editor {
  width: 100%; /* 这使得编辑器宽度成为父容器宽度的100% */
}
</style>
