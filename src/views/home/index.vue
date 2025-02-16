<script setup lang="ts" name="Home">
import liff from "@line/liff";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
// import { WalletType, PaymentProvider } from "@linenext/dapp-portal-sdk";
import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";
import qs from "qs";
import { useRouter } from "vue-router";
import { useClickAway } from "@vant/use";
import userAvatar from "@/assets/user-avatar.svg";
import iconLanguage from "@/assets/icon-language.svg";
import iconInfo from "@/assets/icon-info.svg";
import ustd from "@/assets/icon-ustd.svg";
import kaia2 from "@/assets/icon-kaia.svg";
import imgBadges from "@/assets/img-badges.svg";
import imgPoints from "@/assets/img-points.svg";
const router = useRouter();
const showInfo = ref(false);
const infoType = ref("");
const infoIcon = ref("");
const showBalanceInfo = (type: string) => {
  showInfo.value = true;
  infoType.value = type;
  infoIcon.value = type === "USDT" ? ustd : kaia2;
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

const userInfo = reactive({
  avatar: userAvatar,
  nickName: "Arthorn",
});
const time = ref(13600 * 1000);
const formatTime = (value) => {
  return value < 10 ? `0${value}` : value;
};
const lineLogin = () => {
  console.log("click");
  const line_auth = "https://access.line.me/oauth2/v2.1/authorize";
  const auth_params = {
    response_type: "code",
    client_id: "2006818858",
    redirect_uri: window.location.href, // 在LINE Developers Console上注册的回调 URL 的 URL 编码字符串。您可以添加任何查询参数。
    state: "STATE", // 用于防止跨站点请求伪造的唯一字母数字字符串. 您的网络应用应为每个登录会话生成一个随机值。这不能是 URL 编码的字符串。
    scope: "profile openid email", // 向用户请求的权限,查询范围可以看官网(https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes)
  };
  // 这里使用了第三方库qs来处理参数
  const paramsString = qs.stringify(auth_params);
  console.log(line_auth, paramsString);
  window.location.href = `${line_auth}?${paramsString}`;
};
const lineLoginLiff = async () => {
  liff
    .init({
      liffId: "2006818858-1a2PrWjY",
      withLoginOnExternalBrowser: true,
    })
    .then(async () => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const DecodedToken = await liff.getDecodedIDToken();
        console.log(DecodedToken);
        liff.getProfile().then((profile) => {
          console.log(profile);
        });
      }
    });
  // if (!liff.isLoggedIn()) {
  //   liff.login();
  // } else {
  //   const DecodedToken = await liff.getDecodedIDToken();
  //   const profile = await liff.getProfile();
  //   console.log(DecodedToken, profile);
  // }
};
const getWallet = async () => {
  const sdk = await DappPortalSDK.init({
    clientId: import.meta.env.VITE_LINE_CLIENT_ID || "",
  });
  const walletProvider = sdk.getWalletProvider();
  const web3Provider = new w3(walletProvider);
  const accounts = await web3Provider.send("kaia_requestAccounts", []);
  const pProvider = sdk?.getPaymentProvider();
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
        <div
          class="text-content"
          @click="lineLoginLiff"
        >
          {{ userInfo.nickName }}
        </div>
      </div>
      <div
        class="header-right"
        @click="getWallet"
      >
        <van-icon
          :name="iconLanguage"
          size="16"
        />
        <span class="current-language">EN</span>
      </div>
    </div>
    <div class="content">
      <div class="content-box-yellow">
        <div class="inner-color">
          <div class="balance-title">{{ $t("home.WalletBalance") }}</div>
          <div class="balance-content">
            <div class="balance-item">
              <van-image
                width="24"
                height="24"
                fit="cover"
                :src="ustd"
                round
                class="van-img"
              />
              <span class="balance-item-txt">11.12K</span>
              <van-icon
                :name="iconInfo"
                color="#A1A1AA"
                size="16px"
                @click="showBalanceInfo('USDT')"
              />
            </div>
            <div class="balance-item">
              <van-image
                width="24"
                height="24"
                fit="cover"
                :src="kaia2"
                round
                class="van-img"
              />
              <span class="balance-item-txt">1.20K</span>
              <van-icon
                :name="iconInfo"
                color="#A1A1AA"
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
            <div class="box-num">$123,876,323</div>
          </div>

          <div class="box-center">
            <div class="center-label">{{ $t("home.NextDrawOpenIn") }}</div>
            <div class="center-time">
              <van-count-down
                :time="time"
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
            :percentage="55"
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
                <van-image
                  width="36"
                  height="36"
                  fit="cover"
                  :src="imgPoints"
                  round
                  class="product-img"
                />
                <span class="img-num">x13</span>
              </div>
              <div class="main-text">{{ $t("home.Points") }}</div>
            </div>
            <div class="box-top">
              <div class="img-num-wrap">
                <van-image
                  width="36"
                  height="36"
                  fit="cover"
                  :src="imgBadges"
                  round
                  class="product-img"
                />
                <span class="img-num color-blue-01">x13</span>
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
          <img
            class="popover-img"
            src="@/assets/img-deposit.svg"
            alt="deposit"
          />
          <span class="popover-text">{{ $t("home.Deposit") }}</span>
        </div>
        <div
          class="popover-item"
          @click="handlePopoverItem('withdraw')"
        >
          <img
            class="popover-img"
            src="@/assets/img-withdraw.svg"
            alt="withdraw"
          />
          <span class="popover-text">{{ $t("home.Withdraw") }}</span>
        </div>
        <div
          class="popover-item"
          @click="handlePopoverItem('swap')"
        >
          <img
            class="popover-img"
            src="@/assets/img-swap.svg"
            alt="swap"
          />
          <span class="popover-text">{{ $t("home.Swap") }}</span>
        </div>
      </div>
    </div>
    <button
      ref="popoverBtnRef"
      class="btn-add"
      @click="handlePopover"
    >
      <van-icon
        name="plus"
        size="24"
        color="#fff"
      />
    </button>
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

        <div class="balance-content">
          <div class="balance-row">
            <span class="label">{{ $t("home.Balance") }}</span>
            <span class="value">
              <van-image
                fit="cover"
                :src="infoIcon"
                round
                class="van-img"
              />
              {{ balanceInfo[infoType].balance }}</span
            >
          </div>
          <div class="balance-row">
            <span class="label">{{ $t("home.Savings") }}</span>
            <span class="value">
              <van-image
                fit="cover"
                :src="infoIcon"
                round
                class="van-img"
              />
              {{ balanceInfo[infoType].savings }}</span
            >
          </div>
          <div class="balance-row">
            <span class="label">{{ $t("home.DrawRewards") }}</span>
            <span class="value">
              <van-image
                fit="cover"
                :src="infoIcon"
                round
                class="van-img"
              />
              {{ balanceInfo[infoType].drawRewards }}</span
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
    height: 204px;
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
    .balance-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-radius: 12px;
      background: #f4f4f5;
      padding: 12px;
      margin: 16px auto;

      .balance-row {
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
    .balance-content {
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
      font-family: "GenSenRounded2 TW";
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
