<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    description: "",
    enable: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
function calculateTextareaRows(text) {
  // 获取文本内容的行数
  if (text) {
    const lineCount = text.split("\n").length;
    const rows = Math.max(lineCount, 1); // 至少显示一行
    return rows; // 返回计算得到的行数
  }
  return 2; // 返回计算得到的行数
}
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
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入分类名称"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            :rows="calculateTextareaRows(newFormInline.description)"
            clearable
            type="textarea"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
