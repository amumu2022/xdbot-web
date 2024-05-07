<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { ref, reactive } from "vue";
import { ElInput } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    data: undefined
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}
const state = reactive({
  val: JSON.stringify(newFormInline.value.data),
  data: newFormInline.value.data,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});
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
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="用户" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入用户"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="用户数据" prop="data">
          <template v-if="typeof newFormInline.data === 'undefined'">
            <el-input
              v-model="newFormInline.data"
              placeholder="请输入用户数据"
              :autosize="{ minRows: 4, maxRows: 8 }"
              type="textarea"
            />
          </template>
          <template v-else>
            <vue-json-pretty
              v-model:data="newFormInline.data"
              :deep="state.deep"
              :show-double-quotes="state.showDoubleQuotes"
              :show-line="state.showLine"
              :show-length="state.showLength"
              :show-icon="state.showIcon"
              :show-line-number="state.showLineNumber"
              :editable="state.editable"
              :editable-trigger="state.editableTrigger as any"
            />
          </template>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
