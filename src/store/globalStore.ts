import { defineStore } from "pinia";
import type DappPortalSDK from "@linenext/dapp-portal-sdk";

export const useGlobalStore = defineStore("global", {
  // 状态（state）
  state: () => ({
    token: "0",
    signatureWallet: undefined as any | undefined,
    dappPortalSDK: undefined as DappPortalSDK | undefined,
    walletProvider: undefined as any | undefined,
    address: "",
    mnemonic: "",
    privateKey: "",
    userInfo: {
      username: "",
      userId: "",
      nickname: "Arthorn",
      avatar: "",
      email: "",
      phone: "",
      promoteCode: "",
    } as any | undefined,
    inviteCode: "",
    balanceInfo: {
      USDT: {
        allAmount: 0,
        balance: 0,
        savings: 0,
        drawRewards: 0,
      },
      KAIA: {
        allAmount: 0,
        balance: 0,
        savings: 0,
        drawRewards: 0,
      },
    },
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
    setProvider(walletProvider) {
      this.walletProvider = walletProvider;
    },
    clearProvider() {
      this.walletProvider = undefined;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = Object.assign({}, this.userInfo, userInfo);
    },
    clearUserInfo() {
      this.userInfo = {};
    },
    // 设置确权钱包
    setSignatureWallet(signatureWallet: string) {
      this.signatureWallet = signatureWallet;
    },

    // 清除确权钱包
    clearSignatureWallet() {
      this.signatureWallet = undefined;
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
    setUsdtBalance(balanceInfo: any) {
      this.balanceInfo.USDT = Object.assign({}, this.balanceInfo.USDT, balanceInfo);
    },
    setKaiaBalance(balanceInfo: any) {
      this.balanceInfo.KAIA = Object.assign({}, this.balanceInfo.KAIA, balanceInfo);
    },
    // 登出（清除 token 和钱包地址）
    logout() {
      this.clearToken();
      this.clearWalletAddress();
    },
  },
});
