<template>
  <router-view />
</template>
<script setup lang="ts" name="App">
import liff from "@line/liff";
import { getRanking, login, getKaiaPrice } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";
import { createKaiaWallet, getDappWallet, getTokenBalance, getKaiaBalance, getDepositAmount, getPoolAmount } from "@/utils/index";
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
  // getKaiaPrice().then((res) => {
  //   console.log(res);
  //   globalStore.setKaiaValue(res.data.kaiaPrice);
  // });
  if (import.meta.env.VITE_ENV === "PROD") {
    onlineLogic();
  } else {
    // createKaiaWallet(); // 创建一个kaia测试链的钱包，提示词，钱包地址和私钥均存储在localStorage缓存中
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiY2ZlODBiZWMtYjliOC00MTRkLTgyYTMtNWVhOTk5OGI4MDc5IiwiSUQiOjYsIlVzZXJuYW1lIjoiVWFjNTMxZTQxNDhkZjZlMmU1YmFhNzUxNTZiM2U4YzhmIiwiTmlja05hbWUiOiJvZ2dyciIsIkF1dGhvcml0eUlkIjoxMDAsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTc0MjA5MjI1MywibmJmIjoxNzQxNDg3NDUzfQ._GNAe11qgJSPYnXHo7SeFqC7AQ1Hr-euvle-pAbK2hI";
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
  getKaiaBalance(globalStore.address);
  getTokenBalance(globalStore.address);
  getDepositAmount(globalStore.address, "USDT");
  getDepositAmount(globalStore.address, "KAIA");
  getPoolAmount("USDT");
  getPoolAmount("KAIA");
};
</script>
<style></style>
