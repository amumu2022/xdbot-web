<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    parent: "",
    points: 0,
    seconds: 1,
    enable: true,
    status: false,
    heard: "",
    user: "",
    num: 1
  })
});

const parentTypes = [
  { value: "群聊出租", text: "群聊出租" },
  { value: "宠物卡密", text: "宠物卡密" }
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
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="所属应用：" prop="parent">
          <el-select
            v-model="newFormInline.parent"
            placeholder="请选择"
            clearable
            class="w-full"
          >
            <el-option
              v-for="(item, index) in parentTypes"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="卡密前缀："
          prop="heard"
          v-if="newFormInline.title === '新增'"
        >
          <el-input v-model="newFormInline.heard" />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="秒数：" prop="seconds">
          <el-input-number
            v-model="newFormInline.seconds"
            :min="0"
            :max="9999999"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item label="点数：" prop="points">
          <el-input-number
            v-model="newFormInline.points"
            :min="0"
            :max="9999999"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="卡密内容："
          prop="skey"
          v-if="newFormInline.title === '编辑'"
        >
          <el-input v-model="newFormInline.skey" />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="卡密数量："
          prop="num"
          v-if="newFormInline.title === '新增'"
        >
          <el-input-number
            v-model="newFormInline.num"
            :min="1"
            :max="9999999"
          />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="使用账号："
          prop="user"
          v-if="newFormInline.title === '编辑'"
        >
          <el-input v-model="newFormInline.user" />
        </el-form-item>
      </re-col>

      <re-col :lg="24" :xs="24" :sm="24">
        <el-form-item
          label="使用状态："
          prop="status"
          v-if="newFormInline.title === '编辑'"
        >
          <el-switch
            v-model="newFormInline.status"
            :active-value="true"
            :inactive-value="false"
            active-text="已激活"
            inactive-text="未使用"
            inline-prompt
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
