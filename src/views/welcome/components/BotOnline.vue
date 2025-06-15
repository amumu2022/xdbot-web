<script setup>
import { Folder, ChatRound, Cpu, Timer } from "@element-plus/icons-vue";
import { BotList } from "./index";
import dayjs from "dayjs";

const formatDate = dateString => {
  return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
};
</script>

<template>
  <div class="bot-profile-container">
    <!-- 遍历机器人状态数据，动态生成卡片 -->
    <div v-for="(bot, index) in BotList" :key="index" class="user-profile">
      <!-- 头像和用户信息 -->
      <div class="user-header">
        <el-avatar size="large" :src="bot.avatar" />
        <div class="user-info">
          <h2 class="username">{{ bot.nickname }}</h2>
          <p class="user-id">{{ bot.bot_id }}</p>
        </div>
        <div class="user-stats">
          <span
            >好友: <b>{{ bot.friends }}</b></span
          >
          <span
            >群组: <b>{{ bot.groups }}</b></span
          >
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider />
      <!-- 用户详细信息 -->
      <div class="user-details">
        <!-- 今日发送 -->
        <div class="detail-item">
          <el-icon><Folder /></el-icon>
          <div>
            <p>今日发送</p>
            <b>{{ bot.today_send_messages }}</b>
          </div>
        </div>
        <!-- 今日接收 -->
        <div class="detail-item">
          <el-icon><ChatRound /></el-icon>
          <div>
            <p>今日接收</p>
            <b>{{ bot.today_recv_messages }}</b>
          </div>
        </div>
        <!-- 平台 -->
        <div class="detail-item">
          <el-icon><Cpu /></el-icon>
          <div>
            <p>平台</p>
            <b>{{ bot.platform }}</b>
          </div>
        </div>
        <!-- 在线时长 -->
        <div class="detail-item">
          <el-icon><Timer /></el-icon>
          <div>
            <p>在线时长</p>
            <b>{{ bot.conn_times_zh }}</b>
          </div>
        </div>
      </div>
      <!-- 连接时间 -->
      <div class="footer">
        <p>
          连接时间:
          <b>{{ formatDate(bot.connect_date) }}</b>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bot-profile-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  padding: 5px;
}

.username {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  background: linear-gradient(
    30deg,
    rgb(255, 0, 0),
    purple,
    orange,
    cyan,
    blue,
    purple
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 在末尾添加省略号 */
  max-width: 100%; /* 确保文本块不会超出其容器 */
}

.user-profile {
  flex: 1; /* 让卡片可以自适应增长 */
  max-width: 6000px; /* 最大宽度 */
  border: 1px solid #ebebeb;
  border-radius: 10px;
  padding: 15px; /* 减小上下内边距 */
  background-color: #fff;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  flex-grow: 1;
}

.user-id {
  margin: 0;
  color: #999;
  font-size: 0.875rem;
}

.user-stats {
  text-align: right;
  font-size: 0.875rem;
  color: #666;
}

.user-stats span {
  display: block;
}

.el-divider {
  margin: 10px 0; /* 减小分割线的上下间距 */
}

.user-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(50% - 10px); /* 每行显示两项 */
}

.detail-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.detail-item b {
  font-size: 0.8rem;
  color: #333;
}

.footer {
  margin-top: 10px; /* 减小底部间距 */
  text-align: right;
  color: #666;
  font-size: 0.875rem;
}

/* 头像背景增加环形发光 */
.el-avatar {
  box-shadow: 0 0 10px 5px rgba(99, 237, 143, 0.7);
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-profile {
    max-width: 100%; /* 移动端卡片宽度占满 */
  }

  .detail-item {
    width: 100%; /* 每行显示一项 */
  }

  .username {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block; /* 确保用户名作为块级元素以正确应用上述样式 */
  }
}
</style>
