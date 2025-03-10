<template>
  <div class="page-wrap">
    <van-nav-bar
      :title="$t('deposit.Deposit')"
      left-arrow
      class="nav-bar-wrap"
      :border="false"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right>
        <svg-icon
          name="icon-history"
          size="24"
        />
      </template>
    </van-nav-bar>

    <div class="deposit-content">
      <img
        :src="globalStore.addressEwm"
        alt="KAIA"
        class="img-qr"
      />
      <div class="deposit-title">{{ $t("deposit.YourKAIAAddress") }}</div>
      <div class="deposit-desc">{{ $t("deposit.addressTip") }} <span class="bold">KAIA</span>.</div>
    </div>

    <!--  Button -->
    <div class="btn-wrapper">
      <div
        class="btn-copy"
        @click="copyWalletAddress"
      >
        <span>{{ formatWalletAddress(globalStore.address) }}</span>
        <svg-icon
          name="icon-copy"
          class="img-copy"
        />
      </div>
      <div
        class="btn-share"
        @click="handleShare"
      >
        {{ $t("deposit.Share") }}
      </div>
    </div>
  </div>

  <CustomToast
    v-model:show="show"
    :message="toastText"
  />
</template>

<script setup name="Deposit">
import { useRouter } from "vue-router";
import CustomToast from "@/components/CustomToast.vue";
import { useGlobalStore } from "@/store/globalStore";

import {
  createKaiaWallet,
  getBalance,
  transferInKaia,
  getBalanceWithDapp,
  getTokenBalance,
  approveTokenForDeposit,
  depositWithDepositContract,
  getDepositAmount,
  formatWalletAddress,
  formatAmount,
  calculateTimeDifference,
} from "@/utils/index";
// 初始化 Store
const globalStore = useGlobalStore();

const router = useRouter();
const onClickRight = () => {
  router.push("/deposit-history");
};
const onClickLeft = () => {
  router.back();
};
const show = ref(false);
const toastText = ref("Copy Success");

const copyWalletAddress = () => {
  navigator.clipboard.writeText(globalStore.address);
  toastText.value = "Copy Success";
  show.value = true;
};
</script>

<style scoped lang="scss">
.page-wrap {
  padding: 0;
}
.deposit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  .img-qr {
    width: 240px;
    height: 240px;
    margin-bottom: 24px;
  }
  .deposit-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
  }
  .deposit-desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #83838f;

    .bold {
      color: #18181b;
      font-weight: 700;
    }
  }
}

.btn-wrapper {
  padding: 24px;
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;

  .btn-copy,
  .btn-share {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #fff;
    background: var(--LS-Gray-07, #18181b);
    height: 44px;
    line-height: 44px;

    .img-copy {
      margin-left: 6px;
    }
  }
  .btn-share {
    margin-top: 16px;
    color: #18181b;
    background: transparent;
    border: 2px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
  }
}
</style>
