<script setup lang="ts" name="Pool">
import iconUsdt from '@/assets/icon-ustd.svg';
import iconKaia from '@/assets/icon-kaia.svg';
import userAvatar from '@/assets/user-avatar.svg';
import GameplayDialog from './components/GameplayDialog.vue';
import PreviousDialog from './components/PreviousWinners.vue';
import Progress from '@/components/Progress.vue';

const userInfo = reactive({
  avatar: userAvatar,
  nickName: 'Arthorn',
});
// 选择池子 1: Daily Pool 2: $10K Jackpot
const selectedPool = ref('1');
const gameplayDialogRef = ref(null);
const showGameplay = () => {
  const type = selectedPool.value;
  nextTick(() => {
    gameplayDialogRef.value.showGameplayContent(type);
  });
};
const previousDialogRef = ref(null);
const showPreviousWinner = () => {
  const type = selectedPool.value;
  nextTick(() => {
    previousDialogRef.value.showDialog(type);
  });
};

const time = ref(13600 * 1000);
const formatTime = (value) => {
  return value < 10 ? `0${value}` : value;
};

const lineLogin = () => {
  console.log('click-pool');
  const line_auth = 'https://access.line.me/oauth2/v2.1/authorize';
  const auth_params = {
    response_type: 'code',
    client_id: '2006818858',
    redirect_uri: window.location.href, // 在LINE Developers Console上注册的回调 URL 的 URL 编码字符串。您可以添加任何查询参数。
    state: 'STATE', // 用于防止跨站点请求伪造的唯一字母数字字符串. 您的网络应用应为每个登录会话生成一个随机值。这不能是 URL 编码的字符串。
    scope: 'profile openid email', // 向用户请求的权限,查询范围可以看官网(https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes)
  };
  // 这里使用了第三方库qs来处理参数
  const paramsString = qs.stringify(auth_params);
  console.log(line_auth, paramsString);
  window.location.href = `${line_auth}?${paramsString}`;
};

const showDeposit = ref(false);

const available = ref(1120);
const amount = ref(undefined);
const setMaxAmount = () => {
  amount.value = available.value;
};

const showWithdraw = ref(false);
const withdrawInfo = ref({
  type: 'USD',
  savings: 100,
  gasFee: 1.2,
  desc: `You can check all returns later in the wallet balance under the Home tab.`,
});
const showWithdrawDialog = () => {
  showWithdraw.value = true;
};
const showDepositDialog = () => {
  showDeposit.value = true;
};
const confirmWithdraw = () => {
  showWithdraw.value = false;
};
const confirmDeposit = () => {
  showDeposit.value = false;
};

const showReminderMsg = ref(false);
</script>

