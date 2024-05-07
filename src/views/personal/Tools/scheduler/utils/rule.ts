import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  id_code: [{ required: true, message: "任务选项为必填项", trigger: "blur" }],
  task_code: [{ required: true, message: "任务ID为必填项", trigger: "blur" }],
  name: [{ required: true, message: "群聊号码为必填项", trigger: "blur" }],
  taskCommand: [
    { required: true, message: "任务指令为必填项", trigger: "blur" }
  ],
  cronExpression: [
    { required: true, message: "cron表达式为必填项", trigger: "blur" }
  ]
});
