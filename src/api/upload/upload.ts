import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取图片列表 */
export const getPicData = (data?: object) => {
  return http.request<Result>("post", "/api/file/photo/list", { data });
};

/** 图片添加 */
export const createPhotoApi = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/file/photo/add`, {
    data,
    headers: {
      // 请求头
      "Content-Type": "multipart/form-data" // 设置请求头的Content-Type为multipart/form-data，用于支持文件上传
    }
  });
};

/** 图片删除 */
export const deletePhotoApi = Id => {
  const url = `/api/file/photo/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除图片 */
export const manyDeletephotoApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/file/photo/batch_remove",
    {
      data
    }
  );
};

/** 获取音频列表 */
export const getAudioData = (data?: object) => {
  return http.request<Result>("post", "/api/file/audio/list", { data });
};

/** 音频添加 */
export const createAudioApi = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/file/audio/add`, {
    data,
    headers: {
      // 请求头
      "Content-Type": "multipart/form-data" // 设置请求头的Content-Type为multipart/form-data，用于支持文件上传
    }
  });
};

/** 音频删除 */
export const deleteAudioApi = Id => {
  const url = `/api/file/audio/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除音频 */
export const manyDeleteaudioApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/file/audio/batch_remove",
    {
      data
    }
  );
};

/** 获取文件列表 */
export const getOtherData = (data?: object) => {
  return http.request<Result>("post", "/api/file/other/list", { data });
};

/** 文件添加 */
export const createOtherApi = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/file/other/add`, {
    data,
    headers: {
      // 请求头
      "Content-Type": "multipart/form-data" // 设置请求头的Content-Type为multipart/form-data，用于支持文件上传
    }
  });
};

/** 文件删除 */
export const deleteOtherApi = Id => {
  const url = `/api/file/other/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除文件 */
export const manyDeleteOtherApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/file/other/batch_remove",
    {
      data
    }
  );
};
