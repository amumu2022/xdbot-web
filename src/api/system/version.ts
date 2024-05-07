import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取版本列表 */
export const getVersionData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/system/version/list", { data });
};

/** 版本添加 */
export const createVersionApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/system/version/add", {
    data
  });
};

/** 版本删除 */
export const deleteVersionApi = Id => {
  const url = `/api/v1/system/version/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除版本 */
export const manyDeleteVersionApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/system/version/batch_remove",
    {
      data
    }
  );
};

/** 更新版本状态 */
export const UpdateVersion_status = userId => {
  const url = `/api/v1/system/version/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新版本数据 */
export const UpdateVersion = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/system/version/${userId}/info`,
    {
      data
    }
  );
};
