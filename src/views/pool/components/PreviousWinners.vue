<template>
  <van-overlay
    :show="show"
    class-name="custom-dialog"
  >
    <div
      class="content-box"
      :class="`type-${selectedType}`"
    >
      <div class="dialog-title">
        <div class="dialog-title-left">
          <svg-icon
            name="icon-jiangbei-2"
            class="img-icon"
          />

          <span>Previous winners</span>
        </div>
        <van-icon
          name="cross"
          size="20"
          color="#A1A1AA"
          @click="show = false"
        />
      </div>

      <div class="dialog-content no-margin-b">
        <div class="type-select">
          <div
            class="type-btn"
            :class="{ active: selectedType === 'kaia' }"
            @click="changeType('kaia')"
          >
            KAIA Pool
          </div>
          <div
            class="type-btn"
            :class="{ active: selectedType === 'usd' }"
            @click="changeType('usd')"
          >
            USD Pool
          </div>
        </div>
        <div
          v-for="(tier, tierNum) in currentData"
          :key="tierNum"
          :style="{ display: tier.length === 0 ? 'none' : 'block' }"
          class="content-item"
        >
          <div class="content-item-title">
            <svg-icon
              :name="`icon-winner-${tierNum + 1}`"
              class="img-icon"
            />
            <span>Tier {{ tierNum + 1 }} Rewards:</span>
          </div>
          <div class="list">
            <div
              v-for="(item, index) in tier"
              :key="index"
              class="list-item"
            >
              <span class="list-item-name">{{ item.winner }}</span>
              <span class="list-item-value"
                >{{ item.prizeAmount }}
                <span class="list-item-unit"> {{ selectedType === "usd" ? "USD" : "KAIA" }}</span>
              </span>
            </div>
          </div>
          <van-divider
            v-show="tierNum !== currentData.length - 1"
            class="custom-divider"
          />
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<script setup name="PreviousWinnersDialog">
import { getLotteryRecord } from "@/api/index";

const show = ref(false);
const selectedType = ref("usd");
const data = ref({
  usd: [],
  kaia: [],
});
const currentData = ref(data.value[selectedType.value]);
const getWinnerList = (type) => {
  getLotteryRecord({ poolId: type, page: 1, pageSize: 100 }).then((res) => {
    if (res.data) {
      console.log(res.data);
      processWinnerList(res.data.list, type === 2 ? "usd" : "kaia");
    }
  });
};
getWinnerList(1);
// 处理中奖列表的方法
const processWinnerList = (list, type) => {
  const tempTier1 = [];
  const tempTier2 = [];
  const tempTier3 = [];

  // 遍历列表，根据tier将子项分类
  list.forEach((item) => {
    if (item.tier === 1) {
      tempTier1.push(item);
    } else if (item.tier === 2) {
      tempTier2.push(item);
    } else if (item.tier === 3) {
      tempTier3.push(item);
    }
  });

  // 对每个tier的数组按prizeAmount由大到小排序
  tempTier1.sort((a, b) => b.prizeAmount - a.prizeAmount);
  tempTier2.sort((a, b) => b.prizeAmount - a.prizeAmount);
  tempTier3.sort((a, b) => b.prizeAmount - a.prizeAmount);
  data.value[type] = [];
  // 更新previousWinnerList
  data.value[type].push(tempTier1);
  data.value[type].push(tempTier2);
  data.value[type].push(tempTier3);
  currentData.value = data.value[type];
};
/*
 * 显示弹窗
 * @param {string} type: 1: KAIA Pool 2: USD Pool
 */
const showDialog = (type) => {
  selectedType.value = type === "1" ? "kaia" : "usd";
  currentData.value = data.value[selectedType.value];
  nextTick(() => {
    show.value = true;
  });
};
const changeType = (type) => {
  selectedType.value = type;
  // currentData.value = data.value[type];
  getWinnerList(type === "kaia" ? 1 : 2);
};

defineExpose({ showDialog });
</script>
<style scoped lang="scss">
// 弹窗样式

.custom-dialog {
  .dialog-title-left {
    .img-icon {
      margin-right: 6px;
    }
  }

  .content-box {
    &.type-usd {
      .type-btn {
        &.active {
          background: var(--LS-Secondary-Green-01, #06c756);
        }
      }
      .list-item-value {
        color: var(--LS-Secondary-Green-02, #00ba4d);
      }
    }
    &.type-kaia {
      .type-btn {
        &.active {
          background: #fee719;
        }
      }
      .list-item-value {
        color: #ddb305;
      }
    }
  }
  .type-select {
    display: flex;
    width: 100%;
    gap: 12px;
    margin-bottom: 16px;
    border-radius: 12px;
    border: 2px solid var(--LS-Gray-03, #dedee5);
    padding: 4px;

    .type-btn {
      width: calc(50% - 6px);
      text-align: center;
      line-height: 32px;
      border-radius: 10px;
    }
  }
  .content-item {
    width: 100%;
    margin-bottom: 0;
    .content-item-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      margin-bottom: 6px;
    }
    .list {
      margin-bottom: 16px;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 4px;
      }
    }
    .custom-divider {
      border-color: rgba(222, 222, 229, 0.4);
      border-width: 1px 0;
      color: rgba(222, 222, 229, 0.4);
    }
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
