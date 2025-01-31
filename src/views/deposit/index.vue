<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Deposit"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="nav-bar-wrap"
      :border="false"
    >
      <template #right>
        <van-icon
          :name="iconHistory"
          size="24"
        />
      </template>
    </van-nav-bar>

    <div class="deposit-content">
      <img
        src="@/assets/qrcode.svg"
        alt="KAIA"
        class="img-qr"
      />
      <div class="deposit-title">Your KAIA Address</div>
      <div class="deposit-desc">Use this address to receive tokens on <span class="bold">KAIA</span>.</div>
    </div>

    <!--  Button -->
    <div class="btn-wrapper">
      <div
        class="btn-copy"
        @click="copyUserId"
      >
        <span>6xvni1...dyEfW7</span>
        <img
          src="@/assets/icon-copy.svg"
          alt="copy"
          class="img-copy"
        />
      </div>
      <div
        class="btn-share"
        @click="handleShare"
      >
        Share
      </div>
    </div>
  </div>

  <van-toast
    v-model:show="show"
    position="top"
    class-name="custom-toast-wrapper"
  >
    <template #message>
      <div class="toast-message">
        <van-icon
          :name="checkCircle"
          size="24"
          color="red"
        />
        <span class="toast-text">{{ toastText }}</span>
      </div>
    </template>
  </van-toast>
</template>

<script setup>
import { showToast } from 'vant';
import iconHistory from '@/assets/icon-history.svg';
import checkCircle from '@/assets/check-circle.svg';
import { useRouter } from 'vue-router';
const router = useRouter();

const onClickRight = () => {
  router.push('/deposit-history');
};
const onClickLeft = () => {
  router.back();
};
const show = ref(false);
const toastText = ref('Copy Success');
const copyEmail = () => {
  navigator.clipboard.writeText('care@luckysavings.io');
  toastText.value = 'Email copied to clipboard';
  show.value = true;
};

const copyUserId = () => {
  navigator.clipboard.writeText('88888888');
  toastText.value = 'Copy Success';
  show.value = true;
};

const handleLogout = () => {
  toastText.value = 'Logging out...';
  show.value = true;
  // Add your logout logic here
};
</script>

<style>
.custom-toast-wrapper {
  padding: 0;
  background-color: transparent;
}
</style>

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

.toast-message {
  padding: 10px 14px;
  border-radius: 48px;
  border: 1px solid rgba(24, 24, 27, 0.04);
  background: #06c756;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .toast-text {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}
</style>
