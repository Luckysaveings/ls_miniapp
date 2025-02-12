<template>
  <div class="page-wrap">
    <van-nav-bar
      :title="$t('swap.Swap')"
      left-arrow
      class="nav-bar-wrap"
      :border="false"
      @click-left="onClickLeft"
    />

    <div class="page-content">
      <div class="content-box">
        <div class="box-top">
          <div class="box-left">{{ $t("swap.From") }}</div>
          <div class="box-right">
            <span>{{ $t("swap.Balance") }}</span>
            <span class="num">{{ maxData.usdt }}</span>
            <span
              class="max"
              @click="handleMax('usdt')"
              >{{ $t("swap.Max") }}</span
            >
          </div>
        </div>
        <div class="box-bottom">
          <div class="box-left">
            <img
              src="@/assets/icon-ustd.svg"
              alt="usdt"
              class="box-img"
            />
            <span>USDT</span>
          </div>
          <div class="box-right">
            <van-field
              v-model="usdtAmount"
              type="number"
              :placeholder="$t('swap.PlaceholderAmount')"
              class="custom-field amount-field"
            />
          </div>
        </div>
      </div>
      <img
        src="@/assets/icon-swap.svg"
        alt="swap"
        class="swap-img"
      />
      <div class="content-box no-margin-top">
        <div class="box-top">
          <div class="box-left">{{ $t("swap.ToEstimate") }}</div>
          <div class="box-right">
            <span>{{ $t("swap.Balance") }}</span>
            <span class="num">{{ maxData.kaia }}</span>
            <span
              class="max"
              @click="handleMax('kaia')"
              >{{ $t("swap.Max") }}</span
            >
          </div>
        </div>
        <div class="box-bottom">
          <div class="box-left">
            <img
              src="@/assets/icon-kaia.svg"
              alt="kaia"
              class="box-img"
            />
            <span>KAIA</span>
          </div>
          <div class="box-right">
            <van-field
              v-model="kaiaAmount"
              type="number"
              :placeholder="$t('swap.PlaceholderAmount')"
              class="custom-field amount-field"
            />
          </div>
        </div>
      </div>
      <div class="swap-tip">{{ $t("swap.Slippage") }}</div>

      <div
        v-if="overMax"
        class="btn-main over-max"
      >
        {{ $t("swap.InsufficientBalance") }}
      </div>
      <div
        v-else
        class="btn-main"
        :class="{ disabled: !isValidNext }"
        @click="handleSwap"
      >
        {{ $t("swap.Swap") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { reactive } from "vue";
const router = useRouter();

const usdtAmount = ref(null);
const kaiaAmount = ref(null);
const maxData = reactive({
  usdt: 8399.99,
  kaia: 1612.34,
});
const onClickLeft = () => {
  router.back();
};
const handleMax = (type) => {
  if (type === "usdt") {
    usdtAmount.value = maxData.usdt;
  } else {
    kaiaAmount.value = maxData.kaia;
  }
};
const isValidNext = computed(() => {
  return usdtAmount.value && kaiaAmount.value;
});
const overMax = computed(() => {
  return usdtAmount.value > maxData.usdt || kaiaAmount.value > maxData.kaia;
});

const handleSwap = () => {
  console.log("handleSwap");
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
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px 12px 24px;
  position: relative;

  .content-box {
    width: 100%;
    &.no-margin-top {
      margin-top: 0;
    }
  }
  .box-top {
    font-size: 14px;
    color: #83838f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    .num {
      color: var(--LS-Gray-07, #18181b);
      font-weight: 500;
      margin: 0 6px;
    }
    .max {
      color: var(--LS-Secondary-Blue-01, #2d87fa);

      font-weight: 500;
    }
  }
  .box-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box-left {
      width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 500;
      color: var(--LS-Gray-07, #18181b);

      .box-img {
        width: 28px;
        height: 28px;
        border-radius: 100%;
        margin-right: 6px;
      }
    }
    .box-right {
      flex: 1;
      :deep(.amount-field) {
        .van-field__control {
          text-align: right;
          font-size: 32px;
          font-weight: 700;
        }
      }
    }
  }
  .swap-img {
    width: 44px;
    height: 44px;
    margin: -12px auto;
    z-index: 10;
  }
  .swap-tip {
    color: #83838f;
    margin-top: 12px;
    text-align: right;
    width: 100%;
  }
  .btn-main {
    margin-top: 24px;
    &.disabled {
      background: #e5e5e5;
    }
    &.over-max {
      background: var(--LS-Secondary-Red-red, #f14d00);
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
  }
  .page-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
  }
  .page-desc {
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
