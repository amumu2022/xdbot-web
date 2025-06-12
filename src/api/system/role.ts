import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<Result>("post", "/api/admin/role/list", { data });
};

/** 角色添加 */
export const createRoleApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/admin/role/add", {
    data: data
  });
};

/** 删除角色 */
export const deleteRoleApi = userId => {
  const url = `/api/admin/role/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除角色 */
export const BatchDelRole = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/admin/role/batch_remove", {
    data
  });
};

/** 更新角色状态 */
export const UpdateRole_status = userId => {
  const url = `/api/admin/role/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新角色数据 */
export const UpdateRole = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/admin/role/${userId}/info`, {
    data
  });
};
