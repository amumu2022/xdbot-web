import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  detail: [{ required: true, message: "详细内容为必填项", trigger: "blur" }],
  low: [{ required: true, message: "底部内容为必填项", trigger: "blur" }],
  notice: [{ required: true, message: "不足提示为必填项", trigger: "blur" }],
  top: [{ required: true, message: "顶部内容为必填项", trigger: "blur" }],
  success: [{ required: true, message: "成功提示为必填项", trigger: "blur" }]
});
