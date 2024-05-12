<script lang="ts" setup>
import { ref, onMounted } from "vue";
import forms, { type FormProps } from "./components/form.vue";
import {
  Delete,
  Tools,
  Share,
  Promotion,
  Expand,
  Fold,
  Comment
} from "@element-plus/icons-vue";
import chatgpt from "@/assets/img/chatgpt-icon.png";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useCopyToClipboard } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { storageLocal } from "@pureadmin/utils";
import { buildUUID } from "@pureadmin/utils";

const { clipboardValue, copied } = useCopyToClipboard();
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const SendData = ref({
  chatID: undefined,
  bubble1: "#a3c3f6" /* “我的”气泡 */,
  bubble2: "#fff" /* “ta的”气泡 */
});
const { isMobile } = useBasicLayout();
const show = ref(true);
interface StorageConfigs {
  bubble1: string;
  bubble2: string;
  chatID: string;
}

const inputText = ref("");
const model = ref("");

const menuItemsData = ref([]);
const chatID = ref("");
const Change = ref(false);
const allContent = ref<any>({});
const recordContent = ref<any>([
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
]);

// 更新菜单数据
function getMenuData() {
  allContent.value = storageLocal().getItem("chatData");
  const menuData = allContent.value;
  const newItem = Object.keys(menuData).map(key => ({
    text: `${menuData[key].name}`,
    id: key
  }));
  return newItem;
}

// 设置其他参数
function set() {
  storageLocal().setItem("XDchat", {
    bubble1: SendData.value.bubble1,
    bubble2: SendData.value.bubble2,
    chatID: chatID.value
  });
}

// 删除对话后初始化
function reset() {
  allContent.value = storageLocal().getItem("chatData");
  const menuData = allContent.value;
  const newItem = Object.keys(menuData);
  const randomIndex = Math.floor(Math.random() * newItem.length);

  const id = newItem[randomIndex];

  if (id) {
    chatID.value = id;
    const content = allContent.value[id];
    recordContent.value = content.message;
    set();
  } else {
    handleNew();
  }
}

// 初始化
function get() {
  if (storageLocal().getItem<StorageConfigs>("XDchat")?.bubble1) {
    SendData.value = storageLocal().getItem<StorageConfigs>("XDchat");
  }
  if (storageLocal().getItem("chatData")) {
    menuItemsData.value = getMenuData();
  }
  if (!isMobile.value) {
    show.value = false;
  } else {
    Change.value = true;
  }
  if (!storageLocal().getItem<StorageConfigs>("XDchat")?.chatID) {
    handleNew();
  } else {
    chatID.value = storageLocal().getItem<StorageConfigs>("XDchat")?.chatID;
    const content = allContent.value[chatID.value];
    if (content) {
      recordContent.value = content.message;
    } else {
      handleNew();
    }
  }
}

