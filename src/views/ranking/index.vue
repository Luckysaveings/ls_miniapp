<script setup lang="ts" name="Ranking">
import { useRouter } from "vue-router";
const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const selectedType = ref("points");
const changeType = (type) => {
  selectedType.value = type;
};
const tableData = ref([
  { place: "1", name: "John Doe", points: "1000" },
  { place: "2", name: "Jane Smith", points: "900" },
  { place: "3", name: "Alice Johnson", points: "800" },
  { place: "4", name: "Bob Brown", points: "700" },
  { place: "5", name: "Charlie Davis", points: "600" },
  { place: "6", name: "David Wilson", points: "500" },
  { place: "7", name: "Eva Martinez", points: "400" },
  { place: "8", name: "Frank Garcia", points: "300" },
  { place: "9", name: "Grace Lopez", points: "200" },
  { place: "10", name: "Henry Lopez", points: "100" },
]);
import winner1 from "@/assets/icon-winner-1.svg";
import winner2 from "@/assets/icon-winner-2.svg";
import winner3 from "@/assets/icon-winner-3.svg";
const tierIcons = [winner1, winner2, winner3];
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
                <span>No.330</span>
              </div>
            </div>
            <div class="achievement-item">
              <div class="item-top">{{ selectedType === "points" ? $t("ranking.Points") : $t("ranking.Badges") }}</div>
              <div class="item-bottom">
                <span>112,241</span>
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
            <div class="title-place">{{ $t("ranking.Place") }}</div>
            <div class="title-name">{{ $t("ranking.Name") }}</div>
            <div class="title-points">{{ $t("ranking.Points") }}</div>
          </div>
          <div
            v-for="item in tableData"
            :key="item.place"
            class="table-item"
          >
            <div class="item-place">
              <img
                v-if="item.place <= 3"
                class="img-icon"
                :src="tierIcons[item.place - 1]"
                alt="tier"
              />
              <span
                v-else
                class="place-text"
                >{{ item.place }}</span
              >
            </div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-points">{{ item.points }}</div>
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
      .table-title {
        display: flex;
        align-items: center;
        color: var(--LS-Gray-05, #83838f);
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;

        .title-place {
          width: 22%;
        }
        .title-name {
          flex: 1;
          text-align: center;
        }
        .title-points {
          flex: 1;
          text-align: center;
        }
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
        .item-place {
          width: 22%;
          .img-icon {
            width: 24px;
            height: 24px;
          }
          .place-text {
            display: inline-block;
            width: 24px;
            text-align: center;
          }
        }
        .item-name {
          flex: 1;
          text-align: center;
        }
        .item-points {
          flex: 1;
          text-align: center;
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
