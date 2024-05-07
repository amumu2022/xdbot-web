<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    version: "",
    enable: "",
    content: "",
    skey: ""
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
        <el-form-item label="版本号：" prop="version">
          <el-input
            v-model="newFormInline.version"
            clearable
            placeholder="请输入版本号"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="更新内容：" prop="content">
          <el-input
            v-model="newFormInline.content"
            :autosize="{
              minRows: 4,
              maxRows: 10
            }"
            clearable
            type="textarea"
            placeholder="请输入更新内容"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
