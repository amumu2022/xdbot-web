import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取菜单列表 */
export const getMenuData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/keyword/menu/list", { data });
};

/** 菜单添加 */
export const createMenuApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/keyword/menu/add", {
    data
  });
};

/** 菜单删除 */
export const deleteMenuApi = Id => {
  const url = `/api/v1/keyword/menu/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除菜单 */
export const manyDeleteMenuApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/keyword/menu/batch_remove",
    {
      data
    }
  );
};

/** 更新菜单状态 */
export const UpdateMenu_status = userId => {
  const url = `/api/v1/keyword/menu/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新菜单数据 */
export const UpdateMenu = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/keyword/menu/${userId}/info`,
    {
      data
    }
  );
};

/** 获取全局问答列表 */
export const getQuanjuData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/keyword/quanju/list", { data });
};

/** 全局问答添加 */
export const createQuanjuApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/keyword/quanju/add", {
    data
  });
};

/** 全局问答删除 */
export const deleteQuanjuApi = Id => {
  const url = `/api/v1/keyword/quanju/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除全局问答 */
export const manyDeleteQuanjuApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/keyword/quanju/batch_remove",
    {
      data
    }
  );
};

/** 更新全局问答状态 */
export const UpdateQuanju_status = userId => {
  const url = `/api/v1/keyword/quanju/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新全局问答数据 */
export const UpdateQuanju = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/keyword/quanju/${userId}/info`,
    {
      data
    }
  );
};

/** 获取分群问答列表 */
export const getFenqunData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/keyword/fenqun/list", { data });
};

/** 分群问答添加 */
export const createFenqunApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/keyword/fenqun/add", {
    data
  });
};

/** 分群问答删除 */
export const deleteFenqunApi = Id => {
  const url = `/api/v1/keyword/fenqun/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除分群问答 */
export const manyDeleteFenqunApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/keyword/fenqun/batch_remove",
    {
      data
    }
  );
};

/** 更新分群问答状态 */
export const UpdateFenqun_status = userId => {
  const url = `/api/v1/keyword/fenqun/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新分群问答数据 */
export const UpdateFenqun = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/keyword/fenqun/${userId}/info`,
    {
      data
    }
  );
};

/** 获取转发列表 */
export const getZhuanfaData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/keyword/zhuanfa/list", { data });
};

/** 转发添加 */
export const createZhuanfaApi = (data?: object) => {
  const formattedData = data as {
    keyword: string;
    answer: string;
    user: number[];
    group: number[];
  };
  const post_data = {
    keyword: formattedData.keyword,
    answer: formattedData.answer,
    data: { user_id: formattedData.user, group_id: formattedData.group }
  };

  return http.request<ResultDetail>("post", "/api/v1/keyword/zhuanfa/add", {
    data: post_data
  });
};

/** 转发删除 */
export const deleteZhuanfaApi = Id => {
  const url = `/api/v1/keyword/zhuanfa/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除转发 */
export const manyDeleteZhuanfaApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/keyword/zhuanfa/batch_remove",
    {
      data
    }
  );
};

/** 更新转发状态 */
export const UpdateZhuanfa_status = userId => {
  const url = `/api/v1/keyword/zhuanfa/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新转发数据 */
export const UpdateZhuanfa = (userId: number, data?: object | string) => {
  const formattedData = data as {
    keyword: string;
    answer: string;
    user: string[];
    group: string[];
  };
  const post_data = {
    keyword: formattedData.keyword,
    answer: formattedData.answer,
    data: { user_id: formattedData.user, group_id: formattedData.group }
  };
  return http.request<ResultDetail>(
    "put",
    `/api/v1/keyword/zhuanfa/${userId}/info`,
    {
      data: post_data
    }
  );
};

/** 获取函数关键词列表 */
export const getctmData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/keyword/ctm/list", { data });
};

/** 函数关键词添加 */
export const createctmApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/keyword/ctm/add", {
    data: data
  });
};

/** 函数关键词删除 */
export const deletectmApi = Id => {
  const url = `/api/v1/keyword/ctm/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除函数关键词 */
export const manyDeletectmApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/keyword/ctm/batch_remove",
    {
      data
    }
  );
};

/** 更新函数关键词状态 */
export const Updatectm_status = userId => {
  const url = `/api/v1/keyword/ctm/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新函数关键词数据 */
export const Updatectm = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/keyword/ctm/${userId}/info`,
    {
      data: data
    }
  );
};
