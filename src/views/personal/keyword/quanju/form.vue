<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    keyword: "",
    answer: "",
    sendType: "",
    enable: ""
  })
});

const sendTypeOptions = [
  {
    value: 0,
    label: "模糊匹配"
  },
  {
    value: 1,
    label: "精确匹配"
  }
];
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
function calculateTextareaRows(text) {
  // 获取文本内容的行数
  const lineCount = text.split("\n").length;
  const rows = Math.max(lineCount, 3); // 至少显示一行
  return rows; // 返回计算得到的行数
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
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="newFormInline.keyword"
            clearable
            placeholder="请输入关键词"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="匹配类型">
          <el-select
            v-model="newFormInline.sendType"
            placeholder="请选择匹配类型"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in sendTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="回复语句" prop="answer">
          <el-input
            v-model="newFormInline.answer"
            :rows="calculateTextareaRows(newFormInline.answer)"
            clearable
            type="textarea"
            placeholder="请输入回复语句"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
