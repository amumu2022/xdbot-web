import {
  SendData,
  NoticeData,
  RecvData
} from "@/views/personal/features/im/utils/hooks";
export interface ListItem {
  title: string;
  bot_id: string;
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
