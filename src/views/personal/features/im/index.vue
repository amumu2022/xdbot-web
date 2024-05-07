<script lang="ts" setup>
import { onMounted } from "vue";
import forms, { type FormProps } from "./components/form.vue";
import { Delete, Tools, Share, Promotion } from "@element-plus/icons-vue";
import chatgpt from "@/assets/img/chatgpt-icon.png";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useCopyToClipboard } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { storageLocal } from "@pureadmin/utils";
import {
  inputText,
  recordContent,
  SaveData,
  sendMsg,
  getSrc,
  srcList,
  ws_status
} from "./utils/hooks";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const { clipboardValue, copied } = useCopyToClipboard();

defineOptions({
  name: "FeaturesIM"
});

const { isMobile } = useBasicLayout();

interface StorageConfigs {
  ws_url: string;
  message_type: string;
  nickname: string;
  sex: string;
  age: number;
  user_id: string;
  group_id: string;
  card: string;
  level: string;
  role: string;
  bubble1: string;
  bubble2: string;
}

// 设置其他参数
function set() {
  storageLocal().setItem("SimulateSet", {
    ws_url: SaveData.value.ws_url,
    nickname: SaveData.value.nickname,
    message_type: SaveData.value.message_type,
    sex: SaveData.value.sex,
    age: SaveData.value.age,
    user_id: SaveData.value.user_id,
    group_id: SaveData.value.group_id,
    card: SaveData.value.card,
    level: SaveData.value.level,
    role: SaveData.value.role,
    bubble1: SaveData.value.bubble1,
    bubble2: SaveData.value.bubble2
  });
}

// 初始化
function get() {
  if (storageLocal().getItem<StorageConfigs>("SimulateSet")?.ws_url) {
    SaveData.value = storageLocal().getItem<StorageConfigs>("SimulateSet");
  }
  if (storageLocal().getItem("wsChatData")) {
    recordContent.value = storageLocal().getItem("wsChatData");
  } else {
    recordContent.value = [
      {
        mineMsg: false,
        nickName: "小管家",
        headUrl: "",
        time: new Date().toLocaleString(),
        messages: [
          {
            type: "text",
            content: `你好，我是小艾格，现在时间是${new Date().toLocaleString()}`
          }
        ]
      }
    ];
  }
}

// 删除聊天，但不删除对话
function delMsg() {
  recordContent.value = [
    {
      mineMsg: false,
      nickName: "小管家",
      headUrl: "",
      time: new Date().toLocaleString(),
      messages: [
        {
          type: "text",
          content: `你好，我是小艾格，现在时间是${new Date().toLocaleString()}`
        }
      ]
    }
  ];
  storageLocal().setItem("wsChatData", recordContent.value);
  message(`聊天记录已清空`, { type: "warning" });
}

// 导出聊天
const exportMsg = () => {
  clipboardValue.value = JSON.stringify(recordContent.value);
  if (copied.value) {
    message(`聊天记录已复制`, { type: "success" });
  }
};

// 点击设置
function SettingClick() {
  addDialog({
    width: "46%",
    draggable: true,
    fullscreenIcon: true,
    fullscreen: isMobile.value ? true : false,
    title: "参数调整",
    contentRenderer: () => forms,
    props: {
      formInline: {
        ws_url: SaveData.value.ws_url,
        nickname: SaveData.value.nickname,
        message_type: SaveData.value.message_type,
        sex: SaveData.value.sex,
        age: SaveData.value.age,
        user_id: SaveData.value.user_id,
        group_id: SaveData.value.group_id,
        card: SaveData.value.card,
        level: SaveData.value.level,
        role: SaveData.value.role,
        bubble1: SaveData.value.bubble1,
        bubble2: SaveData.value.bubble2
      }
    },
    footerButtons: [
      {
        label: "确认",
        type: "success",
        btnClick: ({ dialog: { options, index } }) => {
          closeDialog(options, index);
        }
      }
    ],
    closeCallBack: ({ options }) => {
      const { formInline } = options.props as FormProps;
      SaveData.value.ws_url = formInline.ws_url;
      SaveData.value.nickname = formInline.nickname;
      SaveData.value.sex = formInline.sex;
      SaveData.value.age = formInline.age;
      SaveData.value.user_id = formInline.user_id;
      SaveData.value.group_id = formInline.group_id;
      SaveData.value.message_type = formInline.message_type;
      SaveData.value.card = formInline.card;
      SaveData.value.level = formInline.level;
      SaveData.value.role = formInline.role;
      SaveData.value.bubble1 = formInline.bubble1;
      SaveData.value.bubble2 = formInline.bubble2;
      message(`保存成功`, { type: "success" });
      set();
    }
  });
}

