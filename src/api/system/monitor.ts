/*
 * @Author: XDTEAM
 * @Date: 2024-05-05 23:06:57
 * @LastEditTime: 2025-06-12 21:48:12
 * @LastEditors: XDTEAM
 * @Description: 系统日志类
 */
import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

export type ServerInfo = {
  success: boolean;
  message: string;
  code: number;
  data: any;
  cpuInfo?: any;
  memoryInfo?: any;
  SwapmemoryInfo?: any;
  systemInfo?: any;
  diskInfos?: any;
  python?: string;
};

// 获取日志流
export function getStreamLogs() {
  const url = "/api/monitor/logs/stream";
  return http.sse(url);
}

// 清空日志流
export const DelLogs = () => {
  return http.request<ResultDetail>("delete", "/api/monitor/logs/del");
};

/** 系统重启 */
export const restartCode = () => {
  return http.request<ServerInfo>("get", "/api/restart");
};

/** 获取服务器信息 */
export const getServerInfoApi = () => {
  return http.request<ServerInfo>("get", "/api/monitor/serverInfo");
};

/** 获取机器人数据信息 */
export const getBotInfoApi = () => {
  return http.request<ResultDetail>("get", "/api/bot/info");
};

/** 获取LoginAPI操作日志列表 */
export const getLoginApiList = (data?: object) => {
  return http.request<Result>("post", "/api/monitor/LoginLog/list", {
    data: data
  });
};

/** 删除LoginAPI操作日志 */
export const deleteLoginApi = userId => {
  const url = `/api/monitor/LoginLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除LoginAPI操作日志 */
export const BatchDelLoginApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/monitor/LoginLog/batch_remove",
    {
      data
    }
  );
};

/** 获取ActionLAPI操作日志列表 */
export const getActionApiList = (data?: object) => {
  return http.request<Result>("post", "/api/monitor/ActionLog/list", {
    data: data
  });
};

/** 删除ActionAPI操作日志 */
export const deleteActionApi = userId => {
  const url = `/api/monitor/ActionLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除ActionAPI操作日志 */
export const BatchDelActionApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/monitor/ActionLog/batch_remove",
    {
      data
    }
  );
};
