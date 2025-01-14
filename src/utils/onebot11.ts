import dayjs from "dayjs";
import { ref } from "vue";

const SaveData = ref({
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
const SendData = ref([]);
const NoticeData = ref([]);
const RecvData = ref([]);
const Logs = ref<any>([]);

/**
 * 处理消息列表，将不同类型的消息转换为统一格式
 * @param {Array} messageList - 原始消息列表
 * @returns {Array} 处理后的消息列表
 */
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
        return {
          type: "text",
          content: item.data.text
        };
      }
    })
    .filter(item => item !== null);
}

/**
 * 将消息数组转换为文本字符串
 * @param {Array} messages - 消息数组
 * @returns {string} 拼接后的文本内容
 */
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
  return texts.join("");
}

/**
 * 生成群聊消息对象
 * @param {string} content - 消息内容
 * @returns {Object} 群聊消息对象
 */
function makeGroupMessage(content) {
  const timestamp = Math.floor(dayjs().valueOf() / 1000);
  const message_id = Math.floor(Math.random() * 900000000) + 1000000000;
  return {
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
}

/**
 * 生成私聊消息对象
 * @param {string} content - 消息内容
 * @returns {Object} 私聊消息对象
 */
function makePrivateMessage(content) {
  const timestamp = Math.floor(dayjs().valueOf() / 1000);
  const message_id = Math.floor(Math.random() * 900000000) + 1000000000;
  return {
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
}

/**
 * 生成通知消息文本
 * @param {string} type - 通知类型
 * @param {string} user_id - 用户ID
 * @param {string} group_id - 群组ID
 * @param {Object} data - 附加数据
 * @returns {string} 通知消息文本
 */
function makeNotice(type, user_id, group_id, data) {
  let text = "";
  if (type == "group_increase") {
    text = `新成员 (${user_id}) 进入了群 (${group_id})`;
  } else if (type == "group_decrease") {
    text = `成员 (${user_id}) 退出了群 (${group_id})， 操作者为${data?.operator_id}`;
  } else if (type == "offline_file") {
    text = `成员 (${user_id}) 在群 (${group_id}) 上传了文件${data?.file.name}，大小为${data?.file.size}`;
  } else if (type == "group_recall") {
    text = `成员 (${user_id}) 在群 (${group_id}) 撤回了一条消息${data?.message_id}， 操作者为${data?.operator_id}`;
  } else if (type == "friend_recall") {
    text = `好友 (${user_id}) 撤回了一条消息${data?.message_id}`;
  } else if (type == "notify") {
    const sub_type = data?.sub_type;

    if (sub_type == "poke") {
      if (!group_id) {
        text = `好友 (${user_id}) 戳了一下你`;
      } else {
        text = `成员 (${user_id}) 在群 (${group_id}) 戳了一下你`;
      }
    } else if (sub_type == "lucky_king") {
      text = `成员 (${user_id}) 在群 (${group_id}) 取得了群红包运气王`;
    } else if (sub_type == "honor") {
      text = `成员 (${user_id}) 在群 (${group_id}) 的成员荣誉发生变更`;
    }
  } else if (type == "group_card") {
    text = `成员 (${user_id}) 在群 (${group_id}) 修改了群名片 (${data?.card_old}-->${data?.card_new})`;
  } else if (type == "lucky_king") {
    text = `成员 (${user_id}) 在群 (${group_id}) 的成员头衔发生变更 (${data?.title})`;
  } else if (type == "friend_add") {
    text = `用户 (${user_id}) 已添加您为好友`;
  } else if (type == "group_ban") {
    if (data?.sub_type == "ban") {
      text = `成员 (${user_id}) 在群 (${group_id}) 被禁言${data?.duration}秒， 操作者为${data?.operator_id}`;
    } else {
      text = `成员 (${user_id}) 在群 (${group_id}) 被接触禁言， 操作者为${data?.operator_id}`;
    }
  } else if (type == "group_admin") {
    if (data?.sub_type == "set") {
      text = `成员 (${user_id}) 在群 (${group_id}) 被设置为管理员身份`;
    } else {
      text = `管理员 (${user_id}) 在群 (${group_id}) 被取消管理员身份`;
    }
  }

  return text;
}

/**
 * 生成请求消息文本
 * @param {string} type - 请求类型
 * @param {string} user_id - 用户ID
 * @param {string} group_id - 群组ID
 * @param {Object} data - 附加数据
 * @returns {string} 请求消息文本
 */
function makeRequest(type, user_id, group_id, data) {
  let text = "";

  if (type == "friend") {
    text = `用户 (${user_id}) 申请添加您为好友，理由为：${data?.comment}`;
  } else if (type == "group") {
    text = `用户 (${user_id}) 申请加入群聊，理由为： (${group_id})， 操作者为${data?.operator_id}`;
  }
  return text;
}

/**
 * 获取资源路径
 * @param {string} content - 原始内容
 * @returns {string} 处理后的资源路径
 */
function getSrc(content) {
  if (content.startsWith("base64://")) {
    return `data:image/png;base64,${content.slice(9)}`;
  }
  return content;
}

/**
 * 获取资源路径列表
 * @param {string} content - 原始内容
 * @returns {Array} 资源路径列表
 */
function srcList(content) {
  return [getSrc(content)];
}

/**
 * 推送日志
 * @param {Object} params - 日志参数
 */
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
  Logs.value.unshift(log);
  noticeItem(log2);
}

/**
 * 处理并记录不同类型的日志消息
 * @param {Object} logData - 日志数据对象
 */
function noticeItem(logData) {
  const type = logData.type;
  const group_id = logData.data?.group_id;
  const nickname = logData.data?.nickname;
  const user_name = logData.data?.sender?.nickname;
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
    SendData?.value?.unshift(data);
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
    RecvData?.value?.unshift(data);
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
    NoticeData?.value?.unshift(data);
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

/**
 * onebot11对象
 * @returns {Object} 返回WebSocket相关状态和方法
 */
export const useOnebot11 = () => {
  return {
    ProcessMessages,
    makeMessage,
    makePrivateMessage,
    makeGroupMessage,
    makeNotice,
    makeRequest,
    getSrc,
    srcList,
    pushLog,
    SaveData,
    SendData,
    NoticeData,
    RecvData,
    Logs
  };
};
