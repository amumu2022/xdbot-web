<!--
 * @Author: xdteam
 * @Date: 2024-05-05 23:07:11
 * @LastEditTime: 2024-05-09 20:14:21
 * @LastEditors: YourName
 * @Description: 
 * @FilePath: \vue-pure-admin\src\views\personal\features\ai\index.vue
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
import { logs, connectWs, ws_status } from "../im/utils/hooks";
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

// 处理notice消息
function makeNotice(type, user_id, group_id, data) {
  let text = "";
  if (type == "group_increase") {
    // 群员增加
    text = `新成员 (${user_id}) 进入了群 (${group_id})`;
  } else if (type == "group_decrease") {
    // 群员减少
    text = `成员 (${user_id}) 退出了群 (${group_id})， 操作者为${data?.operator_id}`;
  } else if (type == "offline_file") {
    // 文件上传
    text = `成员 (${user_id}) 在群 (${group_id}) 上传了文件${data?.file.name}，大小为${data?.file.size}`;
  } else if (type == "group_recall") {
    // 群消息撤回
    text = `成员 (${user_id}) 在群 (${group_id}) 撤回了一条消息${data?.message_id}， 操作者为${data?.operator_id}`;
  } else if (type == "friend_recall") {
    // 好友消息撤回
    text = `好友 (${user_id}) 撤回了一条消息${data?.message_id}`;
  } else if (type == "notify") {
    const sub_type = data?.sub_type;

    if (sub_type == "poke") {
      if (!group_id) {
        // 好友戳一戳
        text = `好友 (${user_id}) 戳了一下你`;
      } else {
        // 群内戳一戳
        text = `成员 (${user_id}) 在群 (${group_id}) 戳了一下你`;
      }
    } else if (sub_type == "lucky_king") {
      // 群红包运气王提示
      text = `成员 (${user_id}) 在群 (${group_id}) 取得了群红包运气王`;
    } else if (sub_type == "honor") {
      // 群成员荣誉变更提示
      text = `成员 (${user_id}) 在群 (${group_id}) 的成员荣誉发生变更`;
    }
  } else if (type == "group_card") {
    // 群成员名片更新
    text = `成员 (${user_id}) 在群 (${group_id}) 修改了群名片 (${data?.card_old}-->${data?.card_new})`;
  } else if (type == "lucky_king") {
    // 群成员头衔更新事件
    text = `成员 (${user_id}) 在群 (${group_id}) 的成员头衔发生变更 (${data?.title})`;
  } else if (type == "friend_add") {
    // 好友添加事件
    text = `用户 (${user_id}) 已添加您为好友`;
  } else if (type == "group_ban") {
    // 群禁言事件
    if (data?.sub_type == "ban") {
      // 禁言
      text = `成员 (${user_id}) 在群 (${group_id}) 被禁言${data?.duration}秒， 操作者为${data?.operator_id}`;
    } else {
      // 解除禁言
      text = `成员 (${user_id}) 在群 (${group_id}) 被接触禁言， 操作者为${data?.operator_id}`;
    }
  } else if (type == "group_admin") {
    // 群管理员变动事件
    if (data?.sub_type == "set") {
      // 设置管理员
      text = `成员 (${user_id}) 在群 (${group_id}) 被设置为管理员身份`;
    } else {
      // 取消管理员
      text = `管理员 (${user_id}) 在群 (${group_id}) 被取消管理员身份`;
    }
  }

  return text;
}

// 处理request消息
function makeRequest(type, user_id, group_id, data) {
  let text = "";

  if (type == "friend") {
    // 加好友请求事件
    text = `用户 (${user_id}) 申请添加您为好友，理由为：${data?.comment}`;
  } else if (type == "group") {
    // 加群请求／邀请事件
    text = `用户 (${user_id}) 申请加入群聊，理由为： (${group_id})， 操作者为${data?.operator_id}`;
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
