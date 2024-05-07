import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  parent: [{ required: true, message: "所属应用为必填项", trigger: "blur" }],
  num: [{ required: true, message: "卡密数量为必填项", trigger: "blur" }],
  seconds: [{ required: true, message: "秒数为必填项", trigger: "blur" }]
});
