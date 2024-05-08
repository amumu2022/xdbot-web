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
/** 获取服务器信息 */
export const getServerInfoApi = () => {
  return http.request<ServerInfo>("get", "/api/v1/monitor/serverInfo");
};

/** 获取wsLog日志列表 */
export const getWsLogList = () => {
  return http.request<ResultDetail>("get", "/api/v1/ws/log/list");
};

/** 获取API操作日志列表 */
export const getApiList = (data?: object) => {
  return http.request<Result>("post", "/api/v1/monitor/ApiLog/list", {
    data: data
  });
};

/** 删除API操作日志 */
export const deleteApi = userId => {
  const url = `/api/v1/monitor/ApiLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除API操作日志 */
export const BatchDelApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/monitor/ApiLog/batch_remove",
    {
      data
    }
  );
};

/** 获取LoginAPI操作日志列表 */
export const getLoginApiList = (data?: object) => {
  return http.request<Result>("post", "/api/v1/monitor/LoginLog/list", {
    data: data
  });
};

/** 删除LoginAPI操作日志 */
export const deleteLoginApi = userId => {
  const url = `/api/v1/monitor/LoginLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除LoginAPI操作日志 */
export const BatchDelLoginApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/monitor/LoginLog/batch_remove",
    {
      data
    }
  );
};

/** 获取ActionLAPI操作日志列表 */
export const getActionApiList = (data?: object) => {
  return http.request<Result>("post", "/api/v1/monitor/ActionLog/list", {
    data: data
  });
};

/** 删除ActionAPI操作日志 */
export const deleteActionApi = userId => {
  const url = `/api/v1/monitor/ActionLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除ActionAPI操作日志 */
export const BatchDelActionApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/monitor/ActionLog/batch_remove",
    {
      data
    }
  );
};
