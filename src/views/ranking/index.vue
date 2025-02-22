<script setup lang="ts" name="Ranking">
import { useRouter } from "vue-router";
import { getRanking, getMyRanking, getAchievement } from "@/api/index";

import winner1 from "@/assets/icon-winner-1.svg";
import winner2 from "@/assets/icon-winner-2.svg";
import winner3 from "@/assets/icon-winner-3.svg";
const tierIcons = [winner1, winner2, winner3];

const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const selectedType = ref("points");
const changeType = (t) => {
  selectedType.value = t;
  const type = t === "points" ? 0 : 1;  
  fetchData(type);
};
const selfRanking = reactive({
  no: 0,
  selfNum: 0,
});
const tableData = ref([
  // { no: "1", username: "John Doe", point: "1000" },
  // { no: "2", username: "Jane Smith", point: "900" },
  // { no: "3", username: "Alice Johnson", point: "800" },
  // { no: "4", username: "Bob Brown", point: "700" },
  // { no: "5", username: "Charlie Davis", point: "600" },
  // { no: "6", username: "David Wilson", point: "500" },
  // { no: "7", username: "Eva Martinez", point: "400" },
  // { no: "8", username: "Frank Garcia", point: "300" },
  // { no: "9", username: "Grace Lopez", point: "200" },
  // { no: "10", username: "Henry Lopez", point: "100" },
]);

const fetchData = (type) => {
  // 0-积分point，1-徽章badge
  getRanking({
    type,
  }).then(res => {
    const list = res.data && res.data.list || [];
    tableData.value = list;
  })
  
  getMyRanking({
    type,
  }).then(res => {
    console.log("res任务-getMyRanking", res)
    selfRanking.no = res.data && res.data.no || 0;
  })
  getAchievement().then(res => {
    console.log("res任务-getAchievement", res)
    if (res.data) {
      const selfNum = type === 0 ? res.data.point : res.data.badge;
      selfRanking.selfNum = selfNum || 0;
    }
  })
}
onMounted(() => {
  fetchData(0);
})
</script>

<template>
  <div
    class="page-wrap"
    :class="selectedType === 'badges' ? 'badges-wrap' : 'points-wrap'"
  >
    <van-nav-bar
      title="Ranking"
      left-arrow
      class="nav-bar-wrap"
      :border="false"
      @click-left="onClickLeft"
    />

    <div class="page-content">
      <div class="type-select content-box">
        <div
          class="type-btn"
          :class="{ active: selectedType === 'points' }"
          @click="changeType('points')"
        >
          {{ $t("ranking.Points") }}
        </div>
        <div
          class="type-btn"
          :class="{ active: selectedType === 'badges' }"
          @click="changeType('badges')"
        >
          {{ $t("ranking.Badges") }}
        </div>
      </div>

      <div class="module-item">
        <div class="content-box-yellow achievement-box">
          <div class="inner-color">
            <div class="achievement-item">
              <div class="item-top">{{ $t("ranking.YourRanking") }}</div>
              <div class="item-bottom">
                <span>No. {{ selfRanking.no }}</span>
              </div>
            </div>
            <div class="achievement-item">
              <div class="item-top">{{ selectedType === "points" ? $t("ranking.Points") : $t("ranking.Badges") }}</div>
              <div class="item-bottom">
                <span>{{ selfRanking.selfNum }}</span>
                <img
                  class="img-icon"
                  :src="selectedType === 'points' ? 'src/assets/img-points.svg' : 'src/assets/img-badges.svg'"
                  alt="badges"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="module-item">
        <div class="module-title">
          <span>{{ $t("ranking.Place") }}</span>
        </div>
        <div class="content-box table-box">
          <div class="table-title">
            <div class="title-no">{{ $t("ranking.Place") }}</div>
            <div class="title-username">{{ $t("ranking.Name") }}</div>
            <div class="title-points">{{ $t("ranking.Points") }}</div>
          </div>
          <div
            v-for="item in tableData"
            :key="item.no"
            class="table-item"
          >
            <div class="item-no">
              <img
                v-if="item.no <= 3"
                class="img-icon"
                :src="tierIcons[item.no - 1]"
                alt="tier"
              />
              <span
                v-else
                class="no-text"
                >{{ item.no }}</span
              >
            </div>
            <div class="item-username">{{ item.username }}</div>
            <div class="item-points">{{ item.point }}</div>
          </div>
        </div>
        <div class="tip-box">
          <div class="tip-text">{{ $t("ranking.TipText") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-wrap {
  &.badges-wrap {
    background: linear-gradient(180deg, #e4f8ff 0%, #fff 100%);
    .type-select {
      .type-btn {
        &.active {
          color: var(--LS-Gray-01, #fff);
          background: var(--LS-Secondary-Blue-01, #2d87fa);
        }
      }
    }
    .achievement-box {
      border-radius: 24px;
      border: 3px solid var(--LS-Secondary-Blue-01, #2d87fa);
      background: #70b8ff;
      box-shadow: 0px 6px 0px 0px #2d87fa;
      .inner-color {
        color: var(--LS-Secondary-Blue-01, #2d87fa);
      }
    }
  }
}
.type-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  .type-btn {
    width: calc(50% - 6px);
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    border-radius: 14px;
    background: #fff;
    &.active {
      background: var(--LS-Primary-02, #f9e100);
    }
  }
}

.achievement-box {
  margin-top: 32px;
  box-sizing: content-box;
  padding: 12px;
  border-radius: 24px;
  border: 3px solid var(--LS-Primary-02, #ddb305);
  background: var(--LS-Primary-01, #fee719);
  box-shadow: 0px 6px 0px 0px #ddb305;
  .inner-color {
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--LS-Primary-02, #ddb305);

    .achievement-item {
      width: calc(50% - 6px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 12px;
      border-radius: 12px;
      background-color: #fff;
      .item-top {
        font-weight: 500;
        line-height: 20px;
        color: var(--LS-Gray-05, #83838f);
      }
      .item-bottom {
        margin-top: 6px;
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;

        .img-icon {
          width: 24px;
          height: 24px;
          margin-left: 6px;
        }
      }
    }
  }
}
.module-item {
  .content-box {
    padding: 24px 32px;

    &.table-box {
      
      .title-no,
      .item-no {
          width: 22%;
        }
        .title-username,
        .title-points,
        .item-username,
        .item-points  {
          width: 39%;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
        }

      .table-title {
        display: flex;
        align-items: center;
        color: var(--LS-Gray-05, #83838f);
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;

      }
      .table-item {
        margin: 14px 0;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;

        &:last-child {
          margin-bottom: 0;
        }
        .item-no {
          .img-icon {
            width: 24px;
            height: 24px;
          }
          .no-text {
            display: inline-block;
            width: 24px;
            text-align: center;
          }
        }
      }
    }
  }
  .tip-box {
    margin-top: 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--LS-Gray-05, #83838f);
  }
}
</style>
