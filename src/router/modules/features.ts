export default {
  path: "/features",
  redirect: "/features/api/index",
  meta: {
    icon: "list",
    title: "自定义API",
    showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/features/api/backset",
      name: "Backset",
      component: () => import("@/views/personal/features/api/backSet.vue"),
      meta: {
        title: "API返回设置"
      }
    }
  ]
} as RouteConfigsTable;
