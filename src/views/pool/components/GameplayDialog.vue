<template>
  <van-overlay
    :show="showGameplay"
    class-name="gameplay-dialog"
  >
    <div
      class="content-box"
      :class="gameplayContent.wrapClass"
    >
      <div class="gameplay-title">
        <span>{{ gameplayContent.title }}</span>
      </div>
      <div
        class="gameplay-content"
        v-html="gameplayContent.content"
      />
      <div
        class="gameplay-warning"
        v-html="gameplayContent.warning"
      />
      <div
        class="btn-main"
        @click="showGameplay = false"
      >
        {{ $t("common.GotIt") }}
      </div>
    </div>
  </van-overlay>
</template>
<script setup name="GameplayDialog">
import { useCustomI18n } from "@/lang/i18n-utils";
const { i18nTFn } = useCustomI18n();
const showGameplay = ref(false);
const gameplayContent = ref({});
const switchGameplayContent = (type, category) => {
  // 1: Daily Pool
  // 2: 10K Jackpot
  let content = {};
  if (category === "1") {
    content = {
      title: i18nTFn("GameplayDialog.title1"),
      content: i18nTFn("GameplayDialog.content1"),
      warning: i18nTFn("GameplayDialog.warning1"),
    };
  } else {
    content = {
      title: i18nTFn("GameplayDialog.title2"),
      content: i18nTFn("GameplayDialog.content2"),
      warning: i18nTFn("GameplayDialog.warning2"),
    };
  }
  const res = {
    wrapClass: type === "1" ? "daily-pool" : "usd-pool",
    ...content,
  };
  gameplayContent.value = res;
};
const showGameplayContent = (type, category) => {
  switchGameplayContent(type, category);
  nextTick(() => {
    showGameplay.value = true;
  });
};

defineExpose({ showGameplayContent });
</script>
<style scoped lang="scss">
.gameplay-dialog {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  .gameplay-title {
    color: var(--LS-Primary-02, #ddb305);
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 8px;
    text-align: center;
  }
  .gameplay-content {
    padding: 0 6px;
    color: var(--LS-Gray-05, #83838f);
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .gameplay-warning {
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--LS-Secondary-Red-red, #f14d00);
    background: #fff1f1;
    margin-bottom: 16px;
    line-height: 24px; /* 171.429% */
    color: var(--LS-Secondary-Red-red, #f14d00);
  }
  .btn-main {
    margin-top: 16px;
  }
  .usd-pool {
    background: linear-gradient(180deg, #e7fff1 0%, #fff 100%);

    .gameplay-title {
      color: var(--LS-Secondary-Green-02, #00ba4d);
    }
    .gameplay-content {
      color: var(--LS-Gray-05, #83838f);
    }
  }
}
</style>
