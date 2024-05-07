import { socket } from "@/utils/websocket";
import { isValidJson } from "@/utils/xdteam";
import { message } from "@/utils/message";
import dayjs from "dayjs";
import { ref } from "vue";
import { storageLocal } from "@pureadmin/utils";

const message_dict = ref({});

export const logs = ref<any>([
  // {
  //   level: "INFO",
  //   time: dayjs().format("MM-DD HH:mm:ss"),
  //   bot: "10001",
  //   type: "日志输出",
  //   message: "websocket 连接成功",
  //   data: null
  // }
]);

export const inputText = ref("");
export const ws_status = ref(socket.socket_open);

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

// 连接ws
export function connectWs(ws_url) {
  socket.init(ws_url, onMessage, null, () => {
    ws_status.value = true;
    message("连接建立成功", { type: "success" });
  });
}

// 断开ws
export function CloseWs() {
  socket.close();
  ws_status.value = false;
  message("连接已断开", { type: "warning" });
}

const onMessage = (msg_event: { data: string }) => {
  const json_data = JSON.parse(msg_event.data);
  const action = json_data.action;
  console.log(json_data);
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
    const event_name = json_data.params.event_name;
    const bot_id = json_data.params.bot_id;
    let event_type = "";
    let level = "";
    let message = "";

    switch (event_name) {
      case "message":
        level = "info";
        event_type = json_data.params.message?.message_type;
        message = json_data.params.message.raw_message;
        break;
      case "send_msg":
        level = "success";
        event_type = json_data.params.message?.message_type;
        message = makeMessage(json_data.params.message.message);
        break;
      case "notice":
        level = "warning";
        event_type = json_data.params.message?.notice_type;
        message = "";
        break;
      case "request":
        level = "debug";
        event_type = json_data.params.message?.request_type;
        message = "";
        break;
      default:
        level = "info";
        event_type = "info";
    }
    const log = {
      level: level,
      bot: bot_id,
      time: dayjs().format("MM-DD HH:mm:ss"),
      name: event_name,
      type: event_type,
      data: json_data.params.message,
      message: message.length > 50 ? `${message.slice(0, 47)}...` : message
    };
    logs.value.push(log);
  }
};

// 聊天
export function sendMsg() {
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

// 处理消息
function ProcessMessages(messageList) {
  return messageList
    .map(item => {
      if (item.type === "text") {
        return {
          type: "text",
          content: item.data.text
        };
      } else if (item.type === "image" || item.type === "video") {
        return {
          type: item.type,
          content: item.data.file
        };
      } else if (item.type === "markdown") {
        return {
          type: item.type,
          content: JSON.parse(item.data.content).content
        };
      } else {
        // 对于非 'text' 和非 'image/video' 类型的数据，可以选择跳过或者进行其他处理
        return {
          type: "text",
          content: item.data.text
        };
      }
    })
    .filter(item => item !== null); // 移除所有 null 项
}

// 处理消息数据
function makeMessage(messages) {
  const texts = messages.map(message => {
    if (message.type === "text") {
      return message.data.text;
    } else if (message.type === "image") {
      return "【图片消息】";
    } else if (message.type === "video") {
      return "【视频消息】";
    } else {
      return "【事件消息】";
    }
  });
  // 使用join()方法将提取的文本或特定字符串拼接成一个字符串，中间用一个空格隔开
  const result = texts.join("");
  return result;
}

// 群消息数据
function makeGroupMessage(content) {
  const timestamp = Math.floor(dayjs().valueOf() / 1000);
  const message_id = Math.floor(Math.random() * 900000000) + 1000000000;
  const message = {
    time: timestamp,
    self_id: 10001,
    post_type: "message",
    sub_type: "normal",
    user_id: SaveData.value.user_id,
    message_type: "group",
    message_id: message_id,
    message: [{ type: "text", data: { text: content } }],
    original_message: [{ type: "text", data: { text: content } }],
    raw_message: content,
    font: 0,
    sender: {
      user_id: SaveData.value.user_id,
      nickname: SaveData.value.nickname,
      sex: SaveData.value.sex,
      age: SaveData.value.age,
      card: SaveData.value.card,
      area: null,
      level: SaveData.value.level,
      role: SaveData.value.role,
      title: null
    },
    to_me: false,
    reply: null,
    group_id: SaveData.value.group_id,
    anonymous: null
  };

  return message;
}

// 私聊消息数据
function makePrivateMessage(content) {
  const timestamp = Math.floor(dayjs().valueOf() / 1000);
  const message_id = Math.floor(Math.random() * 900000000) + 1000000000;
  const message = {
    time: timestamp,
    self_id: 10001,
    post_type: "message",
    sub_type: "friend",
    user_id: 651380741,
    message_type: "private",
    message_id: message_id,
    message: [{ type: "text", data: { text: content } }],
    original_message: [{ type: "text", data: { text: content } }],
    raw_message: content,
    font: 0,
    sender: {
      user_id: SaveData.value.user_id,
      nickname: SaveData.value.nickname,
      sex: SaveData.value.sex,
      age: null,
      card: null,
      area: null,
      level: null,
      role: null,
      title: null
    },
    to_me: true,
    reply: null,
    target_id: 10001
  };
  return message;
}

export function getSrc(content) {
  if (content.startsWith("base64://")) {
    return `data:image/png;base64,${content.slice(9)}`;
  }
  return content;
}

export function srcList(content) {
  return [getSrc(content)];
}
