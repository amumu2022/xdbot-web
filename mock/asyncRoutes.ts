// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemRouter = [
  {
    id: 56,
    name: null,
    path: "/account",
    parent_id: null,
    meta: {
      title: "账号设置",
      icon: "fa:adn",
      rank: 3,
      auths: ["account_set", "weqwe", "account_authorize"]
    },
    children: [
      {
        id: 57,
        parent_id: 56,
        meta: {
          title: "机器管理",
          icon: "ep:briefcase",
          showParent: true,
          auths: []
        },
        name: "AccountSet",
        path: "/account/group/index",
        sort: 1
      },
      {
        id: 63,
        parent_id: 56,
        meta: {
          title: "分群设置",
          icon: "fa-solid:baby",
          showParent: true,
          auths: []
        },
        name: "TEST",
        path: "/account/test/index",
        sort: 2
      },
      {
        id: 98,
        parent_id: 56,
        meta: {
          title: "群组授权",
          icon: "ep:histogram",
          showParent: true,
          auths: []
        },
        name: "AccountAuthorize",
        path: "/account/authorize/index",
        sort: 3
      }
    ]
  },
  {
    id: 1,
    name: null,
    path: "/system",
    parent_id: null,
    meta: {
      title: "系统设置",
      icon: "ep:circle-plus-filled",
      rank: 4,
      auths: ["system_user", "system_menu", "system_role"]
    },
    children: [
      {
        id: 3,
        parent_id: 1,
        meta: {
          title: "用户管理",
          icon: "ep:avatar",
          showParent: true,
          auths: [null, null, null]
        },
        name: "User",
        path: "/system/user/index",
        sort: 1
      },
      {
        id: 4,
        parent_id: 1,
        meta: {
          title: "菜单管理",
          icon: "fa-solid:align-center",
          showParent: true,
          auths: [
            "system_menu_add",
            "system_menu_edit",
            "system_menu_del",
            "system_menu_status"
          ]
        },
        name: "SystemMenu",
        path: "/system/menu/index",
        sort: 2
      },
      {
        id: 9,
        parent_id: 1,
        meta: {
          title: "角色管理",
          icon: "fa-solid:angry",
          showParent: true,
          auths: [null, null, null, null]
        },
        name: "Role",
        path: "/system/role/index",
        sort: 3
      }
    ]
  },
  {
    id: 58,
    name: null,
    path: "/personal/keyword",
    parent_id: null,
    meta: {
      title: "关键词组",
      icon: "fa-solid:award",
      rank: 4,
      auths: ["keyword_quanju", "keyword_fenqun", "keyword_zhuanfa"]
    },
    children: [
      {
        id: 59,
        parent_id: 58,
        meta: {
          title: "全局问答",
          icon: "fa-solid:atlas",
          showParent: true,
          auths: []
        },
        name: "KeywordQJ",
        path: "/personal/keyword/quanju/index",
        sort: 1
      },
      {
        id: 60,
        parent_id: 58,
        meta: {
          title: "分群问答",
          icon: "fa-solid:book-open",
          showParent: true,
          auths: []
        },
        name: "KeywordFQ",
        path: "/personal/keyword/fenqun/index",
        sort: 2
      },
      {
        id: 61,
        parent_id: 58,
        meta: {
          title: "转发列表",
          icon: "fa-solid:baby",
          showParent: true,
          auths: []
        },
        name: "KeywordZF",
        path: "/personal/keyword/zhuanfa/index",
        sort: 3
      }
    ]
  },
  {
    id: 133,
    name: null,
    path: "/monitor",
    parent_id: null,
    meta: {
      title: "系统监控",
      icon: "ep:help-filled",
      rank: 4,
      auths: [
        "system_monitor",
        "api_monitor",
        "access_monitor",
        "login_monitor"
      ]
    },
    children: [
      {
        id: 134,
        parent_id: 133,
        meta: {
          title: "服务监控",
          icon: "fa:eercast",
          showParent: true,
          auths: []
        },
        name: "ServersMonitor",
        path: "/monitor/servers/index",
        sort: 1
      },
      {
        id: 135,
        parent_id: 133,
        meta: {
          title: "接口监控",
          icon: "fa:xing-square",
          showParent: true,
          auths: []
        },
        name: "ApiMonitor",
        path: "/monitor/api/index",
        sort: 2
      },
      {
        id: 136,
        parent_id: 133,
        meta: {
          title: "操作日志",
          icon: "fa-solid:hotel",
          showParent: true,
          auths: []
        },
        name: "AccessMonitor",
        path: "/monitor/action/index",
        sort: 3
      },
      {
        id: 137,
        parent_id: 133,
        meta: {
          title: "登录日志",
          icon: "ep:grid",
          showParent: true,
          auths: []
        },
        name: "LoginMonitor",
        path: "/monitor/Login/index",
        sort: 4
      }
    ]
  },
  {
    id: 17,
    name: null,
    path: "/upload",
    parent_id: null,
    meta: {
      title: "上传文件",
      icon: "ep:coin",
      rank: 5,
      auths: ["file_photo", "file_audio", "file_other"]
    },
    children: [
      {
        id: 18,
        parent_id: 17,
        meta: {
          title: "图片上传",
          icon: "fa:adjust",
          showParent: true,
          auths: ["file_photo_add", "file_photo_del"]
        },
        name: "UploadPic",
        path: "/upload/picture/index",
        sort: 1
      },
      {
        id: 65,
        parent_id: 17,
        meta: {
          title: "音频上传",
          icon: "fa:android",
          showParent: true,
          auths: []
        },
        name: "UploadAudio",
        path: "/upload/audio/index",
        sort: 2
      },
      {
        id: 102,
        parent_id: 17,
        meta: {
          title: "其他文件",
          icon: "fa:bandcamp",
          showParent: true,
          auths: []
        },
        name: "UploadOther",
        path: "/upload/other/index",
        sort: 3
      }
    ]
  },
  {
    id: 93,
    name: null,
    path: "/features",
    parent_id: null,
    meta: {
      title: "个人工具",
      icon: "fa:archive",
      rank: 6,
      auths: [
        "features_music",
        "features_api",
        "features_script",
        "features_ai",
        "features_chat"
      ]
    },
    children: [
      {
        id: 94,
        parent_id: 93,
        meta: {
          title: "音乐播放器",
          icon: "fa-solid:blender",
          showParent: true,
          auths: []
        },
        name: "FeaturesMusic",
        path: "/features/music/index",
        sort: 1
      },
      {
        id: 96,
        parent_id: 93,
        meta: {
          title: "自定义API",
          icon: "fa-solid:drafting-compass",
          showParent: true,
          auths: []
        },
        name: "FeaturesApi",
        path: "/features/api/index",
        sort: 2
      },
      {
        id: 114,
        parent_id: 93,
        meta: {
          title: "脚本管理",
          icon: "fa-solid:yin-yang",
          showParent: true,
          auths: []
        },
        name: "FeaturesScript",
        path: "/features/script/index",
        sort: 3
      },
      {
        id: 99,
        parent_id: 93,
        meta: {
          title: "ChatGPT",
          icon: "fa-solid:wifi",
          showParent: true,
          auths: []
        },
        name: "FeaturesAi",
        path: "/features/ai/index",
        sort: 4
      },
      {
        id: 97,
        parent_id: 93,
        meta: {
          title: "聊天沙盒",
          icon: "fa-solid:map",
          showParent: true,
          auths: []
        },
        name: "FeaturesChat",
        path: "/features/chat/index",
        sort: 5
      }
    ]
  },
  {
    id: 104,
    name: null,
    path: "/faka",
    parent_id: null,
    meta: {
      title: "发卡系统",
      icon: "fa-solid:fingerprint",
      rank: 7,
      auths: [
        "faka_panel",
        "faka_category",
        "faka_product",
        "faka_agent",
        "faka_orders",
        "faka_reply"
      ]
    },
    children: [
      {
        id: 105,
        parent_id: 104,
        meta: {
          title: "仪表盘",
          icon: "fa:eject",
          showParent: true,
          auths: []
        },
        name: "FakaPanel",
        path: "/faka/panel/index",
        sort: 1
      },
      {
        id: 107,
        parent_id: 104,
        meta: {
          title: "商品分类",
          icon: "fa-solid:hard-hat",
          showParent: true,
          auths: []
        },
        name: "FakaCategory",
        path: "/faka/category/index",
        sort: 2
      },
      {
        id: 108,
        parent_id: 104,
        meta: {
          title: "商品列表",
          icon: "fa:inbox",
          showParent: true,
          auths: []
        },
        name: "FakaProduct",
        path: "/faka/product/index",
        sort: 3
      },
      {
        id: 111,
        parent_id: 104,
        meta: {
          title: "用户管理",
          icon: "ep:eleme-filled",
          showParent: true,
          auths: []
        },
        name: "FakaAgent",
        path: "/faka/agent/index",
        sort: 4
      },
      {
        id: 110,
        parent_id: 104,
        meta: {
          title: "订单列表",
          icon: "fa:bitbucket",
          showParent: true,
          auths: []
        },
        name: "FakaOrders",
        path: "/faka/orders/index",
        sort: 5
      },
      {
        id: 112,
        parent_id: 104,
        meta: {
          title: "回复管理",
          icon: "fa:product-hunt",
          showParent: true,
          auths: []
        },
        name: "FakaReply",
        path: "/faka/reply/index",
        sort: 6
      }
    ]
  },
  {
    id: 84,
    name: null,
    path: "/tools",
    parent_id: null,
    meta: {
      title: "开发工具",
      icon: "fa:facebook-square",
      rank: 10,
      auths: ["develop_rex", "develop_json", "develop_bing", "develop_markdown"]
    },
    children: [
      {
        id: 87,
        parent_id: 84,
        meta: {
          title: "正则工具",
          icon: "fa:asterisk",
          showParent: true,
          auths: [],
          frameSrc: "https://codegen.bqrdh.com/regexper/"
        },
        name: "Framezhengzegongju",
        path: "/frame/zhengzegongju"
      },
      {
        id: 86,
        parent_id: 84,
        meta: {
          title: "JSON工具",
          icon: "ep:trend-charts",
          showParent: true,
          auths: [],
          frameSrc: "https://www.bejson.com/"
        },
        name: "FrameJSONgongju",
        path: "/frame/JSONgongju"
      },
      {
        id: 85,
        parent_id: 84,
        meta: {
          title: "必应搜索",
          icon: "ep:orange",
          showParent: true,
          auths: [],
          frameSrc: "http://www.bing.com"
        },
        name: "Framebiyingsousuo",
        path: "/frame/biyingsousuo"
      },
      {
        id: 103,
        parent_id: 84,
        meta: {
          title: "markdown编辑",
          icon: "fa:stop-circle-o",
          showParent: true,
          auths: [],
          frameSrc: "http://xiaoniutxt.com/markdownEditor.html"
        },
        name: "Framemarkdownbianji",
        path: "/frame/markdownbianji"
      }
    ]
  }
];

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [systemRouter]
      };
    }
  }
] as MockMethod[];
