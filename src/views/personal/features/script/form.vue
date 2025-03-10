<script setup lang="ts">
import { ref } from "vue";
import CodeEditor from "@/components/MonacoEditor/codeEditor.vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    content: ""
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
    label-width="82px"
  >
    <el-main>
      <el-row :gutter="15">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="脚本名称" prop="name">
            <el-input
              v-model="newFormInline.name"
              clearable
              placeholder="请输入脚本名称"
            />
          </el-form-item>
        </re-col>
        <el-col :lg="24">
          <el-form-item label="脚本内容" prop="content">
            <code-editor
              v-model:code="newFormInline.content"
              :language="`python`"
              :height="`550px`"
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
