<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

import { ref, watch } from "vue";
import { ElInput } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    keyword: "",
    answer: "",
    user: [],
    group: []
  })
});

function calculateTextareaRows(text) {
  // 获取文本内容的行数
  const lineCount = text.split("\n").length;
  const rows = Math.max(lineCount, 3); // 至少显示一行
  return rows; // 返回计算得到的行数
}
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const userOptions = ref(props.formInline.user);
const groupOptions = ref(props.formInline.group);

const groupInputValue = ref("");
const groupInputVisible = ref(false);

const userInputValue = ref("");
const userInputVisible = ref(false);

const handleUserClose = (tag: string) => {
  userOptions.value.splice(userOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.user = userOptions.value;
};

const handleGroupClose = (tag: string) => {
  groupOptions.value.splice(groupOptions.value.indexOf(tag), 1);
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.group = groupOptions.value;
};

const showGroupInput = () => {
  groupInputVisible.value = true;
};

const showUserInput = () => {
  userInputVisible.value = true;
};

const handleUserInputConfirm = () => {
  if (userInputValue.value) {
    const tag = userInputValue.value;
    userOptions.value = Array.from(new Set([...userOptions.value, tag]));
  }

  userInputVisible.value = false;
  userInputValue.value = "";
};

const handleGroupInputConfirm = () => {
  if (groupInputValue.value) {
    const tag = groupInputValue.value;
    groupOptions.value = Array.from(new Set([...groupOptions.value, tag]));
  }
  groupInputVisible.value = false;
  groupInputValue.value = "";
};

watch(userOptions, newValue => {
  // 更新 props 内的 user
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.user = newValue;
});

watch(groupOptions, newValue => {
  // 更新 props 内的 user
  // eslint-disable-next-line vue/no-mutating-props
  props.formInline.group = newValue;
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
        <el-form-item label="转发群聊" prop="group">
          <div
            class="tag-container"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            "
          >
            <el-tag
              v-for="tag in groupOptions"
              :key="tag"
              type="warning"
              class="mx-1"
              closable
              :effect="'light'"
              :disable-transitions="true"
              @close="handleGroupClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <el-input
            v-if="groupInputVisible"
            v-model="groupInputValue"
            placeholder="请输入群号"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleGroupInputConfirm"
            @blur="handleGroupInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showGroupInput"
          >
            +
          </el-button>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="转发用户" prop="user">
          <div
            class="tag-container"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            "
          >
            <el-tag
              v-for="tag in userOptions"
              :key="tag"
              class="mx-1"
              :effect="'light'"
              closable
              :disable-transitions="false"
              @close="handleUserClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <el-input
            v-if="userInputVisible"
            v-model="userInputValue"
            class="ml-1 w-20"
            placeholder="请输入用户账号"
            size="small"
            @keyup.enter="handleUserInputConfirm"
            @blur="handleUserInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showUserInput"
          >
            +
          </el-button>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="回复语句" prop="answer">
          <el-input
            type="textarea"
            v-model="newFormInline.answer"
            :rows="calculateTextareaRows(newFormInline.answer)"
            clearable
            placeholder="请输入回复语句"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
