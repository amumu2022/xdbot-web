import { http } from "@/utils/http";
import { ResultDetail } from "@/api/types";

/** 获取菜单列表，用于动态菜单 */
export const getAsyncRoutes = (data?: object) => {
  return http.request<ResultDetail>("get", "/api/v1/system/menu", {
    params: data
  });
};

/** 获取菜单列表，用于菜单表格 */
export const getRoutesData = (data?: object) => {
  return http.request<ResultDetail>("get", "/api/v1/system/menu/data", {
    params: data
  });
};

/** 菜单添加 */
export const createMenuApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/system/menu/add", {
    data: data
  });
};

/** 菜单删除 */
export const deleteMenuApi = Id => {
  const url = `/api/v1/system/menu/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 菜单更新状态 */
export const UpdateMenu_status = Id => {
  const url = `/api/v1/system/menu/${Id}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 批量删除菜单 */
export const manyDeleteMenuApi = (data?: object) => {
  return http.request<ResultDetail>(
    "post",
    "/api/v1/system/menu/del/batch_remove",
    {
      data
    }
  );
};

/** 更新菜单数据 */
export const UpdateMenu = (Id: number, data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/v1/system/menu/${Id}/info`, {
    data
  });
};
