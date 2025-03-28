<template>
  <div class="page-wrap">
    <van-nav-bar
      title="Deposit History"
      left-arrow
      class="nav-bar-wrap"
      :border="false"
      @click-left="onClickLeft"
    />

    <van-cell-group
      class="deposit-item-wrap"
      :border="false"
      v-for="depositItem in historyList"
      :key="depositItem.id"
    >
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.DepositAddress')"
        :value="depositItem.wallet"
      />
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.TXID')"
        :value="depositItem.tx"
      />
      <van-cell
        class="cell-custom-history"
        :title="$t('common.Amount')"
      >
        <template #value>
          <span class="">
            <span>+{{ depositItem.amount }}</span>
            <span class="unit">{{ depositItem.asset }}</span>
          </span>
        </template>
      </van-cell>
      <van-cell
        class="cell-custom-history"
        :title="$t('deposit.Time')"
        :value="formatDateTime(depositItem.CreatedAt)"
      />
    </van-cell-group>
  </div>
</template>

<script setup name="DepositHistory">
import { useRouter } from "vue-router";
import { ref } from "vue";
import dayjs from "dayjs";
import { getRechargeRecord } from "@/api/index";
const router = useRouter();
const onClickLeft = () => {
  router.back();
};
// 添加日期格式化函数
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  return dayjs(dateTimeStr).format("YYYY/MM/DD HH:mm:ss");
};
const historyList = ref([]);
onMounted(() => {
  getRechargeRecord().then((res) => {
    const list = (res.data && res.data.list) || [];
    historyList.value = list;
  });
});
</script>

<style scoped lang="scss">
.page-wrap {
  padding: 0px;
  background: #fff !important;
  padding-bottom: 20px;
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
.deposit-item-wrap {
  border-radius: 0 !important;
  border-bottom: 1px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
  padding: 14px 0 !important;

  &:last-child {
    border-bottom: none;
  }
}
.cell-custom-history {
  padding: 6px 16px;
  :deep(.van-cell__title) {
    font-size: 14px;
    font-weight: 400;
    color: var(--LS-Gray-05, #83838f);
    width: 164px;
    flex: none;
    display: block;
  }
  :deep(.van-cell__value) {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    color: var(--LS-Gray-07, #18181b);

    .unit {
      margin-left: 4px;
    }
  }
  &:after {
    border-bottom-width: 0px;
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
