<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Withdraw"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="nav-bar-wrap"
      :border="false"
    >
      <template #right>
        <van-icon
          :name="iconScan"
          size="24"
        />
      </template>
    </van-nav-bar>

    <div class="page-content">
      <!-- Token 选择 -->
      <div class="content-item">
        <div class="label">Select Tokens</div>
        <div class="token-select">
          <div
            class="token-btn"
            :class="{ active: selectedToken === 'USDT' }"
            @click="selectedToken = 'USDT'"
          >
            <img
              src="@/assets/icon-ustd.svg"
              alt="USDT"
            />
            USDT
          </div>
          <div
            class="token-btn"
            :class="{ active: selectedToken === 'KAIA' }"
            @click="selectedToken = 'KAIA'"
          >
            <img
              src="@/assets/icon-kaia.svg"
              alt="KAIA"
            />
            KAIA
          </div>
        </div>
      </div>

      <!-- 提现地址输入 -->
      <div class="content-item">
        <div class="label">Withdraw Address</div>
        <van-field
          v-model="address"
          placeholder="Address"
          class="custom-field"
          clearable
        />
      </div>

      <!-- 金额输入 -->
      <div class="content-item">
        <div class="title-wrap">
          <div class="label">Amount</div>
          <div class="available">
            <span>Available</span>
            <span class="item-value">{{ available }} USDT</span>
          </div>
        </div>
        <van-field
          v-model="amount"
          placeholder="0.00"
          class="custom-field"
        >
          <template #right-icon>
            <span
              class="max-btn"
              @click="setMaxAmount"
              >Max</span
            >
          </template>
        </van-field>
      </div>

      <!-- Gas Fee -->
      <div class="content-item fee-info">
        <span>Gas fee</span>
        <span class="item-value">1.2 KAIA</span>
      </div>
      <van-divider />

      <!-- 提现地址历史 -->
      <div class="history-section">
        <div class="history-title">
          <van-icon
            name="clock-o"
            size="24px"
          />
          Withdraw Address
        </div>
        <div class="no-history">
          <div
            class="list-wrap"
            v-if="withdrawList.length > 0"
          >
            <div
              class="list-item"
              v-for="item in withdrawList"
              :key="item.id"
            >
              <div class="list-item-label">
                <img
                  src="@/assets/icon-wallet.svg"
                  class="list-item-icon"
                  alt="USDT"
                />
                <span>{{ item.address }}</span>
              </div>
              <div class="list-item-value">
                {{ item.time }}
              </div>
            </div>
          </div>
          <van-empty
            v-else
            :image="iconEmpty"
            image-size="40"
            description="No historical address"
          />
        </div>
      </div>
    </div>
    <!--  Button -->
    <div class="btn-wrapper">
      <div
        class="btn-bottom btn-main"
        :class="{ disabled: !isValidNext }"
        @click="handleNext"
      >
        Next
      </div>
    </div>
  </div>

  <van-overlay
    :show="showInfo"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <span>Withdraw</span>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="hiddenInfo"
        />
      </div>

      <div class="dialog-content">
        <div class="dialog-content-item">
          <div class="item-label">You are sending</div>
          <div class="item-value top">
            <span>{{ amount }} USDT</span>
          </div>
        </div>
        <div class="dialog-content-item">
          <div class="item-label">To</div>
          <div class="item-value bottom">
            <span>{{ address }}</span>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn-main"
          @click="confirmWithdraw"
        >
          Confirm
        </button>
        <div class="warning-text">
          <img
            src="@/assets/icon-warning.svg"
            alt="warning"
          />
          <span> Once confirmed,there is no retracting </span>
        </div>
      </div>
    </div>
  </van-overlay>

  <van-overlay
    :show="showInfoStatus"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <span></span>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="hiddenInfoStatus"
        />
      </div>

      <div class="dialog-content status-content">
        <img
          v-if="infoStatus === 'success'"
          src="@/assets/icon-success.svg"
          alt="success"
          class="img-status"
        />
        <img
          v-if="infoStatus === 'error'"
          src="@/assets/icon-error.svg"
          alt="error"
          class="img-status"
        />
        <div class="status-bottom">
          <span class="item-status">{{ infoStatus === 'success' ? 'Withdraw Success' : 'Withdraw Failed' }}</span>
          <span class="item-desc">{{ infoStatus === 'success' ? 'Withdrawal success please check your wallet.' : 'Please try again' }}</span>
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn-main"
          :class="{ success: infoStatus === 'success' }"
          @click="confirmStatus"
        >
          <span v-if="infoStatus === 'success'">OK</span>
          <span v-else>Retry</span>
        </button>
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

