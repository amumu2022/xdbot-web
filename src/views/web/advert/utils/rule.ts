import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive(<FormRules>{
  custom: [{ required: true, message: "客户名称为必填项", trigger: "blur" }],
  filelist: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  end_time: [{ required: true, message: "日期不能为空", trigger: "blur" }],
  alt: [{ required: true, message: "跳转地址为必填项", trigger: "blur" }]
});
