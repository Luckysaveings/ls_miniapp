<template>
  <router-view />
</template>
<script setup lang="ts" name="App">
import liff from "@line/liff";
import { getRanking, login } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";

// 初始化 Store
const globalStore = useGlobalStore();
onMounted(() => {
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
        console.log("idToken:", idToken);
        login({
          idToken,
        }).then(async (res: any) => {
          console.log("res-login", res);
          await globalStore.setToken(res.data.token);
          console.log("globalStore.token", globalStore.token);
          console.log("res.data.token", res.data.token);
        });
      }
    });
});
</script>
<style></style>
