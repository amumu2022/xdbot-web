import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "商品名称为必填项", trigger: "blur" }],
  category: [{ required: true, message: "商品分类为必填项", trigger: "blur" }],
  price: [{ required: true, message: "价格为必填项", trigger: "blur" }],
  exchange: [{ required: true, message: "是否兑换为必填项", trigger: "blur" }]
});
