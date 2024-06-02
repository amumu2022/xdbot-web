<!--
 * @Author: xdteam
 * @Date: 2024-05-05 23:07:11
 * @LastEditTime: 2024-06-02 20:54:47
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \vue-pure-admin\src\views\personal\features\logs\index.vue
 * 版权声明
-->
<template>
  <el-card style="max-height: 90vh">
    <template #header>
      <div style="display: flex; align-items: center">
        <div style="margin-right: 30px">消息日志</div>

        <el-button
          type="success"
          style="margin-left: 10px"
          size="small"
          @click="TurnTO"
          >WS设置</el-button
        >
      </div>
    </template>
    <div class="parent-container">
      <el-scrollbar ref="scrollbar">
        <div class="log-container">
          <div
            v-for="(log, index) in logs"
            :key="index"
            class="log-item"
            :class="`${log.level.toLowerCase()}`"
          >
            {{ logger(log) }}
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  logs,
  connectWs,
  ws_status,
  makeNotice,
  makeRequest
} from "../im/utils/hooks";
import { useRouter } from "vue-router";
import { storageLocal } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const scrollbar = ref(null);

// 跳转页面
function TurnTO() {
  router.push({ name: "FeaturesIM" });
}
defineOptions({
  name: "FeaturesAi"
});

interface StorageConfigs {
  ws_url: string;
}

//初始化ws连接
function get() {
  const ws_url = storageLocal().getItem<StorageConfigs>("SimulateSet")?.ws_url;
  if (ws_url) {
    if (!ws_status.value) {
      connectWs(ws_url);
    }
  } else
    ElMessageBox.confirm("ws地址尚未配置，是否跳转配置", "Warning", {
      confirmButtonText: "前往",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        TurnTO();
        ElMessage({
          type: "info",
          message: "请点击设置按钮进行设置"
        });
      })
      .catch(() => {
        ElMessage({
          type: "warning",
          message: "配置ws后才能输出日志哦~"
        });
      });
}

// 生成日志
function logger(logData) {
  let text = `${logData.time} [${logData.level}] ${logData.bot} -> `;
  const type = logData.type;
  const group_id = logData.data?.group_id;
  const user_id = logData.data?.user_id;
  if (logData.name == "send_msg") {
    text += `发送${type === "group" ? "群聊" : "私聊"} `;
    text += `(${type === "group" ? group_id : user_id}) `;
    text += `的消息：${logData.message}`;
  } else if (logData.name == "message") {
    text += `收到${type === "group" ? "群聊" : "私聊"}`;
    text += `  (${type === "group" ? group_id : user_id}) `;
    text += `内 ${logData.data?.sender.nickname}(${logData.data?.sender.user_id}) 的消息： ${logData.message} ${logData.data?.message_id}`;
  } else if (logData.name == "notice") {
    text += makeNotice(type, user_id, group_id, logData.data);
  } else if (logData.name == "request") {
    text += makeRequest(type, user_id, group_id, logData.data);
  }

  return text;
}

onMounted(() => {
  get();
});
</script>

<style>
/* 基础样式 */
.log-container {
  height: 70vh; /* 根据需要调整高度 */
  background-color: #24292f;
  padding: 10px;
  overflow: auto;
  color: rgb(0, 64, 110);
}

/* 日志项样式 */
.log-item {
  padding: 4px;
}

/* 日志级别颜色 */
.log-item.info {
  color: #f5fbf8; /* INFO级别日志颜色 */
}

.log-item.error {
  color: #ff5757; /* ERROR级别日志颜色 */
}

.log-item.debug {
  color: #0fb82b; /* DEBUG级别日志颜色 */
}

.log-item.warning {
  color: #cee144; /* DEBUG级别日志颜色 */
}

.log-item.success {
  color: #1283ec; /* DEBUG级别日志颜色 */
}

/* 可以根据需要添加更多日志级别的样式 */
</style>
