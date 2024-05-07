<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "查看",
    version: "",
    enable: "",
    content: "",
    skey: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

interface Update {
  type: string;
  typeText: string;
  content: string;
}
const updates = ref<Update[]>([]);

function re_content(inputString: string, operation: string) {
  const regex = new RegExp(operation + "(.*?)$");
  const match = inputString.match(regex);

  if (match) {
    return match[1];
  } else {
    return "";
  }
}

onMounted(() => {
  parsedUpdates();
});

function parsedUpdates() {
  newFormInline.value.content.split("\n").map(line => {
    const typeTextMatch = line.match(/【(.*)】/);
    if (typeTextMatch) {
      const typeText = typeTextMatch[1];
      let type: string = "";
      let content: string = "";

      switch (typeText) {
        case "新增":
          type = "success";
          content = re_content(line, "【新增】");
          break;
        case "修复":
          type = "warning";
          content = re_content(line, "【修复】");

          break;
        case "优化":
          type = "primary";
          content = re_content(line, "【优化】");

          break;
        case "删除":
          type = "danger";
          content = re_content(line, "【删除】");

          break;
        case "停用":
          type = "info";
          content = re_content(line, "【停用】");
          break;
        default:
          type = "default";
          content = re_content(line, "【未知】");
      }

      updates.value.push({ type, typeText, content });
    } else {
      const type: string = "info";
      const content: string = line;
      const typeText = "";
      updates.value.push({ type, typeText, content });
    }
  });
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-descriptions
    direction="horizontal"
    :column="2"
    :labelStyle="'white-space:nowrap;'"
    :contentStyle="'word-break:break-all;'"
    :size="'large'"
  >
    <el-descriptions-item :span="2" label="版本号:">
      <el-text>
        {{ newFormInline.version }}
      </el-text>
    </el-descriptions-item>

    <el-descriptions-item :span="2" label="SKEY:">{{
      newFormInline.skey
    }}</el-descriptions-item>
    <el-tag type="success" effect="dark">{{ 234234234 }}</el-tag>

    <el-descriptions-item :span="2" label="更新日志:">
      <div v-for="(update, index) in updates" :key="index" class="tag">
        <el-tag :type="update.type" effect="dark">{{ update.typeText }}</el-tag>
        <span style="margin-left: 8px">{{ update.content }}</span>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>
<style>
.el-descriptions {
  margin-top: 20px;
}
.tag {
  margin: 10px 5px;
}
</style>
