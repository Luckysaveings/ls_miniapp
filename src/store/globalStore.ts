import { defineStore } from "pinia";
import type DappPortalSDK from "@linenext/dapp-portal-sdk";

export const useGlobalStore = defineStore("global", {
  // 状态（state）
  state: () => ({
    token: "0",
    dappPortalSDK: undefined as DappPortalSDK | undefined,
    walletProvider: undefined as any | undefined,
    supportEmail: "care@luckysavings.io",
    // 钱包类型
    walletType: "",
    address: "",
    mnemonic: "",
    privateKey: "",
    userInfo: {
      username: "",
      userId: "",
      nickname: "",
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
    prizePoolInfo: {
      USDT: {
        allAmount: 0,
        timeTolottory: 1,
        ticket: 0,
      },
      KAIA: {
        allAmount: 0,
        timeTolottory: 1,
        ticket: 0,
      },
    },
    usdtValue: 1,
    kaiaValue: 0.1192,
    availableRewards: {
      points: 0,
      badges: 0,
    },
  }),

  // 计算属性（getters）
  getters: {
    isLoggedIn: (state) => !!state.token, // 判断用户是否已登录
    hasWallet: (state) => !!state.walletAddress, // 判断是否有钱包地址
    totalPrizePool: (state) => state.prizePoolInfo.USDT.allAmount * state.usdtValue || 0 + state.prizePoolInfo.KAIA.allAmount * state.kaiaValue || 0, // 计算总奖池金额
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
    // 设置助记词
    setMnemonic(mnemonic: string) {
      this.mnemonic = mnemonic; // 保存助记词
    },
    // 设置钱包地址
    setAddress(address: string) {
      this.address = address; // 保存钱包地址
    },
    clearAddress() {
      this.address = ""; // 保存钱包地址
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
    setUSDTPrizePoolInfo(prizePoolInfo: any) {
      this.prizePoolInfo.USDT = Object.assign({}, this.prizePoolInfo.USDT, prizePoolInfo);
    },
    setKaiaPrizePoolInfo(prizePoolInfo: any) {
      this.prizePoolInfo.KAIA = Object.assign({}, this.prizePoolInfo.KAIA, prizePoolInfo);
    },
    setUsdtValue(value: number) {
      this.usdtValue = value;
    },
    setKaiaValue(value: number) {
      this.kaiaValue = value;
    },
    setWalletType(value: string) {
      this.walletType = value;
    },
    setAvailableRewards(availableRewards: any) {
      this.availableRewards = Object.assign({}, this.availableRewards, availableRewards);
    },
    // 登出（清除 token 和钱包地址）
    logout() {
      this.clearToken();
      this.clearWalletAddress();
    },
  },
});
