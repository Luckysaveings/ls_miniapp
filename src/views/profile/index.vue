<template>
  <div class="page-wrap">
    <!-- Avatar and Name Section -->
    <div class="avatar-section">
      <img
        :src="globalStore.userInfo.avatar || avatar"
        class="avatar-img"
      />
      <h2 class="username">{{ globalStore.userInfo.nickname }}</h2>
    </div>

    <!-- Profile Information List -->
    <van-cell-group class="info-group">
      <!-- <van-cell
        class="cell-class-custom"
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Account Level"
        value="Lv.0"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="icon-jiangbei"
            />
            <span>Account Level</span>
          </div>
        </template>
      </van-cell> -->
      <van-cell
        :border="false"
        class="cell-class-custom"
        title-class="title-class"
        value-class="value-class"
        title="Nickname"
        :value="globalStore.userInfo.nickname"
        is-link
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-nickname"
            />
            <span>Nickname</span>
          </div>
        </template>
      </van-cell>
      <!-- <van-cell
        class="cell-class-custom"
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="User ID"
        :value="globalStore.userInfo.userId"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-userId"
            />
            <span>User ID</span>
          </div>
        </template>
        <template #right-icon>
          <svg-icon
            className="img-icon icon-copy"
            name="icon-copy"
            @click="copyUserId"
          />
        </template>
      </van-cell> -->
      <van-cell
        class="cell-class-custom"
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="User ID"
        :value="formatWalletAddress(globalStore.address)"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-userId"
            />
            <span>{{ $t("common.WalletAddress") }}</span>
          </div>
        </template>
        <template #right-icon>
          <svg-icon
            className="img-icon icon-copy"
            name="icon-copy"
            @click="copyUserId"
          />
        </template>
      </van-cell>
      <van-cell
        class="cell-class-custom"
        :border="false"
        title-class="title-class"
        value-class="value-class"
        title="Email"
        :value="globalStore.userInfo.email"
        is-link
        @click="router.push('/email')"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-email"
            />
            <span>Email</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="settings-group">
      <van-cell
        class="cell-class-custom"
        :border="false"
        title="Terms of Use"
        is-link
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-terms"
            />
            <span>Terms of Use</span>
          </div>
        </template>
      </van-cell>

      <van-cell
        :border="false"
        class="cell-class-custom"
        title-class="title-class"
        value-class="value-class"
        title="Privacy Policy"
        is-link
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-terms"
            />
            <span>Privacy Policy</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-cell
        :border="false"
        class="cell-class-custom"
        title-class="title-class"
        value-class="value-class"
        value="care@luckysavings.io"
        @click="copyEmail"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              className="title-icon"
              name="profile-info"
            />
            <span>Support</span>
          </div>
        </template>
        <template #right-icon>
          <svg-icon
            className="img-icon icon-copy"
            name="icon-copy"
          />
        </template>
      </van-cell>
      <van-cell
        :border="false"
        class="cell-class-custom"
        title-class="title-class"
        value-class="value-class"
        :value="version"
        is-link
        @click="showVersion = true"
      >
        <template #title>
          <div class="cell-title-wrap">
            <svg-icon
              name="profile-info"
              class="title-icon"
            />
            <span>Version</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>

  <van-overlay
    :show="showVersion"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <span>Version</span>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="hiddenVersion"
        />
      </div>

      <div class="dialog-content">
        <svg-icon
          name="img-icon"
          class="version-icon"
        />

        <svg-icon
          name="img-appname"
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
        <svg-icon
          name="check-circle"
          size="24px"
        />
        <span class="toast-text">{{ toastText }}</span>
      </div>
    </template>
  </van-toast>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/store/globalStore";
import { formatWalletAddress } from "@/utils/chainUtils";
import avatar from "@/assets/catAvatar.svg";

// 初始化 Store
const globalStore = useGlobalStore();
const router = useRouter();
const showVersion = ref(false);
const version = ref("1.0.12");
const hiddenVersion = () => {
  showVersion.value = false;
};
const show = ref(false);
const toastText = ref("Copy Success");
const copyEmail = () => {
  navigator.clipboard.writeText("care@luckysavings.io");
  toastText.value = "Email copied to clipboard";
  show.value = true;
};

const copyUserId = () => {
  navigator.clipboard.writeText("88888888");
  toastText.value = "Copy Success";
  show.value = true;
};

const handleLogout = () => {
  toastText.value = "Logging out...";
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

  .settings-group {
    margin: 24px 0;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
}
.cell-class-custom {
  padding: 0;
  margin: 16px 0 !important;
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
.icon-copy {
  width: 18px;
  height: 18px;
  margin-left: 6px;
  margin-top: 3px;
}
.info-group {
  margin-bottom: 12px;
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
.cell-title-wrap {
  display: flex;
  align-items: center;

  .title-icon {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
}
</style>
