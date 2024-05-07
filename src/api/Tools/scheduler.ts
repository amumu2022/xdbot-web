import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取定时任务列表 */
export const getTaskData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/task/list", { data });
};

/** 定时任务添加 */
export const createTaskApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/task/add", {
    data: data
  });
};

/** 定时任务删除 */
export const deleteTaskApi = (id_code: number, task_code: number) => {
  const url = `/api/v1/task/del/${id_code}/${task_code}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除定时任务 */
export const manyDeleteTaskApi = (id_code: number, data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    `/api/v1/task/${id_code}/batch_remove`,
    {
      data
    }
  );
};

/** 更新定时任务状态 */
export const UpdateTask_status = (id_code: number, task_code: number) => {
  const url = `/api/v1/task/${id_code}/${task_code}/status`;
  return http.request<ResultDetail>("put", url);
};
