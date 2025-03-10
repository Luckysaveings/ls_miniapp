<script setup lang="ts" name="Home">
import CustomToast from "@/components/CustomToast.vue";
import liff from "@line/liff";
import { useRouter } from "vue-router";
import { useClickAway } from "@vant/use";
import { useGlobalStore } from "@/store/globalStore";
import { getTaskList, login } from "@/api/index";
import avatar from "@/assets/catAvatar.svg";
import { closeToast } from "vant";
import {
  createKaiaWallet,
  getKaiaBalance,
  transferInKaia,
  approveTokenForDeposit,
  formatWalletAddress,
  formatAmount,
  calculateTimeDifference,
  getDepositAmount,
  getPoolAmount,
  getTokenBalance,
  gasForApproveTokenForDeposit,
  gasForDepositWithDepositContract,
  depositWithDepositContract,
  withdrawWithDepositContract,
  showToastBeforeRequest,
} from "@/utils/index";

const availableRewards = reactive({
  points: 100,
  badges: 10,
});
const getAvailableRewards = () => {
  return getTaskList().then((res) => {
    const list = (res.data && res.data.list) || [];
    const unCompletedList = list.filter((item) => item.status !== 3);
    const pointList = unCompletedList.filter((item) => item.rewardType === 0);
    const badgeList = unCompletedList.filter((item) => item.rewardType === 1);

    const totalPoints = pointList.reduce((acc, cur) => acc + cur.rewardAmount, 0);
    const totalBadges = badgeList.reduce((acc, cur) => acc + cur.rewardAmount, 0);

    availableRewards.points = totalPoints;
    availableRewards.badges = totalBadges;
    return res;
  });
};
// 初始化 Store
const globalStore = useGlobalStore();
onMounted(() => {
  // showToastBeforeRequest();
  // getAvailableRewards().then((res) => {
  //   closeToast();
  // });
  window["fromHome"] = true;
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    window.setTimeout(() => {
      loadingElement.remove();
    }, 600);
  }
});

const router = useRouter();
const showInfo = ref(false);
const infoType = ref("");
const infoIcon = ref("");
const showBalanceInfo = (type: string) => {
  showInfo.value = true;
  infoType.value = type;
  infoIcon.value = type === "USDT" ? "icon-ustd" : "icon-kaia";
};
const hiddenInfo = () => {
  showInfo.value = false;
};

const balanceInfo = reactive({
  USDT: {
    balance: 1000,
    savings: 10000,
    drawRewards: 10,
  },
  KAIA: {
    balance: 1000,
    savings: 10000,
    drawRewards: 10,
  },
});
const showCopyToast = ref(false);
const copyToastText = ref("Copy Success");
const copyAddress = (txt) => {
  navigator.clipboard.writeText(txt || "");
  copyToastText.value = "Copy Success";
  showCopyToast.value = true;
};

const prizePoolInfo = computed(() => {
  const info = globalStore.balanceInfo;
  const total = info.USDT.allAmount * globalStore.usdtValue + info.KAIA.allAmount * globalStore.kaiaValue || 0;
  const totalPrizePool = total.toFixed(2);
  const nextDrawOpenIn = calculateTimeDifference(1);
  const day = 24 * 60 * 60 * 1000;
  const p = ((day - nextDrawOpenIn) / day) * 100;
  let progress = p < 0 ? 0 : p;
  progress = progress > 100 ? 100 : progress;
  return {
    totalPrizePool,
    nextDrawOpenIn,
    progress: Math.ceil(progress),
  };
});

