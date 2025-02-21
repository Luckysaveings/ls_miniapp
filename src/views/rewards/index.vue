<script setup lang="ts" name="Rewards">
// import { reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import userAvatar from "@/assets/user-avatar.svg";
import TaskItem from "./components/task-item.vue";
import { getTaskList } from "@/api/index";
const router = useRouter();
const userInfo = reactive({
  avatar: userAvatar,
  nickName: "Arthorn",
});
const dailyTasks = ref([
  {
    img: "/src/assets/tasks/daily-tasks-1.svg",
    title: "Login LuckySavings",
    status: true,
    points: 11,
  },
  {
    img: "/src/assets/tasks/daily-tasks-2.svg",
    title: "Daily Saving",
    status: false,
    points: 12,
  },
  {
    img: "/src/assets/tasks/daily-tasks-3.svg",
    title: "Daily Invite",
    status: false,
    points: 13,
  },
  {
    img: "/src/assets/tasks/daily-tasks-4.svg",
    title: "Daily Drawing",
    status: true,
    points: 14,
  },
]);
const popups = reactive([
  {
    img: "/src/assets/tasks/popups-tasks-1.svg",
    title: "Join the LINE channel",
    status: true,
    points: 14,
  },
  {
    img: "/src/assets/tasks/popups-tasks-2.svg",
    title: "Echo survey",
    status: false,
    points: 15,
  },
]);
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
onMounted( () => {
  getTaskList().then(res => {
    const list = res.data && res.data.list || [];
    dailyTasks.value = list;
    console.log("res任务", res)
  })
})
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
              <span>x2,135</span>
            </div>
          </div>
          <div class="achievement-item">
            <img
              class="img-icon"
              src="@/assets/img-badges.svg"
              alt="badges"
            />
            <div class="achievement-text right-text">
              <span>x2,135</span>
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
        v-for="item in dailyTasks"
        :key="item.title"
        :item="item"
      />
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
        v-for="item in popups"
        :key="`${item.title}-${item.points}`"
        :item="item"
      />
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
.module-item {
}
</style>
