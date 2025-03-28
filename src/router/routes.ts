import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
import Home from "@/views/home/index.vue";
import { useCustomI18n } from "@/lang/i18n-utils";
const { i18nTFn } = useCustomI18n();

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: i18nTFn("router.Home") },
    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
        meta: {
          title: i18nTFn("router.Home"),
        },
      },
      {
        path: "withdraw",
        name: "Withdraw",
        component: () => import("@/views/withdraw/index.vue"),
        meta: {
          title: i18nTFn("router.Withdraw"),
          showTabbar: false,
        },
      },
      {
        path: "swap",
        name: i18nTFn("router.Swap"),
        component: () => import("@/views/swap/index.vue"),
        meta: {
          title: i18nTFn("router.Swap"),
          showTabbar: false,
        },
      },
      {
        path: "email",
        name: i18nTFn("common.Email"),
        component: () => import("@/views/email/index.vue"),
        meta: {
          title: i18nTFn("common.Email"),
          showTabbar: false,
          noCache: true,
        },
      },
      {
        path: "pool",
        name: "Pool",
        component: () => import("@/views/pool/index.vue"),
        meta: {
          title: i18nTFn("common.Pool"),
          showTabbar: true,
          noCache: true,
        },
      },
      {
        path: "rewards",
        name: "Rewards",
        component: () => import("@/views/rewards/index.vue"),
        meta: {
          title: i18nTFn("common.Rewards"),
          showTabbar: true,
          noCache: true,
        },
      },
      {
        path: "ranking",
        name: i18nTFn("common.Ranking"),
        component: () => import("@/views/ranking/index.vue"),
        meta: {
          title: i18nTFn("common.Ranking"),
          showTabbar: false,
          noCache: true,
        },
      },
      {
        path: "profile",
        name: i18nTFn("common.Profile"),
        component: () => import("@/views/profile/index.vue"),
        meta: {
          title: i18nTFn("common.Profile"),
          showTabbar: false,
        },
      },
      {
        path: "deposit",
        name: i18nTFn("common.Deposit"),
        component: () => import("@/views/deposit/index.vue"),
        meta: {
          title: i18nTFn("common.Deposit"),
          showTabbar: false,
        },
      },
      {
        path: "deposit-history",
        name: i18nTFn("common.DepositHistory2"),
        component: () => import("@/views/deposit-history/index.vue"),
        meta: {
          title: i18nTFn("common.DepositHistory"),
          showTabbar: false,
        },
      },
      {
        path: "error",
        name: i18nTFn("common.Error"),
        component: () => import("@/views/networkError/index.vue"),
        meta: {
          title: i18nTFn("common.NetworkError"),
          showTabbar: false,
        },
      },
    ],
  },
];

export default routes;
