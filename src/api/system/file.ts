/*
 * @Author: XDTEAM
 * @Date: 2024-05-05 23:06:57
 * @LastEditTime: 2025-06-12 21:34:15
 * @LastEditors: XDTEAM
 * @Description: 文件接口
 */
import { http } from "@/utils/http";
import { ResultDetail } from "@/api/types";

/** 获取文件列表 */
export const getFileData = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/list", {
    data
  });
};

/** 获取上一级文件列表 */
export const getFileLastData = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/last/list", {
    data
  });
};

/** 获取文件内容 */
export const getFileContent = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/read", {
    data
  });
};

/** 文件添加 */
export const createFileApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/add/file", {
    data
  });
};

/** 文件夹添加 */
export const createFoldApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/add/fold", {
    data
  });
};

/** 文件删除 */
export const deleteFileApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/file/folds/del", {
    data
  });
};

/** 更新文件数据 */
export const UpdateFile = (data?: object) => {
  return http.request<ResultDetail>("put", `/api/file/folds/edit`, {
    data
  });
};

/** 重命名文件 */
export const RenameFile = (data?: object) => {
  return http.request<ResultDetail>("put", `/api/file/folds/rename`, {
    data
  });
};
