import { http } from "@/utils/http";
import { Result, ResultDetail } from "@/api/types";

/** 获取用户列表 */
export const getMemberData = (data?: object) => {
  return http.request<Result>("post", "/api/v1/member/user/list", { data });
};

/** 用户添加 */
export const createMemberApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/member/user/add", {
    data
  });
};

/** 用户删除 */
export const deleteMemberApi = Id => {
  const url = `/api/v1/member/user/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除用户 */
export const manyDeleteMemberApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/v1/member/user/batch_remove",
    {
      data
    }
  );
};

/** 更新用户状态 */
export const UpdateMember_status = userId => {
  const url = `/api/v1/member/user/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新用户数据 */
export const UpdateMember = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/v1/member/user/${userId}/info`,
    {
      data
    }
  );
};
