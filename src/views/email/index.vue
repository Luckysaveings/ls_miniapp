<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Email"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="nav-bar-wrap"
      :border="false"
    >
      <template #right>
        <span
          class="save-btn"
          :class="{ 'can-save': email.length > 0 }"
        >
          Save
        </span>
      </template>
    </van-nav-bar>

    <div class="deposit-content">
      <van-field
        v-model="email"
        label="Email"
        placeholder="Please enter e-mail address"
        label-align="top"
        class="email-field"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const onClickRight = () => {
  // 保存邮箱后返回
  console.log('保存邮箱后返回');
  router.back();
};
const onClickLeft = () => {
  router.back();
};

const email = ref('');
</script>

<style scoped lang="scss">
.page-wrap {
  padding: 0;
  background: #fff;
}
.save-btn {
  color: var(--LS-Gray-04, #a1a1aa);
  font-size: 16px;
  font-weight: 500;
  &.can-save {
    color: var(--LS-Secondary-Blue-01, #2d87fa);
  }
}
.deposit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;

  .email-field {
    width: 100%;
    :deep(.van-field__value) {
      padding: 10px 16px;
      border-radius: 12px;
      border: 1px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
      background: var(--LS-Gray-01, #fff);
    }
  }
}
</style>
