<script setup lang="ts">
import { ref, watch } from "vue";
import "md-editor-v3/lib/style.css";
import { defineAsyncComponent } from "vue";
const scCodeEditor = defineAsyncComponent(
  () => import("@/components/CodeEditor/CodeEditor.vue")
);

import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    keyword: [],
    code: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const ctmOptions = ref(props.formInline.keyword);

const ctmInputValue = ref("");
const ctmInputVisible = ref(false);

const handleCtmClose = (tag: string) => {
  ctmOptions.value.splice(ctmOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.keyword = ctmOptions.value;
};

const showCtmInput = () => {
  ctmInputVisible.value = true;
};

const handleCtmInputConfirm = () => {
  if (ctmInputValue.value) {
    const tag = ctmInputValue.value;
    ctmOptions.value = Array.from(new Set([...ctmOptions.value, tag]));
  }
  ctmInputVisible.value = false;
  ctmInputValue.value = "";
};

watch(ctmOptions, newValue => {
  // 更新 props 内的 user
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.keyword = newValue;
});

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
          <el-form-item label="关键词" prop="keyword">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
              "
            >
              <el-tag
                v-for="tag in ctmOptions"
                :key="tag"
                class="mx-1"
                closable
                :effect="'light'"
                :disable-transitions="true"
                @close="handleCtmClose(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
            <el-input
              v-if="ctmInputVisible"
              v-model="ctmInputValue"
              placeholder="请输入关键词"
              class="ml-1 w-20"
              size="small"
              @keyup.enter="handleCtmInputConfirm"
              @blur="handleCtmInputConfirm"
            />
            <el-button
              v-else
              class="button-new-tag ml-1"
              size="small"
              @click="showCtmInput"
            >
              +
            </el-button>
          </el-form-item>
        </re-col>

        <el-col :value="24" :xs="24" :sm="24">
          <el-form-item label="脚本内容" prop="code">
            <sc-code-editor
              v-model="newFormInline.code"
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
