import { http } from "@/utils/http";
import { ResultDetail, MockDetail } from "@/api/types";

/** 获取插件总列表 */
export const getPluginsAllList = (data?: object) => {
  return http.request<MockDetail>("get", "/getPluginsList", { data });
};

/** 获取插件列表 */
export const getPluginsList = (data?: object) => {
  return http.request<MockDetail>("post", "/api/v1/plugins/add", { data });
};

/** 插件添加 */
export const createPluginsApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/plugins/add", {
    data: data
  });
};

/** 插件删除 */
export const deletePluginsApi = (data?: object) => {
  return http.request<ResultDetail>("delete", "/api/v1/plugins/del", {
    data: data
  });
};

/** 更新插件状态 */
export const UpdatePlugins_status = (data?: object) => {
  return http.request<ResultDetail>("put", "/api/v1/plugins/status", {
    data: data
  });
};
