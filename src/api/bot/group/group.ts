import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取分群设置 */
export const getFenqunInfo = () => {
  return http.request<ResultDetail>("get", "/api/v1/account/fq/get_info");
};

/** 更新分群数据 */
export const UpdateFenqun = (data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/v1/account/fq/data/update`, {
    data
  });
};

/** 更新分群数据-表格 */
export const UpdateFenqunTable = (data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/v1/account/fq/data/info`, {
    data
  });
};

/** 获取机器人列表 */
export const getBotList = () => {
  return http.request<ResultDetail>("get", "/api/v1/account/qj/get_bot");
};

/** 获取分群设置 */
export const getQuanjuInfo = (bot_id: string) => {
  return http.request<ResultDetail>(
    "get",
    `/api/v1/account/qj/${bot_id}/getGlobalData`
  );
};

/** 更新全局数据 */
export const UpdateQuanju = (bot_id: string, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/account/qj/${bot_id}/update`,
    {
      data
    }
  );
};

/** 获取群聊列表 */
export const getGroupList = (bot_id: string, data?: object) => {
  return http.request<Result>(
    "post",
    `/api/v1/account/${bot_id}/get_group_list`,
    { data }
  );
};

/** 获取群成员列表 */
export const getGroupMemberList = (
  bot_id: string,
  group_id: string,
  data?: object
) => {
  return http.request<Result>(
    "post",
    `/api/v1/account/${bot_id}/${group_id}/get_group_member_list`,
    { data }
  );
};

/** 退出群聊 */
export const setGroupLeave = (bot_id: string, group_id: string) => {
  return http.request<ResultDetail>(
    "get",
    `/api/v1/bot/set_group_leave?bot_id=${bot_id}&group_id=${group_id}`
  );
};

/** 群打卡 */
export const setGroupSign = (bot_id: string, group_id: string) => {
  return http.request<ResultDetail>(
    "get",
    `/api/v1/bot/set_group_sign?bot_id=${bot_id}&group_id=${group_id}`
  );
};
