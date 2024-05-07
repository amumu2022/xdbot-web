import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  keyword: [{ required: true, message: "关键词为必填项", trigger: "blur" }],
  answer: [{ required: true, message: "回复语句为必填项", trigger: "blur" }]
  // group: [{ required: true, message: "群聊号码为必填项", trigger: "blur" }],
  // user: [{ required: true, message: "用户号码为必填项", trigger: "blur" }]
});
