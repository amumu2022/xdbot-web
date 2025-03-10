<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import CodeEditor from "@/components/MonacoEditor/codeEditor.vue";

// 定义默认表单数据
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    code: "// 在此输入代码",
    language: "python",
    theme: "hc-black",
    height: "400px"
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
        <!-- 函数名输入框 -->
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="函数名" prop="name">
            <el-input
              v-model="newFormInline.name"
              clearable
              placeholder="请输入函数名"
            />
          </el-form-item>
        </re-col>

        <!-- 函数内容编辑器 -->
        <el-col :value="24" :xs="24" :sm="24">
          <el-form-item label="函数内容" prop="code">
            <code-editor
              v-model:code="newFormInline.code"
              :language="newFormInline.language"
              :theme="newFormInline.theme"
              :height="newFormInline.height"
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
</style>
