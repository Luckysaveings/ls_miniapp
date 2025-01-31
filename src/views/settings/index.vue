<template>
  <div class="page-wrap">
    <!-- Avatar and Name Section -->
    <div class="avatar-section">
      <van-image
        round
        width="100"
        height="100"
        :src="userAvatar"
      />
      <h2 class="username">Arthorn</h2>
    </div>

    <!-- Profile Information List -->
    <van-cell-group class="info-group">
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Account Level"
        value="Lv.0"
      />
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Nickname"
        value="Arthorn"
        is-link
      />
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="User ID"
        value="88888888"
        @click="copyUserId"
      >
        <template #right-icon>
          <van-icon
            name="aim"
            class="copy-icon"
          />
        </template>
      </van-cell>
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Email"
        value="arthorn@gmail.com"
        is-link
      />
    </van-cell-group>

    <van-cell-group class="settings-group">
      <van-cell
        :border="false"
        title="Terms of Use"
        is-link
      />
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Privacy Policy"
        is-link
      />
    </van-cell-group>

    <van-cell-group>
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Support"
        value="care@luckysavings.io"
        @click="copyEmail"
      >
        <template #right-icon>
          <van-icon
            name="copy"
            class="copy-icon"
          />
        </template>
      </van-cell>
      <van-cell
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Version"
        :value="version"
        @click="showVersion = true"
        is-link
      />
    </van-cell-group>
    <!-- Logout Button -->
    <div class="logout-wrapper">
      <div
        class="logout-button"
        @click="handleLogout"
      >
        Log Out
      </div>
    </div>
  </div>

  <van-overlay
    :show="showVersion"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <span>Version</span>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="hiddenVersion"
        />
      </div>

      <div class="dialog-content">
        <img
          src="@/assets/img-icon.svg"
          alt="version"
          class="version-icon"
        />
        <img
          src="@/assets/img-appname.svg"
          alt="appname"
          class="app-name"
        />
        <div class="version-text">
          <span>Version: {{ version }}</span>
        </div>
      </div>
    </div>
  </van-overlay>
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

const showVersion = ref(false);
const version = ref('1.0.12');
const hiddenVersion = () => {
  showVersion.value = false;
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
  min-height: 100vh;
  background: linear-gradient(180deg, #fff9e1 0%, #fff 100%);
  padding: 32px 24px;
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

.content-box {
  .version-icon {
    width: 72px;
    height: 76px;
  }
  .app-name {
    width: 204.123px;
    height: 32px;
    margin: 16px 0;
  }
  .version-text {
    font-size: 18px;
    color: var(--LS-Gray-05, #83838f);
    font-weight: 500;
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
