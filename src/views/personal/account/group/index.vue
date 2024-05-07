<script setup lang="ts">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import GlobalSet from "./Golbal.vue";
import GroupSet from "./Grouping.vue";

defineOptions({
  name: "AccountSet"
});

const activeName = ref("tab1");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.paneName, event);
};
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="全局设置" name="tab1">
      <GlobalSet />
    </el-tab-pane>
    <el-tab-pane label="分群设置" name="tab2">
      <GroupSet />
    </el-tab-pane>
  </el-tabs>
</template>
