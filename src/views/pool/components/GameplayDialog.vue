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
        class="gameplay-waring"
        v-html="gameplayContent.waring"
      />
      <div
        class="btn-main"
        @click="showGameplay = false"
      >
        Got It
      </div>
    </div>
  </van-overlay>
</template>
<script setup name="GameplayDialog">
const showGameplay = ref(false);
const gameplayContent = ref({});
const switchGameplayContent = (type) => {
  let content = {};
  if (type === "1") {
    content = {
      wrapClass: "daily-pool",
      title: "Daily Pool Gameplay",
      content: `
    <p>1. The USD and KAIA prize pools will be drawn every day at 20:00 (UTC+0).</p>  
    <p>2. You will never lose your principal and can withdraw at any time.</p>
    <p>3. Your yields will be rolled into the Daily Pool and the $10k Jackpot at a 50%:50% ratio.</p>
    <p>4. Based on smart contracts, the more you deposit, the more tickets you receive, and the higher your chances of winning.</p>
    <p>5. Your savings will automatically roll over into the next pool unless you withdraw.</p>`,
      waring: `
      Due to KAIA restrictions, withdrawing from KAIA pool might require a 7 days unlock due to Kaia Chain staking requirements.
      `,
    };
  } else {
    content = {
      wrapClass: "jackpot-pool",
      title: "10K Jackpot Gameplay",
      content: `
      <p>1. Once each Jackpot reaches $10k, it will be drawn! After the draw, it will move on to the next round of accumulation!</p>
      <p>2. You will never lose your principal and can withdraw at any time.</p>
      <p>3. Your yields will be rolled into the Daily Pool and the $10k Jackpot at a 50%:50% ratio.</p>
      <p>4. Based on smart contracts, the more you deposit, the more tickets you receive, and the higher your chances of winning.</p>
      <p>5. Your savings will automatically roll over into the next pool/jackpot unless you withdraw.</p>`,
      waring: "Due to KAIA restrictions, withdrawing from KAIA pool might require a 7 days unlock due to Kaia Chain staking requirements.",
    };
  }
  gameplayContent.value = content;
};
const showGameplayContent = (type) => {
  switchGameplayContent(type);
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
  .gameplay-waring {
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
  .jackpot-pool {
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
