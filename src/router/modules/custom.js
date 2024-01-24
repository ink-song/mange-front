/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-20 00:01:59
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-23 12:14:00
 * @FilePath: /manger-front/src/router/modules/custom.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import Layout from "@/components/Layout.vue";
export default [
  {
    path: "/home",
    name: "home",
    component: Layout,
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import("@/views/Welcome.vue"),
        meta: {
          title: "欢迎",
        },
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/Users/index.vue"),
        meta: {
          title: "用户",
        },
        children: []
      },
      {
        path: "/user/create",
        name: "userCreate",
        component: () => import("@/views/Users/create.vue"),
        meta: {
          title: "用户添加",
        },
      },
      {
        path: "/user/edit",
        name: "userEdit",
        component: () => import("@/views/Users/edit.vue"),
        meta: {
          title: "用户编辑",
        },
      },
      
    ],
  },
];
