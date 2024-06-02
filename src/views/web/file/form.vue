<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { get_CodeType } from "@/utils/xdteam";

import "md-editor-v3/lib/style.css";
import { defineAsyncComponent } from "vue";
const scCodeEditor = defineAsyncComponent(
  () => import("@/components/CodeEditor/CodeEditor.vue")
);
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "打开",
    name: "",
    path: "",
    content: "",
    extension: ""
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-position="top"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="文件号："
          prop="name"
          v-if="
            newFormInline.title === '重命名' ||
            newFormInline.title === '新增文件' ||
            newFormInline.title === '新增文件夹'
          "
        >
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入文件号"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          prop="content"
          v-if="
            newFormInline.title === '新增文件' || newFormInline.title === '打开'
          "
        >
          <sc-code-editor
            v-model="newFormInline.content"
            :mode="get_CodeType(newFormInline.extension)"
            theme="darcula"
            height="550px"
          />
        </el-form-item>
      </re-col>
    </el-row>
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
