import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  // host: [{ required: true, message: "主人账号为必填项", trigger: "blur" }]
});
