<template>
  <router-view />
</template>
<script setup lang="ts" name="App">
import liff from "@line/liff";
import { getRanking, login, getKaiaPrice } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";
import { createKaiaWallet, getDappWallet, getTokenBalance, getKaiaBalance, getDpositAmount, getPoolAmount } from "@/utils/chainUtils";

// 初始化 Store
const globalStore = useGlobalStore();
onMounted(() => {
  console.log(import.meta.env);
  // getKaiaPrice().then((res) => {
  //   console.log(res);
  //   globalStore.setKaiaValue(res.data.kaiaPrice);
  // });
  onlineLogic();
  // devLogic();
});
const devLogic = () => {
  // createKaiaWallet(); // 创建一个kaia测试链的钱包，提示词，钱包地址和私钥均存储在localStorage缓存中
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiY2ZlODBiZWMtYjliOC00MTRkLTgyYTMtNWVhOTk5OGI4MDc5IiwiSUQiOjYsIlVzZXJuYW1lIjoiVWFjNTMxZTQxNDhkZjZlMmU1YmFhNzUxNTZiM2U4YzhmIiwiTmlja05hbWUiOiJvZ2dyciIsIkF1dGhvcml0eUlkIjoxMDAsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTc0MTk0MDg0OCwibmJmIjoxNzQxMzM2MDQ4fQ.aZshgtleU2EwRDXnnjd3wohZXg9jpvSpp-nwTMrn_6A";
  globalStore.setToken(token);
  // globalStore.setAddress("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6"); // line sdk 生成的钱包地址
  globalStore.setAddress("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9"); // 测试链钱包地址
  globalStore.setPrivateKey("0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e"); // 测试链钱包私钥
  // getDappWallet(); // 获取dapp钱包地址
  getKaiaBalance(globalStore.address); // 获取刚生成的钱包地址的kaia余额
  getTokenBalance(globalStore.address); // 获取刚生成的钱包地址的token余额
  getDpositAmount(globalStore.address, "USDT");
  getDpositAmount(globalStore.address, "KAIA");
  getPoolAmount("USDT");
  getPoolAmount("KAIA");
};
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
        login({
          idToken,
        })
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
            getKaiaBalance(globalStore.address);
            getTokenBalance(globalStore.address);
            getDpositAmount(globalStore.address, "USDT");
            getDpositAmount(globalStore.address, "KAIA");
            getPoolAmount("USDT");
            getPoolAmount("KAIA");
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
</script>
<style></style>
