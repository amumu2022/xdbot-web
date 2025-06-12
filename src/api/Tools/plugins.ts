/*
 * @Author: xdteam
 * @Date: 2024-05-28 21:34:05
 * @LastEditTime: 2024-08-02 00:20:59
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\api\Tools\plugins.ts
 * 版权声明
 */
import { http } from "@/utils/http";
import { ResultDetail, MockDetail } from "@/api/types";

/** 获取插件总列表 */
export const getPluginsAllList = () => {
  return http.request<MockDetail>("get", "/api/plugins/online/list");
};

/** 获取插件列表 */
export const getPluginsList = (data?: object) => {
  return http.request<MockDetail>("post", "/api/plugins/list", { data });
};

/** 插件添加 */
export const createPluginsApi = (data: object) => {
  return http.request<ResultDetail>("post", `/api/plugins/add`, {
    data: data
  });
};
/** 插件删除 */
export const deletePluginsApi = (data?: object) => {
  return http.request<ResultDetail>("delete", "/api/plugins/del", {
    data: data
  });
};

/** 插件更新 */
export const UpdatePluginsApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/plugins/update", {
    data: data
  });
};

/** 更新插件状态 */
export const UpdatePlugins_status = (data?: object) => {
  return http.request<ResultDetail>("put", "/api/plugins/status", {
    data: data
  });
};

/** 获取插件代码 */
export const GetPluginCode = folder => {
  return http.request<ResultDetail>(
    "get",
    `/api/plugins/get/code/${folder}`
  );
};

/** 插件更新代码 */
export const UpdatePluginCodeApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/plugins/update/code", {
    data: data
  });
};

/** 添加本地插件 */
export const createPluginLocalApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/plugins/add/local", {
    data: data
  });
};
