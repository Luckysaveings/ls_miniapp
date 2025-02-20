import { defineStore } from "pinia";
import type DappPortalSDK from "@linenext/dapp-portal-sdk";

export const useGlobalStore = defineStore("global", {
  // 状态（state）
  state: () => ({
    token: "0",
    walletAddress: undefined as any | undefined,
    dappPortalSDK: undefined as DappPortalSDK | undefined,
  }),

  // 计算属性（getters）
  getters: {
    isLoggedIn: (state) => !!state.token, // 判断用户是否已登录
    hasWallet: (state) => !!state.walletAddress, // 判断是否有钱包地址
  },

  // 方法（actions）
  actions: {
    setToken(newToken: string) {
      this.token = newToken;
    },
    clearToken() {
      this.token = "";
    },
    setSdk(sdk: DappPortalSDK) {
      this.dappPortalSDK = sdk;
    },
    // 设置钱包地址
    setWalletAddress(address: string) {
      this.walletAddress = address;
    },

    // 清除钱包地址
    clearWalletAddress() {
      this.walletAddress = "";
    },

    // 登出（清除 token 和钱包地址）
    logout() {
      this.clearToken();
      this.clearWalletAddress();
    },
  },
});
