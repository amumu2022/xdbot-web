import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "插件名称为必填项", trigger: "blur" }],
  folder: [{ required: true, message: "文件夹名称为必填项", trigger: "blur" }],
  image: [{ required: true, message: "图片链接为必填项", trigger: "blur" }],
  code: [{ required: true, message: "插件代码不能为空", trigger: "blur" }]
});