onMounted(() => {
  get();
});
</script>

<template>
  <el-card>
    <el-container>
      <el-container style="height: 85vh; display: flex; flex-direction: column">
        <el-header>
          <span>XD 事件模拟</span>
          <span
            :style="{ color: ws_status ? 'green' : 'red', marginLeft: '30px' }"
          >
            WS 连接状态
          </span>
          <span v-if="ws_status" style="color: green; margin-right: 10px"
            >❤</span
          >
          <span v-else style="color: red; margin-right: 10px">◑</span>
        </el-header>

        <el-main>
          <div class="chat-content">
            <!-- 遍历消息记录 -->
            <div v-for="(itemc, indexc) in recordContent" :key="indexc">
              <!-- 对方 -->
              <div v-if="!itemc.mineMsg" class="word">
                <img class="avatar" :src="chatgpt" />
                <div class="info">
                  <p class="time">{{ itemc.nickName }} {{ itemc.time }}</p>

                  <!-- 消息气泡 -->
                  <div
                    class="info-content bubble"
                    :style="{ background: SaveData.bubble2 }"
                  >
                    <!-- 遍历每条消息的内容 -->
                    <template
                      v-for="(message, index) in itemc.messages"
                      :key="index"
                    >
                      <!-- 文字信息 -->
                      <div v-if="message.type === 'text'" class="text-message">
                        {{ message.content }}
                      </div>
                      <!-- 图片信息 -->
                      <el-image
                        v-if="message.type === 'image'"
                        class="chat-image"
                        :src="getSrc(message.content)"
                        :preview-src-list="srcList(message.content)"
                      />
                      <!-- 视频信息 -->
                      <video
                        v-else-if="message.type === 'video'"
                        controls
                        width="300"
                        class="video-message"
                      >
                        <source :src="message.content" type="video/mp4" />
                      </video>
                      <!-- 音频信息 -->
                      <div
                        v-else-if="message.type === 'audio'"
                        class="audio-container"
                      >
                        <audio controls class="aud" style="outline: none">
                          <source :src="message.content" type="audio/mpeg" />
                        </audio>
                      </div>

                      <!-- 其他 -->
                      <div
                        v-else-if="
                          message.type === 'chatgpt' ||
                          message.type === 'markdown'
                        "
                        class="audio-container"
                      >
                        <md-editor
                          v-model="message.content"
                          preview-only
                          showCodeRowNumber
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- 我的 -->
              <div class="word-my" v-else>
                <div class="info">
                  <p class="time">{{ itemc.nickName }} {{ itemc.time }}</p>

                  <div
                    class="info-content bubble"
                    :style="{ background: SaveData.bubble1 }"
                  >
                    {{ itemc.content }}
                  </div>
                </div>

                <img class="avatar" :src="itemc.headUrl" />
              </div>
            </div>
          </div>
        </el-main>

        <el-footer height="150px">
          <el-row class="low-row" style="width: 100%">
            <el-col :span="24">
              <el-row>
                <el-button type="success" :icon="Tools" circle />
                <el-button
                  type="info"
                  :icon="Tools"
                  circle
                  @click="SettingClick"
                />
                <el-button
                  type="primary"
                  :icon="Share"
                  circle
                  @click="exportMsg"
                />

                <el-popconfirm
                  title="是否删除对话?"
                  @confirm="delMsg"
                  confirm-button-type="danger"
                  cancel-button-type="warning"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" circle />
                  </template>
                </el-popconfirm>
              </el-row>
            </el-col>

            <el-input
              v-model="inputText"
              class="chat-input"
              :rows="4"
              type="textarea"
              placeholder="请输入内容..."
              @keydown.ctrl.enter="sendMsg"
            />
          </el-row>
        </el-footer>
      </el-container>
    </el-container>

    <el-button
      type="success"
      :icon="Promotion"
      @click="sendMsg"
      class="send-button-fixed"
      >发送</el-button
    >
  </el-card>
