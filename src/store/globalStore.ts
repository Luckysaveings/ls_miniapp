import { defineStore } from "pinia";
import type DappPortalSDK from "@linenext/dapp-portal-sdk";

export const useGlobalStore = defineStore("global", {
  // 状态（state）
  state: () => ({
    token: "0",
    walletAddress: undefined as any | undefined,
    dappPortalSDK: undefined as DappPortalSDK | undefined,
    address: "",
    mnemonic: "",
    privateKey: "",
    userInfo: {
      username: "",
      nickname: "Arthorn111",
      avatar: "",
      email: "",
      phone: "",
    } as any | undefined,
    inviteCode: "",
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
    clearSdk() {
      this.dappPortalSDK = undefined;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = Object.assign({}, this.userInfo, userInfo);
    },
    clearUserInfo() {
      this.userInfo = {};
    },
    // 设置钱包地址
    setWalletAddress(address: string) {
      this.walletAddress = address;
    },

    // 清除钱包地址
    clearWalletAddress() {
      this.walletAddress = "";
    },
    // 设置助记词
    setMnemonic(mnemonic: string) {
      this.mnemonic = mnemonic; // 保存助记词
    },
    // 设置钱包地址
    setAddress(address: string) {
      this.address = address; // 保存钱包地址
    },
    // 设置私钥
    setPrivateKey(privateKey: string) {
      this.privateKey = privateKey; // 保存私钥
    },
    // 设置邀请码
    setInviteCode(inviteCode: string) {
      this.inviteCode = inviteCode;
    },

    // 登出（清除 token 和钱包地址）
    logout() {
      this.clearToken();
      this.clearWalletAddress();
    },
  },
});
