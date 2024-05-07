<script setup lang="ts">
import dayjs from "dayjs";
// import { FormItemProps, ProductProps } from "./utils/types";
import { FormItemProps } from "./utils/types";
// import { ref, onMounted } from "vue";
import { ref } from "vue";
// import { getProductData } from "@/api/bot/faka/main";
const props = defineProps<FormItemProps>();

const resultTypes = ref({});
const methodTypes = ref({});
const create_time = ref("");
const update_time = ref("");
// const product = ref<ProductProps>();

resultTypes.value = {
  待支付: "warning",
  已超时: "danger",
  已完成: "success"
};

methodTypes.value = {
  货币兑换: "info",
  支付宝支付: "warning",
  微信支付: "danger",
  QQ支付: "success",
  余额支付: ""
};
const methodType = methodTypes.value[props.method];
const resultType = resultTypes.value[props.result];

create_time.value = dayjs(props.create_time).format(
  "YYYY年MM月DD日HH时mm分ss秒"
);

update_time.value = dayjs(props.update_time).format(
  "YYYY年MM月DD日HH时mm分ss秒"
);

// const product_status = ref(false);

// onMounted(async () => {
//   const post_data = {
//     id: props.num,
//     category: "",
//     exchange: null,
//     enable: "",
//     currentPage: 1,
//     pageSize: 10000000
//   };
//   const back_data = await getProductData(post_data);
//   if (back_data.data.results.length != 0) {
//     product.value = back_data.data.results[0];
//     product_status.value = true;
//     console.log(product);
//   }
// });
</script>

<template>
  <el-descriptions
    direction="horizontal"
    :column="2"
    :labelStyle="'white-space:nowrap;'"
    :contentStyle="'word-break:break-all;'"
    :size="'large'"
  >
    <!-- 开头前两列设置宽度 -->
    <el-descriptions-item label="订单编号:" :width="'25%'">{{
      props.id
    }}</el-descriptions-item>

    <el-descriptions-item label="流水单号:" :width="'25%'">{{
      props.border
    }}</el-descriptions-item>

    <el-descriptions-item label="商品名称:">{{
      props.name
    }}</el-descriptions-item>

    <el-descriptions-item :span="2" label="商品编号:">{{
      props.num
    }}</el-descriptions-item>

    <!-- <el-descriptions-item label="商品分类:">{{
      product?.category
    }}</el-descriptions-item>

    <el-descriptions-item label="当前库存"
      ><el-tag size="default" type="success" effect="dark">{{
        product?.inventory
      }}</el-tag></el-descriptions-item
    >

    <el-descriptions-item label="商品单价:" style="color: red">{{
      product?.name
    }}</el-descriptions-item>

    <el-descriptions-item label="商品名称:">{{
      props.name
    }}</el-descriptions-item> -->

    <el-descriptions-item label="支付方式:"
      ><el-tag size="default" :type="methodType" effect="dark">{{
        props.method
      }}</el-tag></el-descriptions-item
    >

    <el-descriptions-item label="订单状态:"
      ><el-tag size="default" :type="resultType" effect="dark">{{
        props.result
      }}</el-tag></el-descriptions-item
    >

    <el-descriptions-item label="终端客户:">{{
      props.user
    }}</el-descriptions-item>

    <el-descriptions-item label="下单数量:">{{
      props.data?.buy_num ?? 0
    }}</el-descriptions-item>

    <el-descriptions-item label="消耗货币:">{{
      props.data?.own_price ?? 0
    }}</el-descriptions-item>

    <el-descriptions-item label="支付金额:"
      >{{ props.data?.price ?? 0 }} 元
    </el-descriptions-item>

    <el-descriptions-item :span="2" label="商品信息:">
      <!-- 长度可能较长的字符串使用el-text包住 避免超出框 -->
      <el-text>
        {{ props.msg }}
      </el-text>
    </el-descriptions-item>

    <el-descriptions-item :span="2" label="订单生成时间:">{{
      create_time
    }}</el-descriptions-item>

    <el-descriptions-item :span="2" label="订单完成时间:">{{
      update_time ?? "未完成"
    }}</el-descriptions-item>
  </el-descriptions>
</template>
<style>
.el-descriptions {
  margin-top: 20px;
}
</style>
