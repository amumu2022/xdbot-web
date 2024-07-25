<script setup lang="ts">
import { ref, unref, h } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import FromQuestion from "@/components/FromQuestion/index.vue";
import { useCopyToClipboard } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { RunAPI } from "@/api/bot/features/customApi";
import { addDialog } from "@/components/ReDialog";
import formPrimitive from "./formPrimitive.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    url: "",
    keyword: "",
    method: "",
    value_num: "",
    rule: "",
    back_set: "",
    test: "",
    encode: "utf-8",
    headers: "",
    body: "",
    cookie: "",
    enable: "",
    judge: "", // 请求失败判断类型
    judgeValue: "", // 请求失败判断值
    judgeKey: "", // 请求判断键值
    time: 5 // 请求超时时间
  })
});
const methodOptions = [
  { value: "get", label: "get" },
  { value: "post", label: "post" },
  { value: "put", label: "put" },
  { value: "delete", label: "delete" }
];

const encodeOptions = [
  { value: "utf-8", label: "utf-8" },
  { value: "gbk", label: "gbk" }
];

const judgeOptions = [
  { value: "no_judge", label: "不进行判断" },
  { value: "status_code", label: "状态码" },
  { value: "keyword", label: "属性值" }
];

const newFormInline = ref(props.formInline);
const back_msg = ref("");

const title = ref(props.formInline.title);
if (title.value === "新增") {
  newFormInline.value.method = methodOptions[0].value;
  newFormInline.value.encode = encodeOptions[0].value;
}

const ruleFormRef = ref();
function calculateTextareaRows(text) {
  if (text) {
    // 获取文本内容的行数
    const lineCount = text.split("\n").length;
    const rows = Math.max(lineCount, 1); // 至少显示一行
    return rows; // 返回计算得到的行数
  }
  return 1;
}
function getRef() {
  return ruleFormRef.value;
}

const { clipboardValue, copied } = useCopyToClipboard();
function copyStringDC() {
  clipboardValue.value = unref(back_msg);

  if (copied.value) {
    message(`复制成功`, { type: "success" });
  } else {
    message(`复制失败，请检查是否为空`, { type: "warning" });
  }
}

function RunDemo(row) {
  RunAPI(row).then(async res => {
    if (res.code === 200) {
      message(`测试成功`, { type: "success" });
      back_msg.value = res.data;
    } else {
      message(`${res.message}`, { type: "error" });
    }
  });
}

// 子组件 prop 为 primitive 类型的 demo
const formPrimitiveParam = ref("");
const resetFormPrimitiveParam = ref(formPrimitiveParam.value);
function InputData() {
  addDialog({
    width: "30%",
    title: "导入数据",
    contentRenderer: () =>
      h(formPrimitive, {
        data: formPrimitiveParam.value,
        "onUpdate:data": val => (formPrimitiveParam.value = val)
      }),
    closeCallBack: () => {
      const data: any = eval("(" + formPrimitiveParam.value + ")");
      newFormInline.value.keyword = data.keyword;
      newFormInline.value.url = data.url;
      newFormInline.value.method = data.method;
      newFormInline.value.back_set = decodeURIComponent(atob(data.back_set));
      newFormInline.value.rule = decodeURIComponent(atob(data.rule));
      newFormInline.value.test = data.test;
      newFormInline.value.encode = data.encode;
      newFormInline.value.headers = decodeURIComponent(atob(data.headers));
      newFormInline.value.body = decodeURIComponent(atob(data.body));
      newFormInline.value.cookie = decodeURIComponent(atob(data.cookie));
      newFormInline.value.judgeKey = data.judgeKey;
      newFormInline.value.judge = data.judge;
      newFormInline.value.judgeValue = data.judgeValue;
      newFormInline.value.time = data.time;

      // 重置表单数据
      formPrimitiveParam.value = resetFormPrimitiveParam.value;
    }
  });
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="40">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="触发语句" prop="keyword">
          <el-input
            v-model="newFormInline.keyword"
            clearable
            placeholder="请输入触发语句"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="测试语句" prop="test">
          <el-input
            v-model="newFormInline.test"
            clearable
            placeholder="请输入测试语句"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="接口地址" prop="url">
          <el-input
            v-model="newFormInline.url"
            clearable
            placeholder="请输入接口地址"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="匹配规则" prop="rule">
          <el-input
            v-model="newFormInline.rule"
            clearable
            placeholder="请输入匹配规则"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="请求方式" prop="method">
          <el-select
            v-model="newFormInline.method"
            placeholder="请选择请求方式"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in methodOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="编码方式" prop="encode">
          <el-select
            v-model="newFormInline.encode"
            placeholder="请选择匹配类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in encodeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="请求头" prop="headers">
          <el-input
            rows="2"
            clearable
            type="textarea"
            v-model="newFormInline.headers"
            placeholder="直接复制浏览器数据"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="post参数" prop="body">
          <el-input
            rows="2"
            type="textarea"
            v-model="newFormInline.body"
            clearable
            placeholder="直接复制浏览器数据即可"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="Cookie" prop="cookie">
          <el-input
            :rows="calculateTextareaRows(newFormInline.cookie)"
            type="textarea"
            v-model="newFormInline.cookie"
            clearable
            placeholder="仅对需要Cookie的进行支持"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="超时时间" prop="time">
          <template #label>
            <from-question
              label="超时时间"
              description="请求超时时间，超出该时间返回请求超时并返回给用户"
            />
          </template>
          <el-input
            v-model="newFormInline.time"
            clearable
            placeholder="请输入请求超时时间"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="请求判断" prop="judge">
          <template #label>
            <from-question
              label="请求判断"
              description="作为判断请求是否成功的依据"
            />
          </template>
          <el-select
            v-model="newFormInline.judge"
            placeholder="请选择判断类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in judgeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <template v-if="newFormInline.judge == 'keyword'">
          <el-form-item label="判断属性" prop="judgeKey">
            <template #label>
              <from-question label="判断属性" description="请求判断的键值" />
            </template>
            <el-input
              v-model="newFormInline.judgeKey"
              clearable
              placeholder="请输入属性键值"
            />
          </el-form-item>
        </template>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <template v-if="newFormInline.judge != 'no_judge'">
          <el-form-item label="判断值" prop="judgeValue">
            <template #label>
              <from-question
                label="判断值"
                description="仅支持判断请求状态码及json返回内容"
              />
            </template>
            <el-input
              v-model="newFormInline.judgeValue"
              clearable
              placeholder="请输入判断值"
            />
          </el-form-item>
        </template>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="返回内容" prop="back_set">
          <el-input
            rows="4"
            type="textarea"
            v-model="newFormInline.back_set"
            clearable
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="内容展示">
          <template #label>
            <from-question
              label="内容展示"
              description="测试后将会在这里展示内容"
            />
          </template>
          <el-input
            rows="4"
            type="textarea"
            v-model:value="back_msg"
            clearable
            placeholder=""
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24" style="margin-left: 40px">
        <el-button
          type="primary"
          class="button-margin"
          @click="RunDemo(props.formInline)"
        >
          测试一下
        </el-button>
        <el-button class="button-margin" type="danger" @click="InputData()"
          >导入数据</el-button
        >
        <el-button type="success" class="button-margin" @click="copyStringDC()"
          >复制内容</el-button
        >
      </re-col>
    </el-row>
  </el-form>
</template>
<style>
.button-margin {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
