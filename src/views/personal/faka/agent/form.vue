<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    user_id: "",
    user_level: "",
    balance: "",
    discount: ""
  })
});

const sendTypeOptions = [
  {
    value: "普通用户",
    label: "普通用户"
  },
  {
    value: "代理商",
    label: "代理商"
  },
  {
    value: "经销商",
    label: "经销商"
  },
  {
    value: "批发商",
    label: "批发商"
  },
  {
    value: "零售商",
    label: "零售商"
  }
];
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
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户账号" prop="user_id">
          <el-input
            v-model="newFormInline.user_id"
            clearable
            placeholder="请输入用户账号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户身份">
          <el-select
            v-model="newFormInline.user_level"
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
        <el-form-item label="用户余额" prop="balance">
          <el-input
            v-model="newFormInline.balance"
            clearable
            placeholder="请输入用户余额"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="购买折扣" prop="discount">
          <el-input
            v-model="newFormInline.discount"
            clearable
            placeholder="请输入购买折扣"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
