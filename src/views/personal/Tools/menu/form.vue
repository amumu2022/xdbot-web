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
    power: 0,
    enable: true
  })
});

const sendTypeOptions = [
  {
    value: 1,
    label: "群员"
  },
  {
    value: 2,
    label: "管理"
  },
  {
    value: 3,
    label: "群主"
  },
  {
    value: 4,
    label: "超管"
  },
  {
    value: 5,
    label: "主人"
  }
];

function calculateTextareaRows(text) {
  // 获取文本内容的行数
  const lineCount = text.split("\n").length;
  const rows = Math.max(lineCount, 3); // 至少显示一行
  return rows; // 返回计算得到的行数
}

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
        <el-form-item label="菜单名称：" prop="keyword">
          <el-input
            v-model="newFormInline.keyword"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="回复内容：" prop="answer">
          <el-input
            v-model="newFormInline.answer"
            :rows="calculateTextareaRows(newFormInline.answer)"
            clearable
            type="textarea"
            placeholder="请输入回复语句"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单权限：">
          <el-select
            v-model="newFormInline.power"
            placeholder="请选择菜单权限"
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
    </el-row>
  </el-form>
</template>
