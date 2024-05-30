/*
 * @Author: xdteam
 * @Date: 2024-05-27 22:11:19
 * @LastEditTime: 2024-05-30 21:30:41
 * @LastEditors: YourName
 * @Description:
 * @FilePath: \vue-pure-admin\mock\local.ts
 * 版权声明
 */
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/getPluginsList",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              name: "小墩通用签到",
              version: "1.0.1",
              author: "a木木",
              type: "日常",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.JA4-FcgT71zBprqSv3c4AQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "http://127.0.0.1:31400/static/upload/other/0cdbf3a82a1268ed41875a9fbcdf32a6.py",
              path: "string",
              score: 3.2,
              downloads: 986
            },
            {
              name: "QQ等级加速",
              version: "1.0.0",
              author: "a木木",
              type: "代挂",
              folder: "daily_sign",
              image:
                "https://ts4.cn.mm.bing.net/th?id=OIP-C.MDAUdOdVjjhG7Rxp_CZn6gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 745
            },
            {
              name: "阿里云扫码签到",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.GQilyxAvafi49DVzO2YU_AHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.7,
              downloads: 256
            },
            {
              name: "云主机签到服务",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.ZCgy63y7bskaPRgpBaLq5AHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.9,
              downloads: 2344,
              isSetup: false
            },
            {
              name: "在线听歌",
              version: "1.3.1",
              author: "a木木",
              type: "音乐",
              folder: "daily_sign",
              image:
                "https://tse1-mm.cn.bing.net/th/id/OIP-C.NGO9mArynAOzMtumaJW-aAHaHa?rs=1&pid=ImgDetMain",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.4,
              downloads: 751
            },
            {
              name: "哔哩哔哩解析",
              version: "3.3.1",
              author: "a木木",
              type: "二刺螈",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.gTiQSxohA3KRCuOR4GFBxwHaHa?w=183&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 1233
            },
            {
              name: "通用签到",
              version: "1.0.0",
              author: "a木木",
              type: "日常",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.JA4-FcgT71zBprqSv3c4AQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "http://127.0.0.1:31400/static/upload/other/0cdbf3a82a1268ed41875a9fbcdf32a6.py",
              path: "string",
              score: 3.2,
              downloads: 986
            },
            {
              name: "QQ等级加速",
              version: "1.0.0",
              author: "a木木",
              type: "代挂",
              folder: "daily_sign",
              image:
                "https://ts4.cn.mm.bing.net/th?id=OIP-C.MDAUdOdVjjhG7Rxp_CZn6gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 745
            },
            {
              name: "阿里云扫码签到",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.GQilyxAvafi49DVzO2YU_AHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.7,
              downloads: 256
            },
            {
              name: "云主机签到服务",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.ZCgy63y7bskaPRgpBaLq5AHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.9,
              downloads: 2344,
              isSetup: false
            },
            {
              name: "在线听歌",
              version: "1.3.1",
              author: "a木木",
              type: "音乐",
              folder: "daily_sign",
              image:
                "https://tse1-mm.cn.bing.net/th/id/OIP-C.NGO9mArynAOzMtumaJW-aAHaHa?rs=1&pid=ImgDetMain",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.4,
              downloads: 751
            },
            {
              name: "哔哩哔哩解析",
              version: "3.3.1",
              author: "a木木",
              type: "二刺螈",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.gTiQSxohA3KRCuOR4GFBxwHaHa?w=183&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 1233
            },
            {
              name: "通用签到",
              version: "1.0.0",
              author: "a木木",
              type: "日常",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.JA4-FcgT71zBprqSv3c4AQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "http://127.0.0.1:31400/static/upload/other/0cdbf3a82a1268ed41875a9fbcdf32a6.py",
              path: "string",
              score: 3.2,
              downloads: 986
            },
            {
              name: "QQ等级加速",
              version: "1.0.0",
              author: "a木木",
              type: "代挂",
              folder: "daily_sign",
              image:
                "https://ts4.cn.mm.bing.net/th?id=OIP-C.MDAUdOdVjjhG7Rxp_CZn6gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 745
            },
            {
              name: "阿里云扫码签到",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.GQilyxAvafi49DVzO2YU_AHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.7,
              downloads: 256
            },
            {
              name: "云主机签到服务",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.ZCgy63y7bskaPRgpBaLq5AHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.9,
              downloads: 2344,
              isSetup: false
            },
            {
              name: "在线听歌",
              version: "1.3.1",
              author: "a木木",
              type: "音乐",
              folder: "daily_sign",
              image:
                "https://tse1-mm.cn.bing.net/th/id/OIP-C.NGO9mArynAOzMtumaJW-aAHaHa?rs=1&pid=ImgDetMain",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.4,
              downloads: 751
            },
            {
              name: "通用签到",
              version: "1.0.0",
              author: "a木木",
              type: "日常",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.JA4-FcgT71zBprqSv3c4AQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "http://127.0.0.1:31400/static/upload/other/0cdbf3a82a1268ed41875a9fbcdf32a6.py",
              path: "string",
              score: 3.2,
              downloads: 986
            },
            {
              name: "QQ等级加速",
              version: "1.0.0",
              author: "a木木",
              type: "代挂",
              folder: "daily_sign",
              image:
                "https://ts4.cn.mm.bing.net/th?id=OIP-C.MDAUdOdVjjhG7Rxp_CZn6gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 745
            },
            {
              name: "云主机签到服务",
              version: "1.0.0",
              author: "a木木",
              type: "白嫖",
              folder: "daily_sign",
              image:
                "https://ts3.cn.mm.bing.net/th?id=OIP-C.ZCgy63y7bskaPRgpBaLq5AHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.9,
              downloads: 2344,
              isSetup: false
            },
            {
              name: "在线听歌",
              version: "1.3.1",
              author: "a木木",
              type: "音乐",
              folder: "daily_sign",
              image:
                "https://tse1-mm.cn.bing.net/th/id/OIP-C.NGO9mArynAOzMtumaJW-aAHaHa?rs=1&pid=ImgDetMain",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.4,
              downloads: 751
            },
            {
              name: "哔哩哔哩解析",
              version: "3.3.1",
              author: "a木木",
              type: "二刺螈",
              folder: "daily_sign",
              image:
                "https://tse4-mm.cn.bing.net/th/id/OIP-C.gTiQSxohA3KRCuOR4GFBxwHaHa?w=183&h=183&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              url: "https://q1.qlogo.cn/g?b=qq&nk=651380741&s=640",
              path: "string",
              score: 4.3,
              downloads: 1233
            }
          ]
        }
      };
    }
  }
] as MockMethod[];
