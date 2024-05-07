<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { GetSkeys } from "@/utils/xdteam";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    category: "",
    price: 1,
    inventory: "",
    description: "",
    exchange: 0,
    skeys: "",
    own_price: 0,
    enable: ""
  })
});

const sendTypeOptions = [
  {
    value: 0,
    label: "不可兑换"
  },
  {
    value: 1,
    label: "可以兑换"
  }
];
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
function MakeSkeys() {
  const skeys = GetSkeys(5, 15);
  newFormInline.value.skeys = newFormInline.value.skeys + skeys;
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
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品名称：" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品分类：">
          <el-select
            v-model="newFormInline.category"
            placeholder="请选择"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in newFormInline.CategoryOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品价格：" prop="price">
          <el-input-number
            v-model="newFormInline.price"
            :min="1"
            :max="999999999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否兑换：" prop="exchange">
          <el-select
            v-model="newFormInline.exchange"
            placeholder="请选择"
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
        <el-form-item label="兑换价格：" prop="own_price">
          <el-input-number
            v-model="newFormInline.own_price"
            :min="0"
            :max="999999999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="商品描述：" prop="description">
          <el-input
            v-model="newFormInline.description"
            :autosize="{ minRows: 2, maxRows: 5 }"
            clearable
            type="textarea"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="卡密内容：" prop="description">
          <el-input
            v-model="newFormInline.skeys"
            :autosize="{ minRows: 2, maxRows: 5 }"
            clearable
            type="textarea"
            placeholder="请输入卡密内容"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-button class="reset-margin" type="success" @click="MakeSkeys()"
          >随机卡密</el-button
        >
      </re-col>
    </el-row>
  </el-form>
</template>
