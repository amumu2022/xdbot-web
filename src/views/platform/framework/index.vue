<script lang="ts" setup>
import { ref } from "vue";
import Email from "./components/email.vue";
import Ai from "./components/ai.vue";
import Frame from "./components/frame.vue";

const activeName = ref("tab1");
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="框架设置" name="tab1"><Frame /></el-tab-pane>
    <el-tab-pane label="AI 设置" name="tab3"><Ai /></el-tab-pane>
    <el-tab-pane label="邮箱设置" name="tab2"><Email /></el-tab-pane>
  </el-tabs>
</template>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
