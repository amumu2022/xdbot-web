<script setup lang="ts">
import dayjs from "dayjs";
import { FormItemProps } from "./types";
import { ref } from "vue";
/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ **/
const props = defineProps<FormItemProps>();

const operationList = ref([]);
const etagTypes = ref([]);
const methodTypes = ref({});
const create_time = ref("");

operationList.value = [
  { value: 0, text: "其他" },
  { value: 1, text: "修改" },
  { value: 2, text: "添加" },
  { value: 3, text: "删除" },
  { value: 4, text: "登录" },
  { value: 5, text: "上传" }
  // 添加更多操作类型...
];
etagTypes.value = [
  { value: 0, text: "" },
  { value: 1, text: null },
  { value: 2, text: "warning" },
  { value: 3, text: "danger" },
  { value: 4, text: "success" },
  { value: 5, text: "info" }
  // 添加更多操作类型...
];
methodTypes.value = {
  POST: "warning",
  PUT: null,
  GET: "success",
  DELETE: "danger"
};
const methodType = methodTypes.value[props.request_params.method];

create_time.value = dayjs(props.create_time).format(
  "YYYY年MM月DD日HH时mm分ss秒"
);

const statustag = props.status === 0 ? "danger" : "success";
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
    <el-descriptions-item label="操作编号:" :width="'25%'">{{
      props.id
    }}</el-descriptions-item>
    <el-descriptions-item label="请求模块:" :width="'25%'">{{
      props.module
    }}</el-descriptions-item>
    <el-descriptions-item label="操作类型:"
      ><el-tag
        size="default"
        effect="dark"
        :type="etagTypes[props.operation].text"
        >{{ operationList[props.operation].text }}</el-tag
      ></el-descriptions-item
    >
    <el-descriptions-item label="操作人:">{{ props.uid }}</el-descriptions-item>
    <el-descriptions-item label="操作人IP:">{{
      props.ip
    }}</el-descriptions-item>
    <el-descriptions-item label="系统信息:">{{
      props.system
    }}</el-descriptions-item>
    <el-descriptions-item label="浏览器:">{{
      props.user_agent
    }}</el-descriptions-item>
    <el-descriptions-item label="请求链接:">{{
      props.url
    }}</el-descriptions-item>
    <el-descriptions-item label="响应状态:"
      ><el-tag size="default" :type="statustag" effect="dark">{{
        props.status === 1 ? "成功" : "失败"
      }}</el-tag></el-descriptions-item
    >
    <el-descriptions-item :span="2" label="请求方式:"
      ><el-tag size="default" :type="methodType" effect="dark">{{
        props.request_params.method
      }}</el-tag></el-descriptions-item
    >
    <el-descriptions-item :span="2" label="请求参数:">
      <!-- 长度可能较长的字符串使用el-text包住 避免超出框 -->
      <el-text>
        {{ props.request_params.params }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="请求体:">
      <el-text>
        {{ props.request_params.body }}
      </el-text>
    </el-descriptions-item>

    <el-descriptions-item :span="2" label="错误详情:">
      <el-text style="color: rgb(221, 16, 16)">
        {{ props.exception ? props.exception : "" }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="操作时间:">{{
      create_time
    }}</el-descriptions-item>
  </el-descriptions>
</template>
<style>
.el-descriptions {
  margin-top: 20px;
}
</style>
