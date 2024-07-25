/*
 * @Author: xdteam
 * @Date: 2024-07-25 23:34:11
 * @LastEditTime: 2024-07-25 23:39:10
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\api\bot\features\customFunc.ts
 * 版权声明
 */
import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

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

/** 获取函数列表 */
export const getFuncData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/features/custom_func/list", {
    data
  });
};

/** 函数添加 */
export const createFuncApi = (data?: object) => {
  return http.request<ResultDetail>(
    "post",
    "/api/v1/features/custom_func/add",
    {
      data: data
    }
  );
};

/** 函数删除 */
export const deleteFuncApi = Id => {
  const url = `/api/v1/features/custom_func/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除函数 */
export const manyDeleteFuncApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/features/custom_func/batch_remove",
    {
      data
    }
  );
};

/** 更新函数状态 */
export const UpdateFunc_status = userId => {
  const url = `/api/v1/features/custom_func/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新函数数据 */
export const UpdateFunc = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/features/custom_func/${userId}/info`,
    {
      data: data
    }
  );
};
