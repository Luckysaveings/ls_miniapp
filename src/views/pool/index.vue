<script setup lang="ts" name="Pool">
import { useRouter } from "vue-router";
import iconUsdt from "@/assets/icon-ustd.svg";
import iconKaia from "@/assets/icon-kaia.svg";
import userAvatar from "@/assets/user-avatar.svg";
import GamePlayDialog from "./components/GameplayDialog.vue";
import PreviousDialog from "./components/PreviousWinners.vue";
import Progress from "@/components/Progress.vue";
import { ethers } from "ethers";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { useGlobalStore } from "@/store/globalStore";
import { getPoolList } from "@/api/index";

onMounted(() => {
  console.log("Pool Page Mounted");
  getPoolList({ page: 10, pageSize: 1 }).then((res) => {
    console.log(res);
  });
});
// 初始化 Store
const globalStore = useGlobalStore();
const router = useRouter();
const userInfo = reactive({
  avatar: userAvatar,
  nickName: "Arthorn",
});
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
const checkConnection = async () => {
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
  try {
    await provider.getBlockNumber();
    console.log("Connected to Ethereum");
  } catch (error) {
    console.error("Failed to connect to Ethereum");
  }
};
// 生成智能合约实例
const getContractInstance = async (poolCoinType, poolType) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${poolInfos[poolCoinType][poolType].projectId}`);
  // 合约地址和 ABI
  const prizePoolAddress = poolInfos[poolCoinType][poolType].address; // 替换为实际的 Prize Pool 地址
  const prizePoolABI = poolInfos[poolCoinType][poolType].prizePoolABI;
  // 创建合约实例
  const prizePoolContract = new ethers.Contract(prizePoolAddress, prizePoolABI, provider);
  return prizePoolContract;
};
// 获取合约内用户余额
const getBalance = async (account, poolCoinType, poolType) => {
  // 创建合约实例
  const prizePoolContract = await getContractInstance(poolCoinType, poolType);
  const balance = await prizePoolContract.balanceOf(account);
  console.log("Balance: ", ethers.utils.formatEther(balance));
};
// 查询奖池总存款
const getPrizePoolTotalSupply = async (poolCoinType, poolType) => {
  // 创建合约实例
  const prizePoolContract = await getContractInstance(poolCoinType, poolType);
  const totalDeposits = await prizePoolContract.totalSupply();
  console.log("Prize Pool TotalSupply: ", ethers.utils.formatEther(totalDeposits));
};
// 查询当前奖励
const getPrizePoolReward = async (poolCoinType, poolType) => {
  // 创建合约实例
  const prizePoolContract = await getContractInstance(poolCoinType, poolType);
  const reward = await prizePoolContract.getCurrentPrize();
  console.log("Prize Pool Reward: ", ethers.utils.formatEther(reward));
};
// 存款到奖池
const depositToPrizePool = async (amount, poolCoinType, poolType) => {
  // 创建合约实例
  const prizePoolContract = await getContractInstance(poolCoinType, poolType);
  // 转账
  const tx = await prizePoolContract.depositTo(globalStore.walletAddress, ethers.utils.parseEther(amount));
  console.log(`交易已发送，等待确认...`);
  const receipt = await tx.wait();
  console.log(`交易完成，交易哈希: ${receipt.transactionHash}`);
};
// 从奖池提款
const withdrawFromPrizePool = async (amount, poolCoinType, poolType) => {
  // 创建合约实例
  const prizePoolContract = await getContractInstance(poolCoinType, poolType);
  // 转账
  const tx = await prizePoolContract.withdrawFrom(globalStore.walletAddress, ethers.utils.parseEther(amount));
  console.log(`交易已发送，等待确认...`);
  const receipt = await tx.wait();
  console.log(`交易完成，交易哈希: ${receipt.transactionHash}`);
};
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

const lineLogin = () => {};

const showDeposit = ref(false);

const available = ref(1120);
const amount = ref(undefined);
const setMaxAmount = () => {
  amount.value = available.value;
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
const confirmWithdraw = () => {
  console.log("confirmWithdraw");
  showWithdraw.value = false;
};
const confirmDeposit = () => {
  console.log("confirmDeposit");
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
          @click="router.push('/profile')"
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
        {{ $t("pool.KAIAPool") }}
      </div>
      <div
        class="token-btn"
        :class="{ USDPool: selectedPool === '2' }"
        @click="selectedPool = '2'"
      >
        {{ $t("pool.USDPool") }}
      </div>
    </div>

    <!-- Daily Pool -->
    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("pool.DailyPool") }}</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="showGameplay('1')"
        />
      </div>
      <div class="module-content content-box bg-white">
        <div
          class="countdown-box"
          :class="selectedPool === '2' ? 'bg-green' : 'bg-yellow'"
        >
          <img
            class="img-countdown-box-bg left-bg"
            src="@/assets/icon-clocker.svg"
            alt="countdown-box-bg"
            srcset=""
          />
          <img
            class="img-countdown-box-bg right-bg"
            src="@/assets/icon-gift-r.svg"
            alt="countdown-box-bg"
            srcset=""
          />

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
          :bg-color="selectedPool === '2' ? '#06C756' : '#FEE719'"
        />
        <div class="text-grey">{{ $t("pool.CurrentPrizePool") }}</div>
        <div
          class="text-num"
          :class="selectedPool === '2' ? '' : 'text-num-yellow'"
        >
          <img
            v-show="selectedPool === '1'"
            class="icon-kaia"
            src="@/assets/icon-kaia.svg"
            alt="kaia"
          />
          <span v-show="selectedPool === '2'">$</span>
          <span>123,876,323</span>
        </div>
        <div class="text-grey">{{ $t("pool.YourTickets") }}</div>
        <div class="ticket-box">
          <img
            v-show="selectedPool === '1'"
            class="img-tickets"
            src="@/assets/img-tickets-kaia.svg"
            alt="tickets"
          />
          <img
            v-show="selectedPool === '2'"
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
            <span>{{ $t("pool.PreviousWinners") }}</span>
          </div>
          <van-icon name="arrow" />
        </div>
        <div
          v-show="selectedPool === '1'"
          class="btn-wrap margin-top-16"
        >
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            {{ $t("pool.Withdraw") }}
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            {{ $t("pool.Deposit") }}
          </button>
        </div>
        <button
          v-show="selectedPool === '2'"
          class="btn-main margin-top-16"
          @click="router.push('/pool')"
        >
          {{ $t("home.JoinNow") }}
        </button>
      </div>
    </div>

    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("pool.JackpotTitle") }}</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="showGameplay('2')"
        />
      </div>

      <div class="content-box bg-2 USDPool-content">
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
            {{ $t("pool.CurrentPrizePool") }}
          </div>
        </div>
        <div
          class="text-num"
          :class="selectedPool === '2' ? '' : 'text-num-yellow'"
        >
          <img
            v-show="selectedPool === '1'"
            class="icon-kaia"
            src="@/assets/icon-kaia.svg"
            alt="kaia"
          />
          <span v-show="selectedPool === '2'">$</span>
          <span>6,323</span>
          <span class="text-num-sub">/ $10,000</span>
        </div>
        <Progress
          :percentage="55"
          :bg-color="selectedPool === '2' ? '#06C756' : '#FEE719'"
        />
        <div class="text-grey">{{ $t("pool.YourTickets") }}</div>
        <div class="ticket-box">
          <img
            v-show="selectedPool === '1'"
            class="img-tickets"
            src="@/assets/img-tickets-kaia.svg"
            alt="tickets"
          />
          <img
            v-show="selectedPool === '2'"
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
            <span>{{ $t("pool.PreviousWinners") }}</span>
          </div>
          <van-icon name="arrow" />
        </div>

        <div
          v-show="selectedPool === '1'"
          class="btn-wrap margin-top-16"
        >
          <button
            class="btn-main btn-withdraw"
            @click="showWithdrawDialog"
          >
            {{ $t("pool.Withdraw") }}
          </button>
          <button
            class="btn-main"
            @click="showDepositDialog"
          >
            {{ $t("pool.Deposit") }}
          </button>
        </div>
        <button
          v-show="selectedPool === '2'"
          class="btn-main margin-top-16"
          @click="router.push('/pool')"
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
          <img
            class="img-icon"
            src="@/assets/icon-ustd.svg"
            alt="ustd"
          />
          <span>{{ $t("pool.USDDeposit") }}</span>
        </div>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="showDeposit = false"
        />
      </div>

      <div class="dialog-content">
        <div class="content-item">
          <div class="title-wrap">
            <div class="label">{{ $t("pool.Amount") }}</div>
            <div class="available">
              <span>{{ $t("pool.Available") }}</span>
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
          <img
            class="img-icon"
            :src="withdrawInfo.type === 'usd' ? iconUsdt : iconKaia"
            alt="icon"
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
          {{ $t("pool.Withdraw") }}
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
          <div class="item-top">{{ $t("pool.PupUpsUpdate") }}</div>
          <div class="item-bottom">
            {{ $t("pool.PupUpsUpdateTip") }}
          </div>
          <div class="btn-main">{{ $t("pool.Go") }}</div>
        </div>
        <div class="content-item content-item-reminder no-margin-b">
          <div class="item-top">{{ $t("pool.LuckySavingsGoesToV1Point1") }}</div>
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
