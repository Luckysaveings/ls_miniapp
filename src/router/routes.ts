import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
import Home from "@/views/home/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Home" },
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
          title: "主页"
        }
      },
      {
        path: "tools",
        name: "Tools",
        component: () => import("@/views/tools/index.vue"),
        meta: {
          title: "工具"
        }
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: "关于",
          noCache: true
        }
      },

      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/settings/index.vue"),
        meta: {
          title: "个人主页",
          showTabbar: false
        }
      },
      {
        path: "deposit",
        name: "Deposit",
        component: () => import("@/views/deposit/index.vue"),
        meta: {
          title: "Deposit",
          showTabbar: false
        }
      },
      {
        path: "deposit-history",
        name: "DepositHistory",
        component: () => import("@/views/deposit-history/index.vue"),
        meta: {
          title: "Deposit History",
          showTabbar: false
        }
      }
    ]
  }
];

export default routes;
