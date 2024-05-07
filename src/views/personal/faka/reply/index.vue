<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import orange from "@iconify-icons/ep/orange";
import Star from "@iconify-icons/ep/star";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

import { message } from "@/utils/message";
import { getDockData, UpdateDock } from "@/api/system/dock";
const variable =
  "【商品ID】\n" +
  "【是否上架】【兑换价格】\n" +
  "【商品分类】【商品名称】\n" +
  "【商品价格】【商品库存】\n" +
  "【商品简介】【是否兑换】\n\n" +
  "【用户余额】【购买折扣】\n" +
  "【下单账号】【用户等级】\n\n" +
  "【下单时间】【卡密信息】\n" +
  "【理论金额】【实际支付】\n" +
  "【购买数量】【主人账号】\n\n" +
  "【货币余额】【支付方式】\n";

const top = "欢迎使用木木发卡系统\n" + "━━━━━━━━━━━━";

const detail =
  "商品分类：【商品分类】\n" +
  "商品名称：【商品名称】\n" +
  "商品ID：【商品ID】\n" +
  "商品价格：【商品价格】\n" +
  "商品库存：【商品库存】\n" +
  "商品简介：【商品简介】\n" +
  "是否兑换：【是否兑换】\n" +
  "兑换价格：【兑换价格】";

const low = "━━━━━━━━━━━━\n" + "Ps：购买商品 商品ID 数量";

const notice = "商品库存不足!\n" + "请联系小主：【主人账号】 添加商品!";

const success =
  "商品购买成功!\n" +
  "商品名称: 【商品名称】\n" +
  "商品售价: 【商品价格】元\n" +
  "商品折扣：【购买折扣】\n" +
  "实际支付: 【实际支付】元\n" +
  "卡密信息已发送到您的邮箱";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    detail: "",
    notice: "",
    low: "",
    success: "",
    top: "",
    variable: variable
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const resetForm = () => {
  // 重置表单数据
  newFormInline.value = {
    detail: "",
    notice: "",
    low: "",
    success: "",
    top: "",
    variable: variable
  };
};

const example = () => {
  newFormInline.value = {
    detail: detail,
    notice: notice,
    low: low,
    success: success,
    top: top,
    variable: variable
  };
};
async function reload() {
  const post_data = { name: "reply" };
  const { data } = await getDockData(post_data);
  if (data.length === 0) {
    message(`您还没有设置相关参数呢`, { type: "error" });
  } else {
    const back = data[0].data;
    newFormInline.value = {
      detail: back?.detail,
      notice: back?.notice,
      low: back?.low,
      success: back?.success,
      top: back?.top,
      variable: variable
    };
    message(`重载完成`, { type: "success" });
  }
}
async function load() {
  const post_data = { name: "reply" };
  const { data } = await getDockData(post_data);

  const back = data[0].data;
  newFormInline.value = {
    detail: back?.detail,
    notice: back?.notice,
    low: back?.low,
    success: back?.success,
    top: back?.top,
    variable: variable
  };
}
onBeforeMount(() => {
  load();
});
async function save() {
  const post_data = { name: "reply", data: newFormInline.value };
  const data = await UpdateDock("reply", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    load();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

defineOptions({
  name: "FakaReply"
});
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
      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="顶部内容" prop="top">
          <el-input
            v-model="newFormInline.top"
            rows="10"
            resize="none"
            clearable
            type="textarea"
            placeholder="请输入顶部内容"
          />
        </el-form-item>
      </re-col>
      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="详细内容" prop="detail">
          <el-input
            v-model="newFormInline.detail"
            rows="10"
            resize="none"
            clearable
            type="textarea"
            placeholder="请输入详细内容"
          />
        </el-form-item>
      </re-col>

      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="底部内容" prop="low">
          <el-input
            v-model="newFormInline.low"
            rows="10"
            resize="none"
            clearable
            type="textarea"
            placeholder="请输入底部内容"
          />
        </el-form-item>
      </re-col>
    </el-row>

    <el-row :gutter="30">
      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="变量列表" prop="variable">
          <el-input
            v-model="newFormInline.variable"
            rows="10"
            resize="none"
            clearable
            readonly
            type="textarea"
          />
        </el-form-item>
      </re-col>
      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="不足提醒" prop="notice">
          <el-input
            v-model="newFormInline.notice"
            rows="10"
            resize="none"
            clearable
            type="textarea"
            placeholder="请输入不足提醒"
          />
        </el-form-item>
      </re-col>

      <re-col class="mt-1" :sm="24" :xs="24" :md="12" :lg="8" :xl="8">
        <el-form-item label="成功提醒" prop="success">
          <el-input
            v-model="newFormInline.success"
            rows="10"
            resize="none"
            clearable
            type="textarea"
            placeholder="请输入成功提醒"
          />
        </el-form-item>
      </re-col>
    </el-row>

    <div style="text-align: center">
      <el-button type="success" :icon="useRenderIcon(AddFill)" @click="save">
        保存
      </el-button>
      <el-button type="warning" :icon="useRenderIcon(Star)" @click="example">
        恢复默认</el-button
      >
      <el-button type="info" :icon="useRenderIcon(Refresh)" @click="resetForm">
        重置</el-button
      >
      <el-button type="danger" :icon="useRenderIcon(orange)" @click="reload">
        重新载入</el-button
      >
    </div>
  </el-form>
</template>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
