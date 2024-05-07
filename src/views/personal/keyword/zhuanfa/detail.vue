<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "查看",
    keyword: "",
    answer: "",
    data: undefined,
    group: [],
    user: []
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-descriptions class="margin-top" direction="vertical" :column="4" border>
    <el-descriptions-item :span="5">
      <template #label>
        <div class="cell-item">关键词</div>
      </template>
      {{ newFormInline.keyword }}
    </el-descriptions-item>

    <el-descriptions-item :span="5">
      <template #label>
        <div class="cell-item">回复语句</div>
      </template>
      {{ newFormInline.answer }}
    </el-descriptions-item>
    <el-descriptions-item :span="5">
      <template #label>
        <div class="cell-item">转发个人</div>
      </template>
      <div class="tag-container">
        <el-tag
          v-for="userId in newFormInline.user"
          :key="userId"
          type=""
          effect="dark"
        >
          {{ userId }}
        </el-tag>
      </div>
    </el-descriptions-item>

    <el-descriptions-item :span="5">
      <template #label>
        <div class="cell-item">转发群聊</div>
      </template>
      <div class="tag-container">
        <el-tag
          v-for="userId in newFormInline.group"
          :key="userId"
          type="warning"
          effect="dark"
        >
          {{ userId }}
        </el-tag>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.tag {
  margin: 10px 5px;
}

.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
</style>