<template>
  <div class="page-wrap">
    <div class="header">
      <div class="header-left">
        <van-image
          width="36"
          height="36"
          fit="cover"
          :src="userInfo.avatar"
          round
          class="product-img"
          @click="router.push('/settings')"
        />
        <div class="text-content">
          {{ userInfo.nickName }}
        </div>
      </div>
      <div class="header-right">
        <img
          class="img-header-right"
          src="@/assets/icon-msg-tip.svg"
          alt="msg-tip"
          @click="showReminderMsg = true"
        />
        <img
          class="img-header-right"
          src="@/assets/icon-upload.svg"
          alt="upload"
        />
      </div>
    </div>
    <!-- Daily Pool 标题部分 -->
    <div class="token-select content-box">
      <div
        class="token-btn"
        :class="{ daily: selectedPool === '1' }"
        @click="selectedPool = '1'"
      >
        Daily Pool
      </div>
      <div
        class="token-btn"
        :class="{ jackpot: selectedPool === '2' }"
        @click="selectedPool = '2'"
      >
        $10K Jackpot
      </div>
    </div>

    <!-- 下次开奖时间模块 -->
    <div
      class="module-item"
      v-show="selectedPool === '1'"
    >
      <div class="module-title">Next winner drawn</div>
      <div class="module-content content-box bg-yellow">
        <div class="countdown-box">
          <van-count-down
            :time="time"
            format="HH:mm:ss"
          >
            <template #default="timeData">
              <div class="time-display">
                <span class="time-block">{{ formatTime(timeData.hours) }}</span>
                <span class="time-separator">:</span>
                <span class="time-block">{{ formatTime(timeData.minutes) }}</span>
                <span class="time-separator">:</span>
                <span class="time-block">{{ formatTime(timeData.seconds) }}</span>
              </div>
            </template>
          </van-count-down>
        </div>
        <Progress
          :percentage="75"
          bg-color="#06C756"
        />
        <van-divider class="divider" />
        <div
          class="previous-winners"
          @click="showPreviousWinner"
        >
          <div class="previous-winners-left">
            <img
              class="img-jiangbei"
              src="@/assets/icon-jiangbei.svg"
              alt="jiangbei"
            />
            <span>Previous winners</span>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- USD Pool 模块 -->
    <div class="module-item">
      <div class="module-title">
        <span>USD Pool</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="showGameplay"
        />
      </div>
      <div
        class="content-box bg-green"
        v-show="selectedPool === '1'"
      >
        <div class="text-grey">Current prize pool</div>
        <div class="text-num">$123,876,323</div>
        <div class="text-grey">Your tickets</div>
        <div class="ticket-box">
          <img
            class="img-tickets"
            src="@/assets/img-tickets.svg"
            alt="tickets"
          />
          <div class="ticket-num">x100</div>
        </div>
        <button
          class="btn-main"
          @click="lineLogin"
        >
          Join Now
        </button>
      </div>
      <div
        class="content-box bg-green jackpot-content"
        v-show="selectedPool === '2'"
      >
        <img
          class="module-inner-bg left-bg"
          src="@/assets/icon-dollar-y.svg"
          alt="dollar"
        />
        <img
          class="module-inner-bg right-bg"
          src="@/assets/icon-gift-r.svg"
          alt="gift"
        />
        <div class="content-item-title-wrap">
          <div class="text-grey content-item-title">
            <img
              class="img-icon"
              src="@/assets/icon-dollar.svg"
              alt="dollar"
            />
            Current prize pool
          </div>
        </div>
        <div class="text-num">
          <span>$123,876</span>
          <span class="text-num-sub">/ $10,000</span>
        </div>
        <Progress
          :percentage="65"
          bg-color="#06c756"
        />
        <div class="text-grey">Your tickets</div>
        <div class="ticket-box">
          <img
            class="img-tickets"
            src="@/assets/img-tickets.svg"
            alt="tickets"
          />
          <div class="ticket-num">x100</div>
        </div>
        <van-divider class="divider" />
        <div
          class="previous-winners"
          @click="showPreviousWinner"
        >
          <div class="previous-winners-left">
            <img
              class="img-jiangbei"
              src="@/assets/icon-jiangbei.svg"
              alt="jiangbei"
            />
            <span>Previous winners</span>
          </div>
          <van-icon name="arrow" />
        </div>
        <button
          class="btn-main margin-top-16"
          @click="lineLogin"
        >
          Join Now
        </button>
      </div>
    </div>

    <!-- KAIA Pool 模块 -->
    <div class="module-item">
      <div class="module-title">
        <span>KAIA Pool</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="showGameplay"
        />
      </div>
      <div
        class="content-box bg-2"
        v-show="selectedPool === '1'"
      >
        <div class="text-grey">Current prize pool</div>
        <div class="text-num">
          <img
            class="icon-kaia"
            src="@/assets/icon-kaia.svg"
            alt="kaia"
          />
          <span>123,876,323</span>
        </div>
        <div class="text-grey">Your tickets</div>
        <div class="ticket-box">
          <img
            class="img-tickets"
            src="@/assets/img-tickets-kaia.svg"
            alt="tickets"
          />
          <div class="ticket-num">x100</div>
        </div>
        <div class="btn-wrap">
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            Withdraw
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            Deposit
          </button>
        </div>
      </div>

      <div
        class="content-box bg-2 jackpot-content"
        v-show="selectedPool === '2'"
      >
        <img
          class="module-inner-bg left-bg"
          src="@/assets/icon-dollar-y.svg"
          alt="dollar"
        />
        <img
          class="module-inner-bg right-bg"
          src="@/assets/icon-gift-r.svg"
          alt="gift"
        />
        <div class="content-item-title-wrap">
          <div class="text-grey content-item-title">
            <img
              class="img-icon"
              src="@/assets/icon-dollar.svg"
              alt="dollar"
            />
            Current prize pool
          </div>
        </div>
        <div class="text-num text-num-yellow">
          <img
            class="icon-kaia"
            src="@/assets/icon-kaia.svg"
            alt="kaia"
          />
          <span>3,876</span>
          <span class="text-num-sub">/ 10,000</span>
        </div>
        <Progress
          :percentage="55"
          bg-color="#fee719"
        />
        <div class="text-grey">Your tickets</div>
        <div class="ticket-box">
          <img
            class="img-tickets"
            src="@/assets/img-tickets-kaia.svg"
            alt="tickets"
          />
          <div class="ticket-num">x100</div>
        </div>
        <van-divider class="divider" />
        <div
          class="previous-winners"
          @click="showPreviousWinner"
        >
          <div class="previous-winners-left">
            <img
              class="img-jiangbei"
              src="@/assets/icon-jiangbei.svg"
              alt="jiangbei"
            />
            <span>Previous winners</span>
          </div>
          <van-icon name="arrow" />
        </div>

        <div class="btn-wrap margin-top-16">
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            Withdraw
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- 弹窗 Daily Pool和10K Jackpot Gameplay -->
  <GameplayDialog ref="gameplayDialogRef" />
  <PreviousDialog ref="previousDialogRef" />
  <!-- 弹窗 USD Deposit -->
  <van-overlay
    :show="showDeposit"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <div class="dialog-title-left">
          <img
            class="img-icon"
            src="@/assets/icon-ustd.svg"
            alt="ustd"
          />
          <span>USD Deposit</span>
        </div>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="showDeposit = false"
        />
      </div>

      <div class="dialog-content">
        <div class="content-item">
          <div class="title-wrap">
            <div class="label">Amount</div>
            <div class="available">
              <span>Available</span>
              <span class="item-value">{{ available }}</span>
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

          <div
            class="warning-text"
            v-show="amount > available"
          >
            <span>The amount exceeds the available balance!</span>
          </div>
        </div>
        <div class="content-item fee-info">
          <span>Gas fee</span>
          <span class="item-value">1.2 KAIA</span>
        </div>
        <div class="content-item item-desc">
          You will never lose your principal and can withdraw at any time. Your yields will be rolled into the Daily Pool and the $10k Jackpot at a
          50%:50% ratio.
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn-main"
          @click="confirmDeposit"
        >
          Deposit
        </button>
      </div>
    </div>
  </van-overlay>
  <!-- 弹窗 Withdraw -->
  <van-overlay
    :show="showWithdraw"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <div class="dialog-title-left">
          <img
            class="img-icon"
            :src="withdrawInfo.type === 'usd' ? iconUsdt : iconKaia"
            alt="icon"
          />
          <span>{{ withdrawInfo.type }} Withdraw</span>
        </div>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="showWithdraw = false"
        />
      </div>

      <div class="dialog-content">
        <div class="content-item dialog-content-item">
          <div class="item-top">Your current savings</div>
          <div class="item-bottom">
            <span>$1,000</span>
          </div>
        </div>
        <div class="content-item fee-info">
          <span>Gas fee</span>
          <span class="item-value">{{ withdrawInfo.gasFee }} KAIA</span>
        </div>
        <div class="content-item item-desc">
          {{ withdrawInfo.desc }}
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn-main"
          @click="confirmWithdraw"
        >
          Withdraw
        </button>
      </div>
    </div>
  </van-overlay>

  <!-- 弹窗 Reminder Message -->
  <van-overlay
    :show="showReminderMsg"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <div class="dialog-title-left">
          <span>Reminder Message</span>
        </div>
        <van-icon
          name="close"
          size="20"
          color="#A1A1AA"
          @click="showReminderMsg = false"
        />
      </div>

      <div class="dialog-content no-margin-b">
        <div class="content-item content-item-reminder">
          <div class="item-top">👋 Pup-ups update!</div>
          <div class="item-bottom">We just updated the Popups mission, in total 2000 Badges!</div>
          <div class="btn-main">Go</div>
        </div>
        <div class="content-item content-item-reminder no-margin-b">
          <div class="item-top">‍💻 LuckySavings goes to V1.1!</div>
          <div class="item-bottom">
            blablablabalblabalbalba, read more:
            <a
              href="http://blababalbala"
              target="_blank"
              class="txt-link"
              >http://blababalbala</a
            >
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="scss">
.page-wrap {
  padding: 12px 16px;
}

