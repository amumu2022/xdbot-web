import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "任务名称为必填项", trigger: "blur" }],
  work_file: [{ required: true, message: "任务文件为必填项", trigger: "blur" }],
  schedule: [{ required: true, message: "cron表达式为必填项", trigger: "blur" }]
});
