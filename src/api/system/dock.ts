import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取对接配置 */
export const getDockData = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/v1/set/dock/list`, { data });
};

/** 配置添加 */
export const createDockApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/set/dock/add", {
    data
  });
};

/** 更新配置数据 */
export const UpdateDock = (name: string, data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/v1/set/dock/${name}/info`, {
    data
  });
};

/** 获取脚本内容 */
export const getScript = id => {
  return http.request<ResultDetail>(
    "get",
    `/api/v1/dock/script/content?name=${id}`
  );
};

/** 获取脚本列表 */
export const getScriptData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/dock/script/list", { data });
};

/** 脚本添加 */
export const createScriptApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/dock/script/add", {
    data
  });
};

/** 脚本删除 */
export const deleteScriptApi = Id => {
  const url = `/api/v1/dock/script/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除脚本 */
export const manyDeleteScriptApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/dock/script/batch_remove",
    {
      data
    }
  );
};

/** 更新脚本状态 */
export const UpdateScript_status = userId => {
  const url = `/api/v1/dock/script/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新脚本数据 */
export const UpdateScript = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/dock/script/${userId}/info`,
    {
      data
    }
  );
};
