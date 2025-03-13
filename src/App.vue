<template>
  <router-view />
</template>
<script setup lang="ts" name="App">
import liff from "@line/liff";
import { getTaskList, login, bindWallet, getKaiaPrice } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";
import { createKaiaWallet, getDappWallet, getTokenBalance, getKaiaBalance, getDepositAmount, getPoolAmount, showToastBeforeRequest } from "@/utils/index";
import { showToast, showFailToast, showLoadingToast, closeToast } from "vant";

// 初始化 Store
const globalStore = useGlobalStore();
onMounted(() => {
  showLoadingToast({
    overlayClass: "http-loading-toast",
    overlay: true,
    message: "",
    forbidClick: true,
    duration: 0,
  });
  if (import.meta.env.VITE_ENV === "PROD") {
    onlineLogic();
  } else {
    // createKaiaWallet(); // 创建一个kaia测试链的钱包，提示词，钱包地址和私钥均存储在localStorage缓存中
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiY2ZlODBiZWMtYjliOC00MTRkLTgyYTMtNWVhOTk5OGI4MDc5IiwiSUQiOjYsIlVzZXJuYW1lIjoiVWFjNTMxZTQxNDhkZjZlMmU1YmFhNzUxNTZiM2U4YzhmIiwiTmlja05hbWUiOiJvZ2dyciIsIkF1dGhvcml0eUlkIjoxMDAsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTc0MjIwNjYwMSwibmJmIjoxNzQxNjAxODAxfQ.PnwIAHLtZEW7EgElYnzf6MZGtxgrlaoOi4vsxcGoJSg";
    globalStore.setToken(token);
    globalStore.setUserInfo({
      username: "oggrr",
      userId: "6",
      nickname: "oggrr",
      avatar: "",
      email: "example@a.com",
      phone: "12345678901",
      promoteCode: "azxcvbs",
    });
    // globalStore.setAddress("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6"); // line sdk 生成的钱包地址
    globalStore.setAddress("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9"); // 测试链钱包地址
    globalStore.setPrivateKey("0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e"); // 测试链钱包私钥
    bindWallet({ wallet: "0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9" });
    getChainData();
  }
});
const onlineLogic = () => {
  liff
    .init({
      liffId: import.meta.env.VITE_LINE_LIFF_ID,
      withLoginOnExternalBrowser: true,
    })
    .then(async () => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const idToken = await liff.getIDToken();
        const params: any = {
          idToken,
        };
        if (localStorage.getItem("inviteCode")) {
          params.inviteCode = localStorage.getItem("inviteCode");
          localStorage.removeItem("inviteCode");
        }
        login(params)
          .then(async (res: any) => {
            globalStore.setToken(res.data.token);
            let userInfo = res.data.user;
            globalStore.setUserInfo({
              username: userInfo.userName,
              userId: userInfo.ID,
              nickname: userInfo.nickName,
              avatar: userInfo.headerImg,
              email: userInfo.email,
              phone: userInfo.phone,
              promoteCode: userInfo.promoteCode,
            });
            console.log("globalStore.token:", globalStore.token);
            await getDappWallet();
            showToastBeforeRequest();
            getChainData();
          })
          .catch((err) => {
            console.log("err-login", err);
            if (liff.isLoggedIn()) {
              liff.logout();
            }
            liff.login();
          });
      }
    });
};
const getChainData = () => {
  getKaiaPrice().then((res) => {
    globalStore.setKaiaValue(res.data.kaiaPrice);
  });
  Promise.all([
    getKaiaBalance(globalStore.address),
    getTokenBalance(globalStore.address),
    getDepositAmount(globalStore.address, "USDT"),
    getDepositAmount(globalStore.address, "KAIA"),
    getPoolAmount("USDT"),
    getPoolAmount("KAIA"),
    getTaskList()
  ]).then(results => {
    // 最后一个结果是getTaskList的返回值
    const res = results[6];
    const list = (res.data && res.data.list) || [];
    const unCompletedList = list.filter((item) => item.status !== 3);
    const pointList = unCompletedList.filter((item) => item.rewardType === 0);
    const badgeList = unCompletedList.filter((item) => item.rewardType === 1);
    const totalPoints = pointList.reduce((acc, cur) => acc + cur.rewardAmount, 0);
    const totalBadges = badgeList.reduce((acc, cur) => acc + cur.rewardAmount, 0);
    globalStore.setAvailableRewards({
      points: totalPoints,
      badges: totalBadges,
    });
    closeToast();
  }).catch(error => {
    console.error("获取链上数据失败:", error);
    closeToast();
    showFailToast("获取数据失败，请稍后重试");
  });
};
</script>
<style></style>
