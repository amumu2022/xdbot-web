import { http } from "@/utils/http";
import { Result, ResultDetail, MockDetail } from "@/api/types";

/** 每日一言数据 */
export const getYiyan = (data?: object) => {
  return http.request<MockDetail>("get", `/get-yiyan`, {
    data
  });
};

/** 获取商品面板信息 */
export const getPanelData = () => {
  return http.request<ResultDetail>("get", "/api/merchant/product/panel");
};

/** 获取商品列表 */
export const getProductData = (data?: object) => {
  return http.request<Result>("post", "/api/merchant/product/list", {
    data
  });
};

/** 商品添加 */
export const createProductApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/merchant/product/add", {
    data
  });
};

/** 商品删除 */
export const deleteProductApi = Id => {
  const url = `/api/merchant/product/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除商品 */
export const manyDeleteProductApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/merchant/product/batch_remove",
    {
      data
    }
  );
};

/** 更新商品状态 */
export const UpdateProduct_status = userId => {
  const url = `/api/merchant/product/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新商品数据 */
export const UpdateProduct = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/merchant/product/${userId}/info`,
    {
      data
    }
  );
};

/** 获取分类列表 */
export const getCategoryData = (data?: object) => {
  return http.request<Result>("post", "/api/merchant/category/list", {
    data
  });
};

/** 分类添加 */
export const createCategoryApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/merchant/category/add", {
    data
  });
};

/** 分类删除 */
export const deleteCategoryApi = Id => {
  const url = `/api/merchant/category/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除分类 */
export const manyDeleteCategoryApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/merchant/category/batch_remove",
    {
      data
    }
  );
};

/** 更新分类状态 */
export const UpdateCategory_status = userId => {
  const url = `/api/merchant/category/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新分类数据 */
export const UpdateCategory = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/merchant/category/${userId}/info`,
    {
      data
    }
  );
};

/** 获取用户列表 */
export const getUserData = (data?: object) => {
  return http.request<Result>("post", "/api/merchant/user/list", { data });
};

/** 用户添加 */
export const createUserApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/merchant/user/add", {
    data
  });
};

/** 用户删除 */
export const deleteUserApi = Id => {
  const url = `/api/merchant/user/del/${Id}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除用户 */
export const manyDeleteUserApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/merchant/user/batch_remove",
    {
      data
    }
  );
};

/** 更新用户状态 */
export const UpdateUser_status = userId => {
  const url = `/api/merchant/user/${userId}/status`;
  return http.request<ResultDetail>("put", url);
};

/** 更新用户数据 */
export const UpdateUser = (userId: number, data?: object | string) => {
  return http.request<ResultDetail>(
    "put",
    `/api/merchant/user/${userId}/info`,
    {
      data
    }
  );
};

/** 获取订单列表 */
export const getOrdersData = (data?: object) => {
  return http.request<Result>("post", "/api/merchant/orders/list", {
    data: data
  });
};

/** 删除订单 */
export const deleteOrdersApi = userId => {
  const url = `/api/merchant/orders/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除订单 */
export const manyDeleteOrdersApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/merchant/orders/batch_remove",
    {
      data
    }
  );
};
