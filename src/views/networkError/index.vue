<template>
  <div class="page-wrap">
    <svg-icon
      className="title-icon"
      name="no-network"
      size="74px"
    />
    <p class="error-message">Oops, Network connection error.</p>
    <p class="error-message-tip">
      It seems the network is taking a break! Try restarting your Wi-Fi or switching to mobile data to get back on track.
    </p>
    <button
      class="btn-main"
      @click="retryConnection"
    >
      Reload
    </button>
  </div>
</template>

<script setup name="NetworkError">
import { useRouter } from "vue-router";

const router = useRouter();

const retryConnection = () => {
  // 返回上一级页面
  router.back();
};
</script>

<style scoped lang="scss">
.page-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 0 48px;

  .error-message {
    margin: 10px auto;
    line-height: 20px; /* 125% */
  }
  .error-message-tip {
    color: var(--LS-Gray-05, #83838f);
    font-size: 12px;
  }
  .btn-main {
    width: 120px;
    margin-top: 24px;
  }
}
</style>
