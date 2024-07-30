import { socket } from "@/utils/websocket";
import { isValidJson } from "@/utils/xdteam";
import { message } from "@/utils/message";
import dayjs from "dayjs";
import { ref } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { getWsLogList } from "@/api/system/monitor";

const message_dict = ref({});

export const logs = ref<any>([]);

export const inputText = ref("");
export const ws_status = ref(socket.socket_open);
export const SendData = ref([]);
export const NoticeData = ref([]);
export const RecvData = ref([]);

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
export const connectWs = async ws_url => {
  await socket.init(ws_url, onMessage, null, async () => {
    ws_status.value = true;
    message("连接建立成功", { type: "success" });

    try {
      const response = await getWsLogList();
      const { data } = response;

      data.map(logEntry => {
        pushLog(logEntry);
      });
    } catch (error) {
      console.error("获取日志列表时发生错误:", error);
    }
  });
};

// 断开ws
export function CloseWs() {
  socket.close();
  ws_status.value = false;
  message("连接已断开", { type: "warning" });
}

// 生成日志
function noticeItem(logData) {
  const type = logData.type;
  const group_id = logData.data?.group_id;
  const nickname = logData.data?.nickname;
  const user_name = logData.data?.sender.nickname;
  const user_id = logData.data?.user_id;
  const group_name = logData.data?.group_name;
  let data = {};
  if (logData.name == "send_msg") {
    data = {
      title: `${type === "group" ? group_id : user_id}`,
      title2: "",
      bot_id: logData.bot,
      nickname: nickname,
      message: logData.message,
      datetime: logData.time,
      extra: type === "group" ? "群聊" : "私聊",
      status: type === "group" ? "success" : ""
    };
    SendData.value.unshift(data);
  } else if (logData.name == "message") {
    data = {
      title: `${type === "group" ? group_name : user_name} (${
        type === "group" ? group_id : user_id
      })`,
      bot_id: logData.bot,
      title2: `${user_name} (${logData.data?.sender.user_id}) `,
      nickname: nickname,
      group_name: group_name,
      message: logData.message,
      datetime: logData.time,
      extra: type === "group" ? "群聊" : "私聊",
      status: type === "group" ? "success" : ""
    };
    RecvData.value.unshift(data);
  } else if (logData.name == "notice") {
    data = {
      title: `${type === "group" ? group_id : user_id}`,
      title2: "",
      bot_id: logData.bot,
      nickname: nickname,
      message: makeNotice(type, user_id, group_id, logData.data),
      datetime: logData.time,
      extra: "事件消息",
      status: "warning"
    };
    NoticeData.value.unshift(data);
  } else if (logData.name == "request") {
    data = {
      title: `${type === "group" ? group_id : user_id}`,
      title2: "",
      bot_id: logData.bot,
      nickname: nickname,
      message: makeRequest(type, user_id, group_id, logData.data),
      datetime: logData.time,
      extra: "请求消息",
      status: "danger"
    };
    NoticeData.value.unshift(data);
  }
}

function pushLog(params) {
  const event_name = params.event_name;
  const bot_id = params.bot_id;
  const time = dayjs(params.time * 1000).format("MM-DD HH:mm:ss");
  let event_type = "";
  let level = "";
  let message = "";

  switch (event_name) {
    case "message":
      level = "info";
      event_type = params.message?.message_type;
      message = params.message.raw_message;
      break;
    case "send_msg":
      level = "success";
      event_type = params.message?.message_type;
      message = makeMessage(params.message.message);
      break;
    case "notice":
      level = "warning";
      event_type = params.message?.notice_type;
      message = "";
      break;
    case "request":
      level = "debug";
      event_type = params.message?.request_type;
      message = "";
      break;
    default:
      level = "info";
      event_type = "info";
  }
  const log = {
    level: level,
    bot: bot_id,
    time: time,
    name: event_name,
    type: event_type,
    data: params.message,
    message: message.length > 50 ? `${message.slice(0, 47)}...` : message
  };
  const log2 = {
    level: level,
    bot: bot_id,
    time: time,
    name: event_name,
    type: event_type,
    data: params.message,
    message: message
  };
  logs.value.unshift(log);
  noticeItem(log2);
}

const onMessage = (msg_event: { data: string }) => {
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

// 处理notice消息
export function makeNotice(type, user_id, group_id, data) {
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
export function makeRequest(type, user_id, group_id, data) {
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

export function getSrc(content) {
  if (content.startsWith("base64://")) {
    return `data:image/png;base64,${content.slice(9)}`;
  }
  return content;
}

export function srcList(content) {
  return [getSrc(content)];
}
