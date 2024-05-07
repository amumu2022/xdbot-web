import { http } from "@/utils/http";
import { ResultDetail } from "@/api/types";

/** 发送邮件 */
export const ApiSendEmail = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/tools/send_email", {
    data
  });
};

/** 发送邮件 */
export const ApiText2Pic = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/v1/tools/text2pic", {
    data
  });
};
