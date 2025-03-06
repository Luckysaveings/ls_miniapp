<template>
  <router-view />
</template>
<script setup lang="ts" name="App">
import liff from "@line/liff";
import { getRanking, login } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";
import {
  createKaiaWallet,
  getDappWallet,
  getBalanceWithDapp,
  getTokenBalanceWithDapp,
  getBalance,
  getWalletBanlanceWithContract,
  getDpositAmount,
} from "@/utils/chainUtils";

// 初始化 Store
const globalStore = useGlobalStore();
onMounted(() => {
  onlineLogic();
  // devLogic();
});
const devLogic = () => {
  createKaiaWallet(); // 创建一个kaia测试链的钱包，提示词，钱包地址和私钥均存储在localStorage缓存中
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiY2ZlODBiZWMtYjliOC00MTRkLTgyYTMtNWVhOTk5OGI4MDc5IiwiSUQiOjYsIlVzZXJuYW1lIjoiVWFjNTMxZTQxNDhkZjZlMmU1YmFhNzUxNTZiM2U4YzhmIiwiTmlja05hbWUiOiJvZ2dyciIsIkF1dGhvcml0eUlkIjoxMDAsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTc0MTc5OTQ5MywibmJmIjoxNzQxMTk0NjkzfQ.fvLHzz5Ykp9kIBArokhEDkmdga0RzAwavdrjJTX-rzA";
  globalStore.setToken(token);
  console.log("globalStore", globalStore);
  globalStore.setAddress("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6");
  getBalance(globalStore.address); // 获取刚生成的钱包地址的kaia余额
  getWalletBanlanceWithContract(globalStore.address); // 获取钱包地址的token余额
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
            await globalStore.setToken(res.data.token);
            console.log("globalStore.token:", globalStore.token);
            await getDappWallet();
            getBalanceWithDapp(globalStore.address);
            getTokenBalanceWithDapp(globalStore.address, import.meta.env.VITE_TOKEN_ADDRESS);
            getDpositAmount(globalStore.address, "USDT");
            getDpositAmount(globalStore.address, "KAIA");
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
