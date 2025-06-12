import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取定时任务列表 */
export const getTaskData = (data?: object) => {
  return http.request<Result>("post", "/api/task/list", { data });
};

/** 定时任务添加 */
export const createTaskApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/task/add", {
    data: data
  });
};

/** 定时任务删除 */
export const deleteTaskApi = (id: number) => {
  const url = `/api/task/del/${id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除定时任务 */
export const manyDeleteTaskApi = (data?: object) => {
  return http.request<ResultDetail>("delete", `/api/task/batch_remove`, {
    data
  });
};

/** 更新定时任务状态 */
export const UpdateTask_status = (id: number) => {
  const url = `/api/task/${id}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 获取任务log */
export const GetTaskLog = (id: number) => {
  const url = `/api/task/get_log/${id}`;
  return http.request<ResultDetail>("get", url);
};

/** 更新任务数据 */
export const UpdateTask = (id: number, data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/task/${id}/info`, {
    data: data
  });
};

/** 批量运行定时任务 */
export const RunTaskApi = (data?: object) => {
  return http.request<ResultDetail>("put", `/api/task/run`, {
    data
  });
};

/** 批量停止定时任务 */
export const StopTaskApi = (data?: object) => {
  return http.request<ResultDetail>("put", `/api/task/stop`, {
    data
  });
};
