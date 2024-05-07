export const dirFormRules = {
  open_type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  code: [{ required: true, message: "请输入菜单标识", trigger: "blur" }],
  name: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  menu_name: [
    { required: true, message: "菜单组件名为必填项", trigger: "blur" }
  ],
  url: [
    { required: true, message: "路由地址为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.startsWith("/")) {
          callback();
        } else {
          callback(new Error("路由必须`/`开头"));
        }
      },
      trigger: "blur"
    }
  ]
};
export const menuFormRules = {
  open_type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  code: [{ required: true, message: "请输入菜单标识", trigger: "blur" }],
  menu_name: [
    { required: true, message: "菜单组件名为必填项", trigger: "blur" }
  ],
  name: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  url: [
    { required: true, message: "请输入路由地址", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.startsWith("/")) {
          callback();
        } else {
          callback(new Error("路由必须`/`开头"));
        }
      },
      trigger: "blur"
    }
  ]
};
export const permissionFormRules = {
  open_type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  menu_name: [
    { required: true, message: "菜单组件名为必填项", trigger: "blur" }
  ],
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入菜单标识", trigger: "blur" }],
  url: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
};
