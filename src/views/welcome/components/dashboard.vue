<script setup lang="ts">
import { loading, cpuInfoTable, timerId } from "./index";
import { onUnmounted } from "vue";

import {
  ChatRound,
  Promotion,
  Cpu,
  Monitor,
  ChromeFilled,
  CollectionTag,
  Message
} from "@element-plus/icons-vue";

onUnmounted(() => {
  if (timerId.value !== null) {
    clearInterval(timerId.value); // 组件卸载时清除定时器
  }
});
</script>

<template>
  <div class="dashboard" id="app">
    <!-- 骨架屏 -->
    <el-skeleton animated :rows="6" :loading="loading">
      <!-- 实际数据 -->
      <el-row :gutter="20">
        <el-col
          v-for="item in cpuInfoTable.slice(0, 3)"
          :key="item.field"
          :span="8"
        >
          <div class="stats-card">
            <p>
              <el-icon v-if="item.field === `CPU`"><Cpu /></el-icon>
              <el-icon v-else-if="item.field === `内存`"><Monitor /></el-icon>
              <el-icon v-else-if="item.field === `磁盘`"
                ><ChromeFilled
              /></el-icon>

              {{ item.field }}
            </p>
            <h3>{{ item.value }}</h3>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col
          v-for="item in cpuInfoTable.slice(3)"
          :key="item.field"
          :md="6"
          :sm="12"
          :xs="12"
          style="margin-bottom: 20px"
        >
          <div class="stats-card">
            <p>
              <el-icon v-if="item.field === `收信总数`"><Message /></el-icon>
              <el-icon v-if="item.field === `今日收信`"
                ><CollectionTag
              /></el-icon>
              <el-icon v-if="item.field === `发信总数`"><Promotion /></el-icon>
              <el-icon v-if="item.field === `今日发信`"><ChatRound /></el-icon>
              {{ item.field }}
            </p>
            <h3>{{ item.value }}</h3>
          </div>
        </el-col>
      </el-row>
    </el-skeleton>
  </div>
</template>

<style scoped>
.stats-card {
  background: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.stats-card h3 {
  font-weight: bold;
  margin: 10px 0;
}
.stats-card p {
  font-size: 14px;
  color: #666;
}

.stats-card h3 {
  color: #666;
  margin: 0px;
}
</style>