const formatTime = (value) => {
  return value < 10 ? `0${value}` : value;
};
const kaiaChainOperate = async () => {
  // createKaiaWallet(); // 创建一个kaia测试链的钱包，提示词，钱包地址和私钥均存储在localStorage缓存中
  getKaiaBalance(localStorage.getItem("address")); // 获取刚生成的钱包地址的kaia余额
  getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9"); // 获取钱包地址的kaia余额
  // 在测试链上转账，第一个参数是私钥（一个有余额的钱包）用来对交易签名，第二个参数是接收方地址，第三个参数是转账金额
  // await transferInKaia("0xf9267a9f70dc239b1efecb595dcccaf74a8cecfb4d92f05f2c5d918aeac4f92e", localStorage.getItem("address"), "100");
  // await transferInKaia(localStorage.getItem("privateKey"), "0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9", "100");
  getKaiaBalance(localStorage.getItem("address"));
  getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9");
  return;
};
// 使用dapp sdk进行授权以及质押
const approveAndDepositWithDapp = async (amount: string) => {
  try {
    getKaiaBalance(globalStore.address);
    getTokenBalance(globalStore.address);
    await approveTokenForDeposit(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, amount);
    await depositWithDepositContract(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, globalStore.address, amount);
    getKaiaBalance(globalStore.address);
    getTokenBalance(globalStore.address);
  } catch (error) {
    console.log(error);
  }
};
const kaiaTransferTest = async () => {
  if (import.meta.env.VITE_ENV === "PROD") {
    // 测试线上环境liff账号往开发环境账号转账
    Promise.all([getKaiaBalance(globalStore.address), getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9")])
      .then(async ([kaia1, kaia2]) => {
       console.log("kaia1", kaia1);
       console.log("kaia2", kaia2);
       await transferInKaia("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9", "10");
       Promise.all([getKaiaBalance(globalStore.address), getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9")])
        .then(([kaia1, kaia2]) => {
        console.log("kaia1", kaia1);
        console.log("kaia2", kaia2);
        });
      });
    // await getKaiaBalance(globalStore.address);
    // await getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9");
    // await transferInKaia("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9", "10");
    // await getKaiaBalance(globalStore.address);
    // await getKaiaBalance("0xB8A2Db016c733D46121c4f2CDD223E8dab93e5B9");
  } else {
    // 开发环境账号往liff账号转账
    Promise.all([getKaiaBalance(globalStore.address), getKaiaBalance("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6")])
      .then(async ([kaia1, kaia2]) => {
       console.log("kaia1", kaia1);
       console.log("kaia2", kaia2);
       await transferInKaia("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6", "10");
       Promise.all([getKaiaBalance(globalStore.address), getKaiaBalance("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6")])
        .then(([kaia1, kaia2]) => {
        console.log("kaia1", kaia1);
        console.log("kaia2", kaia2);
        });
      });
    // await getKaiaBalance(globalStore.address);
    // await getKaiaBalance("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6");
    // await transferInKaia("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6", "10");
    // await getKaiaBalance(globalStore.address);
    // await getKaiaBalance("0x841504DF55111CE4DF6d3ce28A6A90dEe71640b6");
  }
}
const clickBalance = async () => {
  // kaiaTransferTest();

  await getDepositAmount(globalStore.address, "USDT");
  await getDepositAmount(globalStore.address, "KAIA");
  await getPoolAmount("USDT");
  await getPoolAmount("KAIA");
  await getKaiaBalance(globalStore.address);
  await getTokenBalance(globalStore.address);
  await gasForApproveTokenForDeposit(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, "10");
  await approveTokenForDeposit(import.meta.env.VITE_TOKEN_PRIZE_POOL_ADDRESS, "10");
  await gasForDepositWithDepositContract(globalStore.address, "10", "USDT");
  await depositWithDepositContract(globalStore.address, "10", "USDT");
  await getDepositAmount(globalStore.address, "USDT");
  await withdrawWithDepositContract(globalStore.address, "10", "USDT");
  await getDepositAmount(globalStore.address, "USDT");
  await getDepositAmount(globalStore.address, "KAIA");
  await getPoolAmount("USDT");
  await getPoolAmount("KAIA");
  await getKaiaBalance(globalStore.address);
  await getTokenBalance(globalStore.address);
};
const openLineWallet = () => {
  liff.openWindow({
    url: "https://blockchain-wallet.line.me", // LINE Blockchain Wallet 的 URL
    external: true, // 在外部浏览器中打开
  });
};
const popoverShow = ref(false);
const popoverRef = ref();
const popoverBtnRef = ref();
const handlePopover = () => {
  popoverShow.value = !popoverShow.value;
};
useClickAway([popoverRef, popoverBtnRef], () => {
  if (popoverShow.value === true) {
    popoverShow.value = false;
  }
});
const handlePopoverItem = (type: string) => {
  console.log("handlePopoverItem", type);
  // popoverShow.value = false;
  router.push(`/${type}`);
};
</script>

<template>
  <div class="page-wrap">
    <div class="header">
      <div
        class="header-left"
        @click="router.push('/profile')"
      >
        <img
          :src="globalStore.userInfo.avatar || avatar"
          class="product-img"
        />
        <div class="text-content">
          {{ globalStore.userInfo.nickname }}
        </div>
      </div>
      <div
        style="visibility: hidden"
        class="header-right"
      >
        <svg-icon
          name="icon-language"
          size="16px"
        />

        <span class="current-language">EN</span>
      </div>
    </div>
    <div class="content">
      <div class="content-box-yellow">
        <div class="inner-color">
          <div
            class="balance-title"
            @click="clickBalance"
          >
            {{ $t("home.WalletBalance") }}
          </div>
          <div class="text-list-wrap">
            <div class="balance-item">
              <svg-icon
                name="icon-ustd"
                className="van-img"
              />
              <span class="balance-item-txt">{{
                formatAmount(Number(globalStore.balanceInfo.USDT.balance) + Number(globalStore.balanceInfo.USDT.savings))
              }}</span>
              <svg-icon
                name="icon-info"
                size="16px"
                @click="showBalanceInfo('USDT')"
              />
            </div>
            <div class="balance-item">
              <svg-icon
                name="icon-kaia"
                className="van-img"
              />
              <span class="balance-item-txt">{{
                formatAmount(Number(globalStore.balanceInfo.KAIA.balance) + Number(globalStore.balanceInfo.KAIA.savings))
              }}</span>
              <svg-icon
                name="icon-info"
                size="16px"
                @click="showBalanceInfo('KAIA')"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="space-h-16">
        <div class="text-title">{{ $t("home.prizePool") }}</div>
        <div class="content-box">
          <div class="box-top">
            <div class="box-title">{{ $t("home.totalPrizePool") }}</div>
            <div class="box-num">${{ prizePoolInfo.totalPrizePool }}</div>
          </div>

          <div class="box-center">
            <div class="center-label">{{ $t("home.NextDrawOpenIn") }}</div>
            <div class="center-time">
              <van-count-down
                :time="prizePoolInfo.nextDrawOpenIn"
                format="HH:mm:ss"
              >
                <template #default="timeData">
                  <div class="time-inner">
                    <span class="block">{{ formatTime(timeData.hours) }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{ formatTime(timeData.minutes) }}</span>
                    <span class="colon">:</span>
                    <span class="block">{{ formatTime(timeData.seconds) }}</span>
                  </div>
                </template>
              </van-count-down>
            </div>
          </div>
          <Progress
            :percentage="prizePoolInfo.progress"
            bg-color="linear-gradient(90deg, #10D260 0%, #65E01C 100%)"
          />
          <button
            class="btn-main"
            @click="router.push('/pool')"
          >
            {{ $t("home.JoinNow") }}
          </button>
        </div>
      </div>

      <div class="space-h-16">
        <div class="text-title">{{ $t("home.AvailableRewards") }}</div>
        <div class="content-box">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="box-top">
              <div class="img-num-wrap">
                <svg-icon
                  name="img-points"
                  class="product-img"
                  size="36px"
                />
                <span class="img-num">x{{ globalStore.availableRewards.points }}</span>
              </div>
              <div class="main-text">{{ $t("home.Points") }}</div>
            </div>
            <div class="box-top">
              <div class="img-num-wrap">
                <svg-icon
                  name="img-badges"
                  class="product-img"
                  size="36px"
                />

                <span class="img-num">x{{ globalStore.availableRewards.badges }}</span>
              </div>
              <div class="main-text">{{ $t("home.Badges") }}</div>
            </div>
          </div>

          <button
            class="btn-main"
            @click="router.push('/rewards')"
          >
            {{ $t("home.ClaimNow") }}
          </button>
        </div>
      </div>
    </div>
    <div
      v-show="popoverShow"
      ref="popoverRef"
      class="popover-wrap"
    >
      <div class="popover-content">
        <div
          class="popover-item"
          @click="handlePopoverItem('deposit')"
        >
          <svg-icon
            name="img-deposit"
            class="popover-img"
          />
          <span class="popover-text">{{ $t("home.Deposit") }}</span>
        </div>
        <div
          class="popover-item"
          @click="handlePopoverItem('withdraw')"
        >
          <svg-icon
            name="img-withdraw"
            class="popover-img"
          />
          <span class="popover-text">{{ $t("common.Withdraw") }}</span>
        </div>
      </div>
    </div>
    <!-- <button
      ref="popoverBtnRef"
      class="btn-add"
      @click="handlePopover"
    >
      <van-icon
        name="plus"
        size="24"
        color="#fff"
      />
    </button> -->
    <van-overlay
      :show="showInfo"
      class-name="balance-dialog"
    >
      <div class="content-box">
        <div class="balance-title">
          <span>{{ infoType }} {{ $t("home.Balance") }}</span>
          <van-icon
            name="cross"
            size="20"
            color="#A1A1AA"
            @click="hiddenInfo"
          />
        </div>
        <div class="text-list-wrap">
          <div class="text-list-row">
            <span class="label">{{ $t("common.WalletAddress") }}</span>
            <span class="value">
              <span>{{ formatWalletAddress(globalStore.address || "") }}</span>
              <svg-icon
                name="icon-copy"
                className="img-copy"
                @click="copyAddress(formatWalletAddress(globalStore.address))"
              />
            </span>
          </div>
          <div class="text-list-row">
            <span class="label">{{ $t("home.Balance") }}</span>
            <span class="value">
              <svg-icon
                :name="infoIcon"
                class="van-img"
              />
              {{ globalStore.balanceInfo[infoType].balance }}</span
            >
          </div>
        </div>

        <div class="text-list-wrap">
          <div class="text-list-row">
            <span class="label">{{ $t("home.Savings") }}</span>
            <span class="value">
              <svg-icon
                :name="infoIcon"
                class="van-img"
              />

              {{ globalStore.balanceInfo[infoType].savings }}</span
            >
          </div>
          <div class="text-list-row">
            <span class="label">{{ $t("home.LotteryWinnings") }}</span>
            <span class="value">
              <svg-icon
                :name="infoIcon"
                class="van-img"
              />
              {{ globalStore.balanceInfo[infoType].drawRewards }}</span
            >
          </div>
        </div>
        <div class="balance-footer">
          <button
            class="btn-main"
            @click="hiddenInfo"
          >
            {{ $t("common.Close") }}
          </button>
        </div>
      </div>
    </van-overlay>

    <CustomToast
      v-model:show="showCopyToast"
      :message="copyToastText"
    />
  </div>
</template>

<style scoped lang="less">
.balance-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  .content-box {
    box-sizing: content-box;
    width: 314px;
    // height: 204px;
    padding: 20px;
    border-radius: 24px;
    border: 3px solid var(--LS-Gray-07, #18181b);
    background: #fff;
    box-shadow: 0px 6px 0px 0px #18181b;

    .balance-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: #18181b;
      margin-bottom: 16px;
    }
    .text-list-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-radius: 12px;
      background: #f4f4f5;
      padding: 12px;
      margin: 16px auto;

      .text-list-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 20px;
        .value {
          display: flex;
          align-items: center;
          .van-img {
            width: 18px;
            height: 18px;
            border-radius: 100%;
            margin-right: 6px;
          }
          .img-copy {
            margin-left: 6px;
          }
        }
      }
    }
  }
}
.page-wrap {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff9e1 0%, #fff 100%);
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  color: #18181b;
  font-weight: 500;
  font-size: 14px;

  .header {
    .header-left {
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
    .header-right {
      padding: 0px 12px;
      border-radius: 10px;
      border: 2px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
    }
  }
}
.popover-wrap {
  position: fixed;
  right: 20px;
  bottom: 120px;
  width: 160px;
  padding: 6px;
  border-radius: 20px;
  background: var(--LS-Gray-07, #18181b);

  /* 阴影/01 */
  box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.12);

  .popover-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    height: 32px;
    box-sizing: content-box;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    background: #212124;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .popover-img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 10px;
    }
    .popover-text {
      flex: 1;
      color: var(--LS-Gray-01, #fff);
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      text-align: left;
    }
  }
}
.btn-add {
  position: fixed;
  right: 20px;
  bottom: 70px;
  width: 48px;
  height: 48px;
  background: var(--LS-Gray-07, #18181b);
  border-radius: 50%;
  z-index: 999;
}

.space-h-16 {
  margin: 32px 0;
}
.text-title {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 122.222% */
  color: #18181b;
}
.content {
  margin-top: 8px;
}
.content-box-yellow {
  box-sizing: content-box;
  padding: 16px;
  border-radius: 24px;
  border: 3px solid var(--LS-Primary-02, #ddb305);
  background: var(--LS-Primary-01, #fee719);
  box-shadow: 0px 6px 0px 0px #ddb305;
  .inner-color {
    padding: 12px 16px 16px 16px;
    border-radius: 16px;
    background-color: #fff;

    .balance-title {
      font-size: 14px;
      line-height: 20px; /* 142.857% */
      color: var(--LS-Gray-05, #83838f);
      margin-bottom: 12px;
    }
    .text-list-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .balance-item {
        width: 150px;
        display: flex;
        align-items: center;

        .van-img {
          width: 24px;
          height: 24px;
          border-radius: 100%;
        }
        .balance-item-txt {
          margin: 0 6px;
          font-size: 20px;
          line-height: 24px;
          font-weight: 700;
          color: #3f3f46;
        }
      }
    }
  }
}

.content-box {
  padding: 16px;
  margin-top: 12px;
  border-radius: 24px;
  border: 3px solid var(--LS-Gray-07, #18181b);
  background: #fff;
  box-shadow: 0px 6px 0px 0px #18181b;

  .box-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    border: 2px solid rgba(24, 24, 27, 0.04);
    padding: 12px 8px 10px 8px;

    .box-title {
      line-height: 20px;
      color: #83838f;
      margin-bottom: 6px;
    }
    .box-num {
      color: #00ba4d;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: 38px; /* 118.75% */
    }
  }
  .box-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0 10px 0;
    height: 30px;
    line-height: 30px;
    font-size: 16px;

    .center-label {
      color: #83838f;
    }

    .time-inner {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      text-align: center;

      .block {
        padding: 6px;
        width: 30px;
        border-radius: 8px;
        background: rgba(24, 24, 27, 0.08);
      }
      .colon {
        width: 16px;
        color: #83838f;
        font-family: Nunito;
        font-weight: 700;
      }
    }
  }

  .img-num-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    .img-num {
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      color: var(--LS-Primary-02, #ddb305);
      margin-left: 8px;

      &.color-blue-01 {
        color: var(--LS-Primary-01, #2d87fa);
      }
    }
  }
  .main-text {
    color: var(--LS-Gray-05, #83838f);
  }
}
</style>
