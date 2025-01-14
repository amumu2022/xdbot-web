import { useOnebot11 } from "@/utils/onebot11";
const { RecvData, SendData, NoticeData } = useOnebot11();

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
