import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  keyword: [{ required: true, message: "关键词为必填项", trigger: "blur" }],
  url: [
    { required: true, message: "接口地址为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.startsWith("http")) {
          callback();
        } else {
          callback(new Error("路由必须`http`开头"));
        }
      },
      trigger: "blur"
    }
  ],
  back_set: [{ required: true, message: "返回内容为必填项", trigger: "blur" }],
  test: [{ required: true, message: "测试语句为必填项", trigger: "blur" }]
});