// 头部样式
.header {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  height: 36px;
  line-height: 36px;

  .header-left {
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 16px;
    .text-content {
      margin-left: 16px;
      font-size: 18px;
      color: #18181b;
    }
  }

  .header-right {
    width: 39px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;

    .img-header-right {
      margin-right: 16px;
      width: 24px;
      height: 24px;
    }
  }
}
.content-box.token-select {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 8px;

  .token-btn {
    font-size: 16px;
    font-weight: 500;
    border-radius: 14px;
    padding: 12px 16px;
    width: calc(50% - 6px);
    text-align: center;

    &.daily {
      background: var(--LS-Primary-01, #fee719);
    }
    &.jackpot {
      background: #5aff9e;
    }
  }
}

.module-item {
  margin-bottom: 32px;

  .module-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 12px;

    .img-icon {
      margin-left: 6px;
    }
  }
  .countdown-box {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid var(--ls-line-4, rgba(24, 24, 27, 0.04));
    background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);

    :deep(.time-display) {
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      .time-separator {
        display: inline-block;
        width: 26px;
        opacity: 0.5;
      }
    }
  }
  .divider {
    border-color: rgba(24, 24, 27, 0.08);
    width: 100%;
    margin: 0 0 12px 0;
  }
  .previous-winners {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .previous-winners-left {
      display: flex;
      align-items: center;
      font-weight: 500;

      .img-jiangbei {
        margin-right: 6px;
        width: 18px;
        height: 18px;
      }
    }
  }

  .content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .module-inner-bg {
      position: absolute;
      top: 10px;
      width: 48px;
      height: 48px;
    }
    .left-bg {
      left: 20px;
    }
    .right-bg {
      right: 20px;
    }
    &.bg-green {
      background: linear-gradient(180deg, #e7fff1 0%, #fff 100%);
    }
    &.bg-2 {
      background: linear-gradient(180deg, #ffffed 0%, #fff 100%);
    }
    &.jackpot-content {
      padding-top: 0px;

      .text-num {
        &.text-num-yellow {
          color: var(--LS-Primary-02, #ddb305);
        }
      }
    }
    .text-grey {
      color: #83838f;
      font-weight: 500;
    }
    .text-num {
      display: flex;
      align-items: center;
      font-size: 32px;
      line-height: 38px;
      font-weight: 700;
      color: #00ba4d;
      margin-top: 2px;
      margin-bottom: 12px;

      .text-num-sub {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        margin-top: 12px;
        margin-left: 5px;
      }
      .icon-kaia {
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
    }
    .ticket-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 6px 0 16px 0;
      .img-tickets {
        margin-right: 8px;
        height: 30px;
      }
      .ticket-num {
        font-size: 18px;
        font-weight: 700;
        color: #00ba4d;
      }
    }

    .btn-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .btn-main {
        width: calc(50% - 6px);

        &.btn-withdraw {
          color: #18181b;
          background: #fff;
          border: 2px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
        }
      }
    }
    .content-item-title-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -3px;
      position: relative;
      // &::before {
      //   content: '';
      //   width: 22px;
      //   height: 22px;
      //   background: var(--LS-Gray-07, #18181b);
      //   border-radius: 50%;
      //   position: absolute;
      //   top: -11px;
      //   left: 0%;
      //   transform: translateX(-50%);
      // }
      .content-item-title {
        line-height: 20px;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        gap: 6px;
        font-weight: 500;
        color: var(--LS-Gray-01, #fff);

        margin-bottom: 6px;
        border-radius: 0px 0px 16px 16px;
        background: var(--LS-Gray-07, #18181b);
      }
    }
  }
}
.custom-dialog {
  .dialog-title-left {
    .img-icon {
      margin-right: 6px;
    }
  }
  .content-item {
    width: 100%;

    .warning-text {
      margin-top: 6px;
      font-weight: 500;
      color: #f14d00;
    }
  }
  .custom-field {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--ls-line-4, rgba(24, 24, 27, 0.04));
    background: var(--ls-line-4, rgba(24, 24, 27, 0.04));
    margin: 6px 0 0 0;
  }
  .fee-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
  }
  .item-desc {
    margin-bottom: 0px;
    font-size: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--ls-line-4, rgba(24, 24, 27, 0.04));
    background: var(--ls-line-4, rgba(24, 24, 27, 0.04));
  }

  .dialog-content-item {
    .item-bottom {
      margin-top: 6px;
      font-size: 24px;
      font-weight: 700;
      color: #18181b;
      line-height: 28px;
    }
  }
  .content-item-reminder {
    text-align: left;
    padding: 16px;
    border-radius: 12px;
    background: var(--LS-Gray-02, #f4f4f5);

    .item-top {
      font-size: 18px;
      font-weight: 700;
      color: #18181b;
      line-height: 22px;
    }
    .item-bottom {
      margin-top: 6px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #83838f;
      line-height: 24px;
    }
  }
}
</style>
