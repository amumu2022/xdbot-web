import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取卡密列表 */
export const getSkeyData = (data?: object) => {
  return http.request<Result>("post", "/api/account/skey/list", { data });
};

/** 卡密添加 */
export const createSkeyApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/account/skey/add", {
    data
  });
};

/** 卡密删除 */
export const deleteSkeyApi = Id => {
  const url = `/api/account/skey/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除卡密 */
export const manyDeleteSkeyApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/account/skey/batch_remove",
    {
      data
    }
  );
};

/** 更新卡密状态 */
export const UpdateSkey_status = userId => {
  const url = `/api/account/skey/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新卡密数据 */
export const UpdateSkey = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/account/skey/${userId}/info`,
    {
      data
    }
  );
};
