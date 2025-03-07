<script setup lang="ts" name="Pool">
import liff from "@line/liff";
import { useRouter } from "vue-router";
import GamePlayDialog from "./components/GameplayDialog.vue";
import PreviousDialog from "./components/PreviousWinners.vue";
import Progress from "@/components/Progress.vue";
import { ethers } from "ethers";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { useGlobalStore } from "@/store/globalStore";
import { getPoolList } from "@/api/index";
import avatar from "@/assets/user-avatar.svg";
import {
  getBalanceWithDapp,
  getTokenBalanceWithDapp,
  gasForApproveKaiaForDeposit,
  gasForApproveTokenForDeposit,
  gasForDepositWithDepositContract,
  gasForWithdrawWithDepositContract,
  approveKaiaForDeposit,
  approveTokenForDeposit,
  depositWithDepositContract,
  withdrawWithDepositContract,
  calculateTimeDifference,
  getDpositAmount,
  getPoolAmount,
  withdrawWithDevContract,
} from "@/utils/chainUtils";

onMounted(() => {
  console.log("Pool Page Mounted");
  getPoolList({ page: 10, pageSize: 1 }).then((res) => {
    console.log(res);
  });
});
// 初始化 Store
const globalStore = useGlobalStore();
const router = useRouter();

const poolInfos = {
  kaia: {
    daily: {
      prizePool: 123876323,
      tickets: 100,
      address: "0x1234567890",
      prizePoolABI: "",
      projectId: "a",
    },
    jackpot: {
      prizePool: 6323,
      tickets: 100,
      maxPrizePool: 10000,
      address: "0x1234567890",
      prizePoolABI: "",
      projectId: "b",
    },
  },
  usdt: {
    daily: {
      prizePool: 123876323,
      tickets: 100,
      address: "0x1234567890",
      prizePoolABI: "",
      projectId: "c",
    },
    jackpot: {
      prizePool: 6323,
      tickets: 100,
      maxPrizePool: 10000,
      address: "0x1234567890",
      prizePoolABI: "",
      projectId: "d",
    },
  },
};
const prizePoolInfo = computed(() => {
  const balanceInfo = globalStore.balanceInfo;
  const poolInfo = globalStore.prizePoolInfo;
  const usdtTicket = balanceInfo.USDT.savings;
  const kaiaTicket = balanceInfo.KAIA.savings;
  // const total = info.USDT.balance * globalStore.usdtValue + info.KAIA.balance * globalStore.kaiaValue || 0;
  const totalUsdtPrizePool = Number(poolInfo.USDT.allAmount);
  const usdtJackpot = totalUsdtPrizePool % 10000;
  const totalKaiaPrizePool = Number(poolInfo.KAIA.allAmount);
  const kaiaJackpot = totalKaiaPrizePool % 10000;
  const nextUsdtDrawOpenIn = calculateTimeDifference(globalStore.prizePoolInfo.USDT.timeTolottory);
  const nextKaiaDrawOpenIn = calculateTimeDifference(globalStore.prizePoolInfo.KAIA.timeTolottory);
  const day = 24 * 60 * 60 * 1000;
  const p = ((day - nextUsdtDrawOpenIn) / day) * 100;
  const p1 = ((day - nextKaiaDrawOpenIn) / day) * 100;
  let progress = p < 0 ? 0 : p;
  let progress1 = p1 < 0 ? 0 : p1;
  progress = progress > 100 ? 100 : progress;
  progress1 = progress1 > 100 ? 100 : progress1;
  return {
    usdtTicket,
    kaiaTicket,
    usdtJackpot,
    kaiaJackpot,
    totalUsdtPrizePool,
    totalKaiaPrizePool,
    nextUsdtDrawOpenIn,
    nextKaiaDrawOpenIn,
    progress: Math.ceil(progress),
    progress1: Math.ceil(progress1),
  };
});
// 选择池子 1: KAIA Pool 2: USD Pool
const selectedPool = ref("1");
const gamePlayDialogRef = ref(null);
const showGameplay = (category) => {
  const type = selectedPool.value;
  nextTick(() => {
    gamePlayDialogRef.value.showGameplayContent(type, category);
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
// 使用dapp sdk进行授权以及质押, selectedPool为1: KAIA Pool 2: USD Pool
const approveAndDepositWithDapp = async (amount: string) => {
  try {
    getBalanceWithDapp(globalStore.address);
    getTokenBalanceWithDapp(globalStore.address, import.meta.env.VITE_TOKEN_ADDRESS);
    // if (selectedPool === "1") {
    //   await approveKaiaForDeposit(globalStore.address, import.meta.env.VITE_KAIA_PRIZE_POOL_ADDRESS, amount);
    // } else {
    //   await approveTokenForDeposit(import.meta.env.VITE_TOKEN_ADDRESS, import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, amount);
    // }
    // await depositWithDepositContract(globalStore.address, amount, selectedPool);
    await approveTokenForDeposit(import.meta.env.VITE_TOKEN_ADDRESS, import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, amount);
    const response = await depositWithDepositContract(globalStore.address, amount, "2");
    getBalanceWithDapp(globalStore.address);
    getTokenBalanceWithDapp(globalStore.address, import.meta.env.VITE_TOKEN_ADDRESS);
    getDpositAmount(globalStore.address, "USDT");
    getDpositAmount(globalStore.address, "KAIA");
    getPoolAmount("USDT");
    getPoolAmount("KAIA");
    return response;
  } catch (error) {
    console.log(error);
  }
};
// 使用dapp sdk进行奖池存款提现, selectedPool为1: KAIA Pool 2: USD Pool
const withdrawWithDapp = async (amount: string) => {
  // await withdrawWithDepositContract(globalStore.address, amount, "2");
  await withdrawWithDevContract(globalStore.address, amount);
};
const showDeposit = ref(false);

const available = ref(1120);
const amount = ref(undefined);
const setMaxAmount = () => {
  amount.value = selectedPool.value === "1" ? globalStore.balanceInfo.KAIA.balance : globalStore.balanceInfo.USDT.balance;
};
const switchTab = (type) => {
  if (type === "1") {
    // 切换到KAIA Pool
    available.value = globalStore.balanceInfo.KAIA.balance;
    withdrawInfo.value.type = "KAIA";
  } else if (type === "2") {
    available.value = globalStore.balanceInfo.USDT.balance;
    withdrawInfo.value.type = "USDT";
  }
  selectedPool.value = type;
};
const showWithdraw = ref(false);
const withdrawInfo = ref({
  type: "USD",
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
const confirmWithdraw = async () => {
  console.log("confirmWithdraw");
  await getDpositAmount(localStorage.getItem("address2"), "USDT");
  await withdrawWithDapp("10");
  showWithdraw.value = false;
  amount.value = 0;
};
const confirmDeposit = async () => {
  await approveAndDepositWithDapp(amount.value.toString());
  showDeposit.value = false;
  amount.value = 0;
};
const inviteLink = ref("");
// 生成邀请链接
const generateInviteLink = () => {
  liff.permanentLink.createUrlBy("https://line.luckysavings.io/home?inviteCode=" + globalStore.userInfo.promoteCode).then((permanentLink) => {
    console.log("permanentLink:", permanentLink);
    inviteLink.value = permanentLink;
    liff
      .shareTargetPicker(
        [
          {
            type: "text",
            text: inviteLink.value,
          },
        ],
        {
          isMultiple: true,
        }
      )
      .then(function (res) {
        if (res) {
          // succeeded in sending a message through TargetPicker
          console.log(`[${res.status}] Message sent!`);
        } else {
          // sending message canceled
          console.log("TargetPicker was closed!");
        }
      })
      .catch(function (error) {
        // something went wrong before sending a message
        console.log("something wrong happen");
      });
  });
  return;
};
const showReminderMsg = ref(false);
</script>

<template>
  <div class="page-wrap">
    <div class="header">
      <div class="header-left">
        <img
          :src="globalStore.userInfo.avatar || avatar"
          class="product-img"
          @click="router.push('/profile')"
        />
        <div class="text-content">
          {{ globalStore.userInfo.nickname }}
        </div>
      </div>
      <div class="header-right">
        <!-- <svg-icon
          className="img-header-right"
          name="icon-msg-tip"
          @click="showReminderMsg = true"
        /> -->
        <svg-icon
          className="img-header-right"
          name="icon-upload"
          @click="generateInviteLink"
        />
      </div>
    </div>
    <!-- Daily Pool 标题部分 -->
    <div class="token-select content-box">
      <div
        class="token-btn"
        :class="{ daily: selectedPool === '1' }"
        @click="switchTab('1')"
      >
        {{ $t("pool.KAIAPool") }}
      </div>
      <div
        class="token-btn"
        :class="{ USDPool: selectedPool === '2' }"
        @click="switchTab('2')"
      >
        {{ $t("pool.USDPool") }}
      </div>
    </div>

    <!-- Daily Pool -->
    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("pool.DailyPool") }}</span>
        <svg-icon
          className="img-icon"
          name="icon-info"
          @click="showGameplay('1')"
        />
      </div>
      <div class="module-content content-box bg-white">
        <div
          class="countdown-box"
          :class="selectedPool === '2' ? 'bg-green' : 'bg-yellow'"
        >
          <svg-icon
            className="img-countdown-box-bg left-bg"
            name="icon-clocker"
          />
          <svg-icon
            className="img-countdown-box-bg right-bg"
            name="icon-gift-r"
          />
          <van-count-down
            :time="selectedPool === '2' ? prizePoolInfo.nextUsdtDrawOpenIn : prizePoolInfo.nextKaiaDrawOpenIn"
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
          :percentage="prizePoolInfo.progress"
          :bg-color="selectedPool === '2' ? '#06C756' : '#FEE719'"
        />
        <div class="text-grey">{{ $t("pool.CurrentPrizePool") }}</div>
        <div
          class="text-num"
          :class="selectedPool === '2' ? '' : 'text-num-yellow'"
        >
          <svg-icon
            v-show="selectedPool === '1'"
            className="icon-kaia"
            name="icon-kaia"
          />
          <span v-show="selectedPool === '2'">$</span>
          <span>{{ selectedPool === "2" ? prizePoolInfo.totalUsdtPrizePool : prizePoolInfo.totalKaiaPrizePool }}</span>
        </div>
        <div class="text-grey">{{ $t("pool.YourTickets") }}</div>
        <div class="ticket-box">
          <svg-icon
            v-show="selectedPool === '1'"
            class="img-tickets"
            name="img-tickets-kaia"
          />
          <svg-icon
            v-show="selectedPool === '2'"
            class="img-tickets"
            name="img-tickets"
          />
          <div class="ticket-num">{{ selectedPool === "1" ? prizePoolInfo.kaiaTicket : prizePoolInfo.usdtTicket }}</div>
        </div>
        <van-divider class="divider" />
        <div
          class="previous-winners"
          @click="showPreviousWinner"
        >
          <div class="previous-winners-left">
            <svg-icon
              className="img-jiangbei"
              name="icon-jiangbei"
            />
            <span>{{ $t("pool.PreviousWinners") }}</span>
          </div>
          <van-icon name="arrow" />
        </div>
        <div
          v-show="(selectedPool === '1' && prizePoolInfo.kaiaTicket > 0) || (selectedPool === '2' && prizePoolInfo.usdtTicket > 0)"
          class="btn-wrap margin-top-16"
        >
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            {{ $t("common.Withdraw") }}
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            {{ $t("pool.Deposit") }}
          </button>
        </div>
        <button
          v-show="(selectedPool === '1' && prizePoolInfo.kaiaTicket == 0) || (selectedPool === '2' && prizePoolInfo.usdtTicket == 0)"
          class="btn-main margin-top-16"
          @click="showDepositDialog"
        >
          {{ $t("home.JoinNow") }}
        </button>
      </div>
    </div>

    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("pool.JackpotTitle") }}</span>
        <svg-icon
          className="img-icon"
          name="icon-info"
          @click="showGameplay('2')"
        />
      </div>

      <div class="content-box bg-2 USDPool-content">
        <svg-icon
          className="module-inner-bg left-bg"
          name="icon-dollar-y"
        />
        <svg-icon
          className="module-inner-bg right-bg"
          name="icon-gift-r"
        />
        <div class="content-item-title-wrap">
          <div class="text-grey content-item-title">
            <svg-icon
              className="img-icon"
              name="icon-dollar"
            />
            {{ $t("pool.CurrentPrizePool") }}
          </div>
        </div>
        <div
          class="text-num"
          :class="selectedPool === '2' ? '' : 'text-num-yellow'"
        >
          <svg-icon
            v-show="selectedPool === '1'"
            className="icon-kaia"
            name="icon-kaia"
          />
          <span v-show="selectedPool === '2'">$</span>
          <span>{{ selectedPool === "2" ? prizePoolInfo.usdtJackpot : prizePoolInfo.kaiaJackpot }}</span>
          <span class="text-num-sub">/ $10,000</span>
        </div>
        <Progress
          :percentage="55"
          :bg-color="selectedPool === '2' ? '#06C756' : '#FEE719'"
        />
        <div class="text-grey">{{ $t("pool.YourTickets") }}</div>
        <div class="ticket-box">
          <svg-icon
            v-show="selectedPool === '1'"
            class="img-tickets"
            name="img-tickets-kaia"
          />

          <svg-icon
            v-show="selectedPool === '2'"
            class="img-tickets"
            name="img-tickets"
          />
          <div class="ticket-num">{{ selectedPool === "1" ? prizePoolInfo.kaiaTicket : prizePoolInfo.usdtTicket }}</div>
        </div>
        <van-divider class="divider" />
        <div
          class="previous-winners"
          @click="showPreviousWinner"
        >
          <div class="previous-winners-left">
            <svg-icon
              className="img-jiangbei"
              name="icon-jiangbei"
            />
            <span>{{ $t("pool.PreviousWinners") }}</span>
          </div>
          <van-icon name="arrow" />
        </div>

        <div
          v-show="(selectedPool === '1' && prizePoolInfo.kaiaTicket > 0) || (selectedPool === '2' && prizePoolInfo.usdtTicket > 0)"
          class="btn-wrap margin-top-16"
        >
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            {{ $t("common.Withdraw") }}
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            {{ $t("pool.Deposit") }}
          </button>
        </div>
        <button
          v-show="(selectedPool === '1' && prizePoolInfo.kaiaTicket == 0) || (selectedPool === '2' && prizePoolInfo.usdtTicket == 0)"
          class="btn-main margin-top-16"
          @click="showDepositDialog"
        >
          {{ $t("home.JoinNow") }}
        </button>
      </div>
    </div>
  </div>
  <!-- 弹窗 Daily Pool和10K Jackpot Gameplay -->
  <GamePlayDialog ref="gamePlayDialogRef" />
  <PreviousDialog ref="previousDialogRef" />
  <!-- 弹窗 USD Deposit -->
  <van-overlay
    :show="showDeposit"
    class-name="custom-dialog"
  >
    <div class="content-box">
      <div class="dialog-title">
        <div class="dialog-title-left">
          <svg-icon
            class="img-icon"
            name="icon-ustd"
          />

          <span>{{ selectedPool === "1" ? $t("pool.KAIADeposit") : $t("pool.USDDeposit") }}</span>
        </div>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="
            showDeposit = false;
            amount = 0;
          "
        />
      </div>

      <div class="dialog-content">
        <div class="content-item">
          <div class="title-wrap">
            <div class="label">{{ $t("pool.Amount") }}</div>
            <div class="available">
              <span>{{ $t("pool.Available") }}</span>
              <span class="item-value">{{ selectedPool === "1" ? globalStore.balanceInfo.KAIA.balance : globalStore.balanceInfo.USDT.balance }}</span>
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
                >{{ $t("pool.Max") }}</span
              >
            </template>
          </van-field>

          <div
            v-show="amount > available"
            class="warning-text"
          >
            <span>{{ $t("pool.TheAmountExceedsTheAvailableBalance") }}</span>
          </div>
        </div>
        <div class="content-item fee-info">
          <span>{{ $t("pool.GasFee") }}</span>
          <span class="item-value">{{ withdrawInfo.gasFee }} KAIA</span>
        </div>
        <div class="content-item item-desc">
          {{ $t("pool.DailyPoolTip") }}
        </div>
      </div>
      <div class="dialog-footer">
        <button
          class="btn-main"
          @click="confirmDeposit"
        >
          {{ $t("pool.Deposit") }}
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
          <svg-icon
            v-if="withdrawInfo.type === 'usd'"
            className="img-icon"
            name="icon-usdt"
          />
          <svg-icon
            v-else
            className="img-icon"
            name="icon-kaia"
          />

          <span>{{ withdrawInfo.type }} {{ $t("pool.Withdraw") }}</span>
        </div>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="showWithdraw = false"
        />
      </div>

      <div class="dialog-content">
        <div class="content-item dialog-content-item">
          <div class="item-top">{{ $t("pool.YourCurrentSavings") }}</div>
          <div class="item-bottom">
            <span>{{ withdrawInfo.savings }} {{ withdrawInfo.type }}</span>
          </div>
        </div>
        <div class="content-item fee-info">
          <span>{{ $t("pool.GasFee") }}</span>
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
          {{ $t("common.Withdraw") }}
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
          <span>{{ $t("pool.ReminderMessage") }}</span>
        </div>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="showReminderMsg = false"
        />
      </div>

      <div class="dialog-content no-margin-b">
        <div class="content-item content-item-reminder">
          <div class="item-top">👋 {{ $t("pool.PupUpsUpdate") }}</div>
          <div class="item-bottom">{{ $t("pool.PupUpsUpdateTip") }}</div>
          <div class="btn-main">{{ $t("pool.Go") }}</div>
        </div>
        <div class="content-item content-item-reminder no-margin-b">
          <div class="item-top">💻 {{ $t("pool.LuckySavingsGoesToV1Point1") }}</div>
          <div class="item-bottom">
            {{ $t("pool.urlTip") }}
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="scss">
.page-wrap {
  padding: 0 16px 12px 16px;
}

.content-box.token-select {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  margin-top: 0;
  padding: 12px;

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
    &.USDPool {
      background: #5aff9e;
    }
  }
}

.module-item {
  .countdown-box {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid var(--ls-line-4, rgba(24, 24, 27, 0.04));
    background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);
    position: relative;
    overflow: hidden;

    &.bg-green {
      background: #5aff9e;
    }
    &.bg-yellow {
      background: #fee719;
    }
    .img-countdown-box-bg {
      position: absolute;
      width: 64px;
      height: 64px;

      &.left-bg {
        left: 5px;
        bottom: 25px;
      }
      &.right-bg {
        right: 5px;
        top: 30px;
      }
    }
    :deep(.time-display) {
      height: 40px;
      line-height: 40px;
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
  .next-winner-drawn-tip {
    margin: 12px 0;
    font-size: 14px;
    line-height: 20px; /* 142.857% */
    opacity: 0.56;
    color: var(--LS-Gray-07, #18181b);
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
    &.USDPool-content {
      padding-top: 0px;
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

      &.text-num-yellow {
        color: var(--LS-Primary-02, #ddb305);
      }
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
        width: 82px;
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
          box-sizing: content-box;
          height: 40px;
          line-height: 40px;
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
