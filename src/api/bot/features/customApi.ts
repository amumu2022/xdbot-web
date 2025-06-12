import { http } from "@/utils/http";
import { Result, ResultDetail, MockDetail } from "@/api/types";

export type Result_PRI = {
  success: boolean;
  code: number;
  message: string;
  result?: {
    /** 列表数据 */
    items: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    page?: number;
  };
};

/** 获取音乐列表 */
export const getMusicData = (data?: object) => {
  return http.request<Result_PRI>("post", "/api/tools/music", { data });
};

/** 获取接口列表 */
export const getApiData = (data?: object) => {
  return http.request<Result>("post", "/api/features/custom_api", { data });
};

/** API运行 */
export const RunAPI = (data: any) => {
  const value = data.test;
  const value_num = value.split("#").length - 1;
  data.value_num = value_num;
  console.log(value_num);
  return http.request<ResultDetail>("post", "/api/features/custom_api/run", {
    data
  });
};

/** API添加 */
export const createAPI = (data: any) => {
  const value = data.test;
  const value_num = value.split("#").length - 1;
  data.value_num = value_num;
  return http.request<ResultDetail>("post", "/api/features/custom_api/add", {
    data
  });
};

/** API删除 */
export const deleteAPI = Id => {
  const url = `/api/features/custom_api/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除API */
export const manyDeleteAPI = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/features/custom_api/batch_remove",
    {
      data
    }
  );
};

/** 更新API状态 */
export const UpdateAPI_status = userId => {
  const url = `/api/features/custom_api/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新API数据 */

export const UpdateAPI = (userId: number, data?: any) => {
  const value = data.test;
  const value_num = value.split("#").length - 1;
  data.value_num = value_num;
  return http.request<ResultDetail>(
    "put",
    `/api/features/custom_api/${userId}/info`,
    {
      data
    }
  );
};

/** 自定义API教程数据 */
export const ApiCourse = (data?: object) => {
  return http.request<MockDetail>("get", `/get-api-course`, {
    data
  });
};
