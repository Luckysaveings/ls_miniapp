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
          title: "Home"
        }
      },
      {
        path: "withdraw",
        name: "Withdraw",
        component: () => import("@/views/withdraw/index.vue"),
        meta: {
          title: "Withdraw",
          showTabbar: false
        }
      },
      {
        path: "swap",
        name: "Swap",
        component: () => import("@/views/swap/index.vue"),
        meta: {
          title: "Swap",
          showTabbar: false
        }
      },
      {
        path: "email",
        name: "Email",
        component: () => import("@/views/email/index.vue"),
        meta: {
          title: "Email",
          showTabbar: false,
          noCache: true
        }
      },
      {
        path: "pool",
        name: "Pool",
        component: () => import("@/views/pool/index.vue"),
        meta: {
          title: "Pool",
          showTabbar: true,
          noCache: true
        }
      },
      {
        path: "rewards",
        name: "Rewards",
        component: () => import("@/views/rewards/index.vue"),
        meta: {
          title: "Rewards",
          showTabbar: true,
          noCache: true
        }
      },
      {
        path: "ranking",
        name: "Ranking",
        component: () => import("@/views/ranking/index.vue"),
        meta: {
          title: "Ranking",
          showTabbar: false,
          noCache: true
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: {
          title: "Profile",
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
