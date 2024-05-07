import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive(<FormRules>{
  keyword: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  answer: [{ required: true, message: "回复内容不能为空", trigger: "blur" }],
  power: [{ required: true, message: "菜单权限不能为空", trigger: "blur" }]
});