<script setup name="Withdraw">
import { computed } from 'vue';
import { showToast } from 'vant';
import iconHistory from '@/assets/icon-history.svg';
import iconScan from '@/assets/icon-scan.svg';
import iconEmpty from '@/assets/icon-empty.svg';
import checkCircle from '@/assets/check-circle.svg';
import { useRouter } from 'vue-router';
const router = useRouter();
const showInfo = ref(false);
const showInfoStatus = ref(false);
const infoStatus = ref('');
const onClickRight = () => {
  router.push('/page-history');
};
const onClickLeft = () => {
  router.back();
};
const isValidNext = computed(() => {
  return address.value && amount.value;
});
const selectedToken = ref('USDT');
const address = ref('');
const amount = ref('');
const available = ref('1,120');

const setMaxAmount = () => {
  amount.value = available.value;
};

const isValid = computed(() => {
  return address.value && amount.value;
});

const show = ref(false);
const toastText = ref('Copy Success');

const withdrawList = ref([
  { address: '6xvni1...dyEfW7', time: 'Used 1 days ago ', id: 1 },
  { address: '6xvni1...dyEfW7', time: 'Used 1 days ago ', id: 2 },
  { address: '6xvni1...dyEfW7', time: 'Used 1 days ago ', id: 3 },
]);

const handleNext = () => {
  if (isValid.value) {
    // showInfoStatus
    showInfo.value = true;
    // infoStatus.value = 'success';
  }
};
const hiddenInfo = () => {
  showInfo.value = false;
};
const hiddenInfoStatus = () => {
  showInfoStatus.value = false;
};
const confirmStatus = () => {
  showInfoStatus.value = false;
  if (infoStatus.value === 'success') {
    console.log('success');
  } else {
    console.log('error');
  }
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
  color: #18181b;

  .nav-bar-wrap {
    padding: 0;
  }
}
.page-content {
  padding: 12px 24px;

  .content-item {
    margin-bottom: 16px;

    .label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .token-btn {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      border-radius: 14px;
      border: 2px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));

      &.active {
        border: 2px solid var(--LS-Gray-07, #18181b);
      }
    }

    .custom-field {
      border-radius: 12px;
    }

    .item-value {
      font-weight: 500;
      margin-left: 6px;
      color: #18181b;
    }
    .title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .available {
        display: flex;
        color: #83838f;
        font-weight: 400;
      }
    }
    .max-btn {
      font-size: 16px;
      color: #2d87fa;
      font-weight: 500;
      margin-right: 12px;
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
      font-weight: 700;
    }
  }
}

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.token-select {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.token-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
}

.token-btn.active {
  background: #f0f9ff;
  border: 1px solid #1989fa;
}

.token-btn img {
  width: 20px;
  height: 20px;
}

.amount-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.available {
  font-size: 14px;
  color: #666;
}

.custom-field {
  margin-bottom: 16px;
}

.max-btn {
  color: #1989fa;
  font-size: 14px;
  cursor: pointer;
}

.fee-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
}

.no-history {
  display: flex;
  justify-content: center;
  padding: 0px;

  .list-wrap {
    width: 100%;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .list-item-label {
        display: flex;
        .list-item-icon {
          margin-right: 8px;
        }
      }
      .list-item-value {
        color: var(--LS-Gray-05, #83838f);
      }
    }
  }
}

.bottom-button {
  padding: 16px;
  background: #fff;
}

:deep(.van-field__right-icon) {
  padding-right: 0;
}
.btn-wrapper {
  padding: 24px;
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;

  .btn-main {
    &.disabled {
      background: #e5e5e5;
    }
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
