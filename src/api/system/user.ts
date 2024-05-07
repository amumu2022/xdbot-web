import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  message: string;
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles?: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  code: number;
  message: string;
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/v1/user/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/api/v1/user/refreshToken", {
    data
  });
};

type Result_table = {
  success: boolean;
  data?: {
    /** 列表数据 */
    results: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    page?: number;
  };
};

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: {
    role_id?: [];
    user_role?: [];
  };
};

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<Result_table>("post", "/api/v1/admin/user/list", {
    data
  });
};

/** 新增用户 */
export const AddUser = (data?: object) => {
  return http.request<Result>("post", "/api/v1/admin/user/add", { data });
};

/** 删除用户 */
export const DelUser = userId => {
  const url = `/api/v1/admin/user/del/${userId}`;
  return http.request<Result>("delete", url);
};

/** 批量删除用户 */
export const BatchDelUser = (data?: object) => {
  return http.request<Result>("post", "/api/v1/admin/user/del/batch_remove", {
    data
  });
};

/** 更新用户状态 */
export const UpdateUser_status = userId => {
  const url = `/api/v1/admin/user/${userId}/status`;
  return http.request<Result>("put", url);
};

/** 更新用户数据 */
export const UpdateUser = (userId: number, data?: object | string) => {
  return http.request<Result>("put", `/api/v1/admin/user/${userId}/info`, {
    data
  });
};

/** 更新用户头像 */
export const UpdateUserAvatar = (userId: number, data?: object) => {
  return http.request<Result>("post", `/api/v1/admin/user/${userId}/avatar`, {
    data,
    headers: {
      // 请求头
      "Content-Type": "multipart/form-data" // 设置请求头的Content-Type为multipart/form-data，用于支持文件上传
    }
  });
};

/** 用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/api/v1/admin/user/role");
};

/** 用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (userId: number) => {
  const url = `/api/v1/admin/${userId}/role`;
  return http.request<Result>("get", url);
};

/** 更新用户角色信息 */
export const SetRole = (data?: object) => {
  return http.request<Result>("put", "/api/v1/admin/user/set/role", { data });
};
