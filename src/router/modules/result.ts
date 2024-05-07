import { result } from "@/router/enums";

export default {
  path: "/result",
  redirect: "/result/success",

  meta: {
    icon: "checkboxCircleLine",
    title: "结果页面",
    showLink: false,
    rank: result
  },
  children: [
    {
      path: "/result/success",
      name: "Success",
      component: () => import("@/views/result/success.vue"),
      meta: {
        title: "成功页面"
      }
    },
    {
      path: "/result/fail",
      name: "Fail",
      component: () => import("@/views/result/fail.vue"),
      meta: {
        title: "失败页面"
      }
    }
  ]
} as RouteConfigsTable;
