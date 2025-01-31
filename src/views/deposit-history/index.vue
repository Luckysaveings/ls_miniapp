<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Deposit History"
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar-wrap"
      :border="false"
    >
    </van-nav-bar>

    <van-cell-group :border="false">
      <van-cell
        :border="false"
        title="Deposit Address"
        :value="depositAddress"
      />
      <van-cell
        :border="false"
        title="TXID"
        :value="txid"
      />
      <van-cell
        :border="false"
        title="Amount"
        :value="amount"
      />
      <van-cell
        :border="false"
        title="Time"
        :value="time"
      />
      <van-cell
        title="State"
        :border="false"
      >
        <template #value>
          <span class="state-transferred">Transferred</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="mt-4">
      <van-cell
        :border="false"
        title="Deposit Address"
        :value="depositAddress"
      />
      <van-cell
        :border="false"
        title="TXID"
        :value="txid"
      />
      <van-cell
        :border="false"
        title="Amount"
        :value="amount"
      />
      <van-cell
        :border="false"
        title="Time"
        :value="time"
      />
      <van-cell
        title="State"
        :border="false"
      >
        <template #value>
          <span class="state-waiting">Waiting</span>
        </template>
      </van-cell>
    </van-cell-group>
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
import userAvatar from '@/assets/user-avatar.svg';
import checkCircle from '@/assets/check-circle.svg';
import { useRouter } from 'vue-router';

const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const depositAddress = '0xb5a8116592b4b4630b93d61ace006482b76d1e28';
const txid = '0xb5a8116592b4b4630b93d61ace006482b76d1e28';
const time = '2025/01/10 02:00:50';
const amount = '+1000 KAIA';
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
  padding: 0px;
  background: #fff !important;
}
.transaction-details {
  padding: 16px;
}

.state-transferred {
  color: #00b578;
}

.state-waiting {
  color: #f5a623;
}

.mt-4 {
  margin-top: 16px;
}
.title-class {
  font-size: 16px;
  font-weight: 500;
  color: #18181b;
}

.value-class {
  color: #83838f;
}

.profile-page {
  min-height: 100vh;
  background-color: #fff;
  padding: 32px 16px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;

  .username {
    color: #18181b;
    font-size: 18px;
    margin-top: 12px;
    font-weight: 500;
  }
}

.info-group {
  margin-bottom: 12px;
}

.settings-group {
  margin-bottom: 32px;
}

:deep(.van-cell__value) {
  color: #8e8e93;
}

:deep(.van-cell-group),
:deep(.van-cell) {
  margin: 0;
  border-radius: 12px;
  background: transparent;
}

.copy-icon {
  margin-left: 8px;
  color: #8e8e93;
}

.logout-wrapper {
  padding: 16px 32px;
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
}

.logout-button {
  font-size: 16px;
  font-weight: 500;
  height: 44px;
  line-height: 44px;
  color: #f14d00;
  border-radius: 14px;
  border: 2px solid rgba(24, 24, 27, 0.12);
  background: transparent;
  text-align: center;
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
