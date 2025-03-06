import { useOnebot11 } from "@/utils/onebot11";
const { RecvData, SendData, NoticeData } = useOnebot11();
import { getWsLogList } from "@/api/system/monitor";
import { useWebSocket } from "@/utils/websocket";
import { message } from "@/utils/message";
import { ref } from "vue";

const { connectWs, CloseWs } = useWebSocket();
const { pushLog } = useOnebot11();

export interface ListItem {
  title: string;
  bot_id: string;
  nickname: string;
  title2: string;
  message: string;
  datetime: string;
  extra?: string;
  status?: "" | "success" | "warning" | "info" | "danger";
}

export interface TabItem {
  key: string;
  name: string;
  list: any[];
}

const realData = [
  {
    key: "1",
    name: "发信",
    list: SendData.value
  },
  {
    key: "2",
    name: "消息",
    list: RecvData.value
  },
  {
    key: "3",
    name: "事件",
    list: NoticeData.value
  }
];
export const noticesData: TabItem[] = realData;

export const ws_status = ref(false);
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

export function onMessage(msg_event: { data: string }) {
  const json_data = JSON.parse(msg_event.data);
  pushLog(json_data.params);
}

export async function onOpen(_socket) {
  // 连接打开时的操作
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

export function onClose(ws_url: string) {
  // 连接关闭时的操作
  CloseWs(ws_url);
  ws_status.value = false;
  message("连接已断开", { type: "error" });
}