</template>

<style>
.menu-item-background {
  background-color: #4b9e5f !important;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 90%;
  color: #ccc !important;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.el-container {
  height: 100%;
}

.el-header,
.el-footer {
  color: #333;
  text-align: center;
  display: flex;
}

.el-header {
  height: 40px;
}
.el-aside {
  height: 85vh;
  /* z-index: 1999999999; */
  color: #333;
  background-color: transparent;
  text-align: center;
  line-height: 150px;
  border-right: 0.5px solid rgba(191, 191, 191, 1);
}

.el-main {
  color: #333;
}

:root {
  --avatar-size: 40px; /* 头像大小 */
  --avatar-radius: 50%; /* 头像圆角 */
  --info-spacing: 5px; /* 信息间距 */
  --time-font-size: 12px; /* 时间字体大小 */
  --time-color: rgba(51, 51, 51, 0.8); /* 时间颜色 */
  --content-padding: 10px; /* 内容填充 */
  --content-font-size: 14px; /* 内容字体大小 */
  --content-background: #fff; /* 内容背景颜色 */
  --content-radius: 5px; /* 内容圆角 */
  --content-max-width: 70%; /* 内容最大宽度 */
  --my-content-background: #a3c3f6; /* 我的内容背景颜色 */
  --speech-bubble-size: 8px; /* 气泡尖角大小 */
  --speech-bubble-border: 10px; /* 气泡尖角边界 */
}

.pc {
  width: 180px;
}
.mobile {
  width: 110%;
}
.new_chat {
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 10px 10px;
  text-align: center;
  background-color: transparent;
  width: calc(100% * 10 / 12);
}

.low-row {
  margin-top: 10px;
}

.send-button-fixed {
  position: fixed;
  bottom: 20px;
  right: 50px;
  /* z-index: 1999999999; */
}

.chat-input textarea.el-textarea__inner {
  border: none;
  box-shadow: none;
  resize: none;
  box-sizing: border-box;
  background-color: transparent;
}

/* 视频播放器样式 */
.video-container {
  border-radius: 10px;
  margin: 10px 0;
}

/* 音频播放器样式 */
.audio-container {
  margin: 10px 0;
}

.chat-image {
  border-radius: 10px;
  margin: 5px 0;
  max-width: 50%;
}

.text-message {
  margin: 5px 0;
}

.bubble {
  padding: 10px;
  border-radius: 15px;
  display: inline-block;
  max-width: 100%;
}

.chat-content {
  width: 100%;
  padding: 2px;
}

.word,
.word-my {
  display: flex;
}

/* 头像图片样式 */
.word img.avatar,
.word-my img.avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: var(--avatar-radius);
}

.info {
  margin-left: var(--info-spacing);
  width: var(--content-max-width);
}

.time {
  font-size: var(--time-font-size);
  color: var(--time-color);
  margin: 0 0 0 var(--info-spacing);
  height: 20px;
  line-height: 20px;
}

.word .info-content::before,
.word-my .info-content::after {
  position: absolute;
  content: "";
  top: var(--speech-bubble-size);
  border-top: var(--speech-bubble-size) solid transparent;
  border-bottom: var(--speech-bubble-size) solid transparent;
}

.word-my {
  justify-content: flex-end;
}

.word-my .info {
  text-align: right;
  margin-left: 0;
  margin-right: var(--info-spacing);
}

.word-my .info .time {
  margin-right: var(--info-spacing);
}

.info-content {
  padding: var(--content-padding);
  font-size: var(--content-font-size);
  background: var(--content-background);
  border-radius: var(--content-radius);
  position: relative;
  margin-top: 8px;
  overflow: hidden;
}
</style>
