<script setup lang="ts">
import "md-editor-v3/lib/style.css";
import { defineAsyncComponent } from "vue";
const scCodeEditor = defineAsyncComponent(
  () => import("@/components/CodeEditor/CodeEditor.vue")
);
import { message } from "@/utils/message";
import formPrimitive from "./formPrimitive.vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { addDialog } from "@/components/ReDialog";
import { ref, h } from "vue";
import { useCopyToClipboard } from "@pureadmin/utils";
const { clipboardValue, copied } = useCopyToClipboard();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    code: "",
    version: "",
    author: "",
    type: "",
    folder: "",
    image: "",
    url: "",
    path: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
      newFormInline.value.name = data.name;
      newFormInline.value.code = decodeURIComponent(atob(data.code));
      newFormInline.value.version = data.version;
      newFormInline.value.author = decodeURIComponent(atob(data.author));
      newFormInline.value.type = decodeURIComponent(atob(data.type));
      newFormInline.value.folder = data.folder;
      newFormInline.value.image = decodeURIComponent(atob(data.image));
      newFormInline.value.url = decodeURIComponent(atob(data.url));
      newFormInline.value.path = data.path;

      // 重置表单数据
      formPrimitiveParam.value = resetFormPrimitiveParam.value;
    }
  });
}

function OutputData(product) {
  const encodeIfPresent = value =>
    value ? btoa(encodeURIComponent(value)) : "";
  const newProduct = {
    name: product.name,
    version: product.version,
    folder: product.folder,
    path: product.path,
    code: encodeIfPresent(product.code),
    author: encodeIfPresent(product.author),
    rule: encodeIfPresent(product.rule),
    image: encodeIfPresent(product.image),
    url: encodeIfPresent(product.url)
  };
  clipboardValue.value = JSON.stringify(newProduct);
  if (copied.value) {
    message(`导出成功`, { type: "success" });
  } else {
    message(`导出失败`, { type: "warning" });
  }
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
    label-width="82px"
  >
    <el-main>
      <el-row :gutter="15">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="插件名称" prop="name">
            <el-input
              v-if="newFormInline.title !== '编辑'"
              v-model="newFormInline.name"
              clearable
              placeholder="请输入插件名称"
            />
            <!-- 当title为“编辑”时，显示为只读状态 -->
            <el-input
              v-else
              v-model="newFormInline.name"
              clearable
              readonly
              placeholder="请输入插件名称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="文件名称" prop="folder">
            <el-input
              v-if="newFormInline.title !== '编辑'"
              v-model="newFormInline.folder"
              clearable
              placeholder="请输入文件名称"
            />
            <!-- 当title为“编辑”时，显示为只读状态 -->
            <el-input
              v-else
              v-model="newFormInline.folder"
              clearable
              readonly
              placeholder="请输入文件名称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="插件图片" prop="image">
            <el-input
              v-model="newFormInline.image"
              clearable
              placeholder="请输入插件图片链接"
            />
          </el-form-item>
        </re-col>

        <re-col :value="8" :xs="24" :sm="24">
          <el-form-item label="插件作者" prop="author">
            <el-input v-model="newFormInline.author" clearable />
          </el-form-item>
        </re-col>

        <re-col :value="8" :xs="24" :sm="24">
          <el-form-item label="Version" prop="version">
            <el-input v-model="newFormInline.version" clearable />
          </el-form-item>
        </re-col>

        <re-col :value="8" :xs="24" :sm="24">
          <el-form-item label="插件标签" prop="type">
            <el-input v-model="newFormInline.type" clearable />
          </el-form-item>
        </re-col>

        <el-col :value="24" :xs="24" :sm="24">
          <el-form-item label="函数内容" prop="code">
            <sc-code-editor
              v-model="newFormInline.code"
              mode="python"
              theme="darcula"
              height="450px"
            />
          </el-form-item>
        </el-col>

        <el-col :value="12" :xs="24" :sm="24">
          <el-button
            class="button-margin"
            type="success"
            @click="OutputData(newFormInline)"
            >导出数据</el-button
          >
          <el-button class="button-margin" type="danger" @click="InputData()"
            >导入数据</el-button
          >
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
