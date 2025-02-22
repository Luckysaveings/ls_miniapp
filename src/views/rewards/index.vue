<script setup lang="ts" name="Rewards">
import liff from "@line/liff";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import userAvatar from "@/assets/user-avatar.svg";
import TaskItem from "./components/task-item.vue";
import { getTaskList, getAchievement } from "@/api/index";
const router = useRouter();
const userInfo = reactive({
  avatar: userAvatar,
  nickName: "Arthorn",
});
const inviteLink = ref("");
const showAllDailyTasks = ref(false);
const showAllPopups = ref(false);
const dailyTasks = ref([]);
const popups = ref([]);
const achievements = reactive({
  points: 0,
  badges: 0,
});
const customToast = (msg: string) => {
  showToast({
    message: msg,
    overlay: true,
    closeOnClick: true,
    closeOnClickOverlay: true,
    duration: 3000,
    className: "custom-toast content-box",
  });
};
// 生成邀请链接
const generateInviteLink = () => {
  liff.permanentLink.createUrlBy("https://line.luckysavings.io/home?inviteCode=abcdefg").then((permanentLink) => {
    console.log("permanentLink:", permanentLink);
    inviteLink.value = permanentLink;
  });
  return;
};
onMounted(() => {
  getTaskList().then((res) => {
    const list = (res.data && res.data.list) || [];
    dailyTasks.value = list.filter((item) => item.type === 0);
    popups.value = list.filter((item) => item.type === 1);
  });
  getAchievement().then((res) => {
    if (res.data) {
      achievements.points = res.data.point || 0;
      achievements.badges = res.data.badge || 0;
    }
  });
});
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
          src="@/assets/icon-jiangbei-2.svg"
          alt="jiangbei"
          @click="router.push('/ranking')"
        />
        <img
          class="img-header-right"
          src="@/assets/icon-upload.svg"
          alt="upload"
          @click="generateInviteLink"
        />
      </div>
    </div>

    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("rewards.YourAchievements") }}</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="customToast('Points and badges will become redeemable after launchpad open.')"
        />
      </div>
      <div class="content-box-yellow achievement-box">
        <div class="inner-color">
          <div class="achievement-item">
            <img
              class="img-icon"
              src="@/assets/img-points.svg"
              alt="points"
            />
            <div class="achievement-text">
              <span>x{{ achievements.points }}</span>
            </div>
          </div>
          <div class="achievement-item">
            <img
              class="img-icon"
              src="@/assets/img-badges.svg"
              alt="badges"
            />
            <div class="achievement-text right-text">
              <span>x{{ achievements.badges }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("rewards.DailyTasks") }}</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="customToast('Will refresh daily at 00:00 (UTC+0).')"
        />
      </div>
      <TaskItem
        v-for="(item, index) in dailyTasks"
        v-show="showAllDailyTasks || index < 2"
        :key="item.title"
        :item="item"
      />
      <div
        v-if="dailyTasks.length > 2 && !showAllDailyTasks"
        class="more-tasks"
        @click="showAllDailyTasks = true"
      >
        <span>{{ $t("rewards.MoreTasks") }}</span>
        <van-icon
          name="arrow-down"
          size="16px"
          color="#83838F"
        />
      </div>
    </div>
    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("rewards.Popups") }}</span>
        <img
          class="img-icon"
          src="@/assets/icon-info.svg"
          alt="info"
          @click="customToast('One-time tasks cannot be completed repeatedly, and tasks will be updated from time to time.')"
        />
      </div>
      <TaskItem
        v-for="(item, index) in popups"
        v-show="showAllPopups || index < 2"
        :key="`${item.title}-${item.points}`"
        :item="item"
      />
      <div
        v-if="popups.length > 2 && !showAllPopups"
        class="more-tasks"
        @click="showAllPopups = true"
      >
        <span>{{ $t("rewards.MoreTasks") }}</span>
        <van-icon
          name="arrow-down"
          size="16px"
          color="#83838F"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-wrap {
  padding: 0 16px 12px 16px;
}
.content-box-yellow {
  box-sizing: content-box;
  padding: 16px;
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
      padding: 12px;
      border-radius: 12px;
      background-color: #fff;
      .img-icon {
        width: 32px;
        height: 32px;
        margin-right: 6px;
      }
      .achievement-text {
        font-size: 18px;
        font-weight: 700;
        line-height: 22px;

        &.right-text {
          color: var(--LS-Secondary-Blue-01, #2d87fa);
        }
      }
    }
  }
}
.more-tasks {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  margin-top: 12px;
  padding: 6px 0;
  text-align: center;
  color: var(--LS-Gray-05, #83838f);
  cursor: pointer;
}
</style>
