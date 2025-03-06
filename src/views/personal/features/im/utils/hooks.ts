import { useWebSocket } from "@/utils/websocket";
import { useOnebot11 } from "@/utils/onebot11";

import { isValidJson } from "@/utils/xdteam";
import { message } from "@/utils/message";

import { ref } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { getWsLogList } from "@/api/system/monitor";

const message_dict = ref({});
export const inputText = ref("");
export const ws_status = ref(false);
export const recordContent = ref<any>([
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

export const SaveData = ref({
  ws_url: "ws://127.0.0.1:31400/onebot/v11/ws",
  nickname: "木木",
  message_type: "group",
  sex: "male",
  age: 18,
  user_id: "654321",
  group_id: "123456",
  card: "我才不是小呆瓜",
  level: "16",
  role: "member",
  bubble1: "#a3c3f6" /* “我的”气泡 */,
  bubble2: "#fff" /* “ta的”气泡 */
});

const { connectWs, WebSocketClient, CloseWs } = useWebSocket();
const { pushLog, ProcessMessages, makeGroupMessage, makePrivateMessage } =
  useOnebot11();

function onClose(ws_url: string) {
  CloseWs(ws_url);
  ws_status.value = false;
  message("连接已断开", { type: "error" });
}

async function onOpen(_socket) {
  ws_status.value = true;
  message("连接建立成功啦", { type: "success" });
  try {
    const response = await getWsLogList();
    const { data } = response;
    data.forEach(logEntry => pushLog(logEntry));
  } catch (error) {
    console.error("获取日志列表时发生错误:", error);
  }
}

export function CloseWsFunc(ws_url: string) {
  CloseWs(ws_url);
  message("连接已断开", { type: "error" });
}

/**
 * 增强的WebSocket连接函数
 * @param {string} ws_url - WebSocket服务器地址
 * @param {Function} [onMessage] - 消息接收回调函数（可选）
 * @param {Function} [onOpen] - 连接成功回调函数（可选）
 * @param {Function} [onClose] - 连接关闭回调函数（可选）
 * @returns {Promise<void>}
 */
export const connectWsEnhanced = async (ws_url: string) => {
  if (ws_status.value) {
    message("不能重复建立连接", { type: "warning" });
  }

  await connectWs(
    ws_url,
    onMessage,
    async socket => {
      // 连接打开时的操作
      onOpen(socket);
    },
    () => onClose(ws_url)
  );
};

function onMessage(msg_event: { data: string }) {
  const json_data = JSON.parse(msg_event.data);
  const action = json_data.action;
  if (action == "send_msg") {
    const content = json_data.params.message;

    const answer = {
      mineMsg: false,
      nickName: "小管家",
      headUrl: "",
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      messages: ProcessMessages(content)
    };
    recordContent.value.push(answer);
    storageLocal().setItem("wsChatData", recordContent.value);
  } else if (action == "make_log") {
    pushLog(json_data.params);
  }
}

// 聊天
export function sendMsg() {
  const content = inputText.value.trim();
  const socket = WebSocketClient.getInstance(SaveData.value.ws_url);

  if (content) {
    const newMessage = {
      mineMsg: true,
      headUrl:
        "http://q.qlogo.cn/headimg_dl?dst_uin=651380741&spec=640&img_type=jpg",
      nickName: "我",
      time: new Date().toLocaleString(),
      content: inputText.value
    };
    if (
      SaveData.value.message_type == "private" ||
      SaveData.value.message_type == "group"
      // 发送消息模式
    ) {
      message_dict.value =
        SaveData.value.message_type == "group"
          ? makeGroupMessage(content)
          : makePrivateMessage(content);
    } else {
      if (isValidJson(content)) {
        const jsonData = JSON.parse(content);
        message_dict.value = jsonData;
      } else {
        message_dict.value =
          SaveData.value.message_type == "group"
            ? makeGroupMessage(content)
            : makePrivateMessage(content);
      }
    }
    recordContent.value.push(newMessage);
    inputText.value = "";
    socket.send(message_dict.value);
    storageLocal().setItem("wsChatData", recordContent.value);
  } else {
    message("发送内容不能为空", { type: "warning" });
  }
}
