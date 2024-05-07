import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "脚本名称为必填项", trigger: "blur" }],
  content: [{ required: true, message: "脚本内容为必填项", trigger: "blur" }]
});
