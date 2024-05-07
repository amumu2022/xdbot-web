import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取广告列表 */
export const getAdvertData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/system/advert/list", { data });
};

/** 广告添加 */
export const createAdvertApi = data => {
  return http.request<ResultDetail>(
    "post",
    "/api/v1/system/advert/add",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/** 广告删除 */
export const deleteAdvertApi = id => {
  const url = `/api/v1/system/advert/del/${id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除广告 */
export const manyDeleteAdvertApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/system/advert/batch_remove",
    {
      data
    }
  );
};

/** 更新广告状态 */
export const UpdateAdvert_status = userId => {
  const url = `/api/v1/system/advert/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新广告数据 */
export const UpdateAdvert = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/system/advert/${userId}/info`,
    {
      data
    },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
