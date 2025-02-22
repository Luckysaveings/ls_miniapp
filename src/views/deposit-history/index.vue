<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Deposit History"
      left-arrow
      class="nav-bar-wrap"
      :border="false"
      @click-left="onClickLeft"
    />

    <van-cell-group :border="false" v-for="depositItem in historyList" :key="depositItem.id">
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.DepositAddress')"
        :value="depositItem.wallet"
      />
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.TXID')"
        :value="depositItem.txid"
      />
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.Amount')"
        :value="depositItem.amount"
      />
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.Time')"
        :value="depositItem.time"
      />
      <van-cell
        :title="$t('deposit.State')"
        class="cell-custom-history"
      >
        <template #value>
          <span class="state-transferred">{{ $t("deposit.Transferred") }}</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { getRechargeRecord } from "@/api/index";
const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const depositItem = ref({
  wallet: "0xb5a8116592b4b4630b93d61ace006482b76d1e28",
  txid: "0xb5a8116592b4b4630b93d61ace006482b76d1e28",
  time: "2025/01/10 02:00:50",
  amount: "+1000 KAIA",
  status: 0,
});
const historyList = ref([]);
onMounted(() => {
  getRechargeRecord().then((res) => {
    console.log("res", res);
    const list = res.data && res.data.list || [];
    historyList.value = list;
  });
});
</script>

<style scoped lang="scss">
.page-wrap {
  padding: 0px;
  background: #fff !important;
}
.transaction-details {
  padding: 16px;
}

.state-transferred {
  color: #00b578;
}

.state-waiting {
  color: #f5a623;
}

.mt-4 {
  margin-top: 16px;
}
.cell-custom-history {
  padding: 6px 16px;
  :deep(.van-cell__title) {
    font-size: 14px;
    font-weight: 400;
    color: var(--LS-Gray-05, #83838f);
  }
  :deep(.van-cell__value) {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    color: var(--LS-Gray-07, #18181b);
  }
  &:after {
    border-bottom: 0px solid var(--LS-Gray-03, #d1d1d6);
  }
}
.title-class {
  font-size: 16px;
  font-weight: 500;
  color: #18181b;
}

.profile-page {
  min-height: 100vh;
  background-color: #fff;
  padding: 32px 16px;
}

:deep(.van-cell__value) {
  color: #8e8e93;
}

:deep(.van-cell-group),
:deep(.van-cell) {
  margin: 0;
  border-radius: 12px;
  background: transparent;
}
</style>
