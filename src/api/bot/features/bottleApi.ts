/*
 * @Author: xdteam
 * @Date: 2024-09-25 22:54:56
 * @LastEditTime: 2024-09-25 23:01:10
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\src\api\bot\features\bottleApi.ts
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

/** 获取漂流瓶列表 */
export const getBottleData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/game/bottle/list", {
    data
  });
};

/** 漂流瓶删除 */
export const deleteBottleApi = Id => {
  const url = `/api/v1/game/bottle/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 更新漂流瓶状态 */
export const UpdateBottle_status = (id: number, toggle?: string | number) => {
  const url = `/api/v1/game/bottle/${id}/status?toggle=${toggle}`;
  return http.request<ResultDetail>("put", url);
};

/** 更新漂流瓶数据 */
export const UpdateBottle = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/game/bottle/${userId}/info`,
    {
      data: data
    }
  );
};