// 聊天
async function sendMsg() {
  const content = inputText.value.trim();

  if (content) {
    const newMessage = {
      mineMsg: true,
      headUrl:
        "http://q.qlogo.cn/headimg_dl?dst_uin=651380741&spec=640&img_type=jpg",
      nickName: "我",
      time: new Date().toLocaleString(),
      content: inputText.value
    };

    recordContent.value.push(newMessage);
    inputText.value = "";

    const postData = {
      message: content
    };
    const res = await SendMessage(postData);
    if (res.success) {
      recordContent.value.push(res.data);
    } else {
      const responses = [
        "哎呀，这个关键词好像不在我的词典里呢，换一个试试吧？",
        "看来这个词是个小众选择呢，我这里找不到相关的信息哦。",
        "呜呜，这个关键词藏得有点深，我搜寻不到呢。",
        "嘿，这个关键词好神秘，就像未知星球一样，我这里探测不到信号呀。",
        "这个关键词似乎和我擦肩而过了，要不要试试别的词汇呢？",
        "嗯哼，这个关键词好像走丢了，我帮你找找其他的吧？",
        "这个关键词太低调了，连我都没注意到它，换一个更醒目的吧。",
        "哦豁，这个关键词没找到，我们换个话题如何？",
        "你的关键词好像是个隐形的小可爱，我这里暂时看不到它呢。",
        "对不起呀，这个关键词我不太懂，让我们一起探索新的知识领域吧。",
        "唔，这个关键词好像不在我的数据库里，试试其他的关键词怎么样？",
        "这个关键词好像在捉迷藏，我找不到它的踪迹呢。",
        "这个关键词太害羞了，躲起来不见人了，我们换一个吧。",
        "这个词儿有点高冷，不太愿意出现在我的视线里呢。",
        "哎呀，没能找到你说的这个关键词，是不是打错字啦？",
        "看来这个关键词跟我不太熟，介绍一下别的吧？",
        "这个关键词好像不想和我玩，我们换个玩伴吧。",
        "这个关键词像小星星一样遥不可及，给我一些更接地气的词吧",
        "噢，这个关键词有点神秘，似乎超出了我的知识范围呢。",
        "这个关键词好像不在服务区，我们是不是得换个话题呢？"
      ];

      const answer = {
        mineMsg: false,
        nickName: "小管家",
        headUrl: "",
        time: new Date().toLocaleString(),
        messages: [
          {
            type: "text",
            content: responses[Math.floor(Math.random() * responses.length)]
          }
        ]
      };
      recordContent.value.push(answer);
    }
    // 更改对话窗口名称
    if (allContent.value[chatID.value].name === "New Chat") {
      allContent.value[chatID.value].name = content.substring(0, 4);
      storageLocal().setItem("chatData", allContent.value);
      menuItemsData.value = getMenuData();
      allContent.value[chatID.value].message = recordContent.value;
    } else {
      allContent.value[chatID.value].message = recordContent.value;
      storageLocal().setItem("chatData", allContent.value);
    }
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
  allContent.value[chatID.value].message = recordContent.value;
  storageLocal().setItem("chatData", allContent.value);
  message(`聊天记录已清空`, { type: "warning" });
}

// 删除聊天，且删除对话
function delMsgEx() {
  delete allContent.value[chatID.value];
  storageLocal().setItem("chatData", allContent.value);
  menuItemsData.value = getMenuData();
  message(`对话已删除`, { type: "warning" });
  reset();
}

// 导出聊天
const exportMsg = () => {
  clipboardValue.value = JSON.stringify(recordContent.value);
  if (copied.value) {
    message(`聊天记录已复制`, { type: "success" });
  }
};

// 侧边栏隐藏
function toggleAside() {
  isMobile.value = !isMobile.value;
  show.value = !show.value;
}

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
        platform: SendData.value.platform,
        type: SendData.value.type,
        group_id: SendData.value.group_id,
        bubble1: SendData.value.bubble1,
        bubble2: SendData.value.bubble2
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
      SendData.value.bubble1 = formInline.bubble1;
      SendData.value.bubble2 = formInline.bubble2;
      SendData.value.group_id = formInline.group_id;
      SendData.value.platform = formInline.platform;
      SendData.value.type = formInline.type;
      if (SendData.value.platform == 1) {
        model.value = "自定义API";
      } else if (SendData.value.platform == 2) {
        model.value = "问答模式";
      } else if (SendData.value.platform == 3) {
        model.value = "函数执行";
      }
      message(`当前模式为 ${model.value}`, { type: "success" });

      set();
    }
  });
}

// 切换对话
const handleClick = key => {
  const id = key.id;
  chatID.value = id;
  const content = allContent.value[id];
  recordContent.value = content.message;
  set();
  if (Change.value) {
    toggleAside();
  }
};

// 新建对话
const handleNew = () => {
  const id = buildUUID();
  chatID.value = id;

  set();

  const newItem = {
    text: "New Chat",
    id: id
  };
  menuItemsData.value.push(newItem);

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

  const newContent = {
    [id]: { name: "New Chat", message: recordContent.value }
  };
  const result = Object.assign(allContent.value, newContent);
  storageLocal().setItem("chatData", result);
};

onMounted(() => {
  get();
});
</script>

<template>
  <el-container>
    <el-aside v-if="!isMobile" :class="[show ? 'mobile' : 'pc']">
      <div style="display: flex; justify-content: center; align-items: center">
        <el-button class="new_chat" @click="handleNew"> + 新增 </el-button>

        <el-button
          v-if="!isMobile"
          :icon="Fold"
          @click="toggleAside"
          style="
            float: right;
            border: none;
            outline: none;
            background-color: transparent;
            margin-right: 10px;
          "
        />
      </div>
      <el-col>
        <el-menu
          active-text-color="#4b9e5f"
          :default-active="chatID"
          style="background-color: transparent"
        >
          <el-menu-item
            v-for="item in menuItemsData"
            :key="item.id"
            :index="item.id.toString()"
            class="menu-item-background"
            @click="handleClick(item)"
          >
            <el-icon><Comment /></el-icon>
            <span> {{ item.text }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
    <el-container style="height: 85vh; display: flex; flex-direction: column">
      <el-header style="margin-top: 20px">
        <el-button
          v-if="isMobile"
          :icon="Expand"
          @click="toggleAside"
          style="
            float: right;
            border: none;
            outline: none;
            background-color: transparent;
          "
        />
        <span>XD 聊天沙盒</span>
        <span style="color: rgb(30, 206, 88)">{{ model }}</span>
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
                  :style="{ background: SendData.bubble2 }"
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
                      v-else-if="message.type === 'image'"
                      class="chat-image"
                      :src="message.content"
                      :preview-src-list="[message.content]"
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
                      v-else-if="message.type === 'chatgpt'"
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
                  :style="{ background: SendData.bubble1 }"
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
                @confirm="delMsgEx"
                @cancel="delMsg"
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
  max-width: 100%;
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
