import { ref } from "vue";

import {
  getServerInfoApi,
  ServerInfo,
  getBotInfoApi
} from "@/api/system/monitor";

export const cpuInfoTable = ref<Record<string, string>[]>([]);
export const BotList = ref<Record<string, string>[]>([]);
export const loading = ref(true);
export const timerId = ref(null);

const isFirstLoad = ref(true);
export async function getList() {
  try {
    if (isFirstLoad.value) {
      loading.value = true; // 首次加载时显示骨架屏
    }
    const { data } = await getServerInfoApi();

    const serverInfo = data as ServerInfo;
    const diskInfo = serverInfo.diskInfos;
    const totalCapacity = diskInfo.reduce((acc, disk) => acc + disk.total, 0);
    const totalUsed = diskInfo.reduce((acc, disk) => acc + disk.Used, 0);
    const totalUsagePercentage = (totalUsed / totalCapacity) * 100;

    // 获取机器人信息并处理
    const { data: botData } = await getBotInfoApi();

    const AllBots = botData.results; // 过滤出在线的机器人

    const onlineBots = AllBots.filter(bot => bot.online); // 过滤出在线的机器人

    // 累加所有在线机器人的消息统计数据
    const aggregatedMessages = onlineBots.reduce(
      (acc, bot) => {
        acc.totalRecv += bot.total_recv_messages;
        acc.todayRecv += bot.today_recv_messages;
        acc.totalSend += bot.total_send_messages;
        acc.todaySend += bot.today_send_messages;
        return acc;
      },
      { totalRecv: 0, todayRecv: 0, totalSend: 0, todaySend: 0 }
    );

    // 设置CPU信息表格
    BotList.value = onlineBots;
    cpuInfoTable.value = [
      {
        field: "CPU",
        value: `${serverInfo.cpuInfo.used}%`
      },
      {
        field: "内存",
        value: `${serverInfo.memoryInfo.used}%`
      },
      {
        field: "磁盘",
        value: `${totalUsagePercentage.toFixed(1)}%`
      },
      {
        field: "收信总数",
        value: aggregatedMessages.totalRecv
      },
      {
        field: "今日收信",
        value: aggregatedMessages.todayRecv
      },
      {
        field: "发信总数",
        value: aggregatedMessages.totalSend
      },
      {
        field: "今日发信",
        value: aggregatedMessages.todaySend
      }
    ];
  } finally {
    if (isFirstLoad.value) {
      loading.value = false;
      isFirstLoad.value = false;
    }
  }
}

getList(); // 首次加载数据
timerId.value = setInterval(getList, 60000); // 每 60 秒定时刷新
