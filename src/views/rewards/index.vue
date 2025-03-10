<script setup lang="ts" name="Rewards">
import liff from "@line/liff";
import { useRouter } from "vue-router";
import userAvatar from "@/assets/user-avatar.svg";
import TaskItem from "./components/task-item.vue";
import { getTaskList, getAchievement, getLotteryRecord } from "@/api/index";
import { useGlobalStore } from "@/store/globalStore";
import avatar from "@/assets/catAvatar.svg";
import { showToast, showFailToast, showLoadingToast, closeToast } from "vant";
import { showToastBeforeRequest } from "@/utils/index";

// 初始化 Store
const globalStore = useGlobalStore();
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
  liff.permanentLink.createUrlBy("https://line.luckysavings.io/home?inviteCode=" + globalStore.userInfo.promoteCode).then((permanentLink) => {
    console.log("permanentLink:", permanentLink);
    inviteLink.value = permanentLink;
    liff
      .shareTargetPicker(
        [
          {
            type: "text",
            text: inviteLink.value,
          },
        ],
        {
          isMultiple: true,
        }
      )
      .then(function (res) {
        if (res) {
          // succeeded in sending a message through TargetPicker
          console.log(`[${res.status}] Message sent!`);
        } else {
          // sending message canceled
          console.log("TargetPicker was closed!");
        }
      })
      .catch(function (error) {
        // something went wrong before sending a message
        console.log("something wrong happen");
        console.log(error);
      });
  });
  return;
};
onMounted(() => {
  // getTaskList().then((res) => {
  //   const list = (res.data && res.data.list) || [];
  //   dailyTasks.value = list.filter((item) => item.type === 0);
  //   popups.value = list.filter((item) => item.type === 1);
  // });
  // getAchievement().then((res) => {
  //   if (res.data) {
  //     achievements.points = res.data.point || 0;
  //     achievements.badges = res.data.badge || 0;
  //   }
  // });
  showToastBeforeRequest();
  Promise.all([getTaskList(), getAchievement()]).then(([taskRes, achieveRes]) => {
    // 处理任务列表
    const list = (taskRes.data && taskRes.data.list) || [];
    dailyTasks.value = list.filter((item) => item.type === 0);
    popups.value = list.filter((item) => item.type === 1);

    // 处理成就数据
    if (achieveRes.data) {
      achievements.points = achieveRes.data.point || 0;
      achievements.badges = achieveRes.data.badge || 0;
    }
    closeToast();
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
          :src="globalStore.userInfo.avatar || avatar"
          round
          class="product-img"
          @click="router.push('/profile')"
        />
        <div class="text-content">
          {{ globalStore.userInfo.nickname }}
        </div>
      </div>
      <div class="header-right">
        <svg-icon
          className="img-header-right"
          name="icon-jiangbei-2"
          @click="router.push('/ranking')"
        />
        <svg-icon
          className="img-header-right"
          name="icon-upload"
          @click="generateInviteLink"
        />
      </div>
    </div>

    <div class="module-item">
      <div class="module-title">
        <span>{{ $t("rewards.YourAchievements") }}</span>
        <svg-icon
          className="img-icon"
          name="icon-info"
          @click="customToast('Points and badges will become redeemable after launchpad open.')"
        />
      </div>
      <div class="content-box-yellow achievement-box">
        <div class="inner-color">
          <div class="achievement-item">
            <svg-icon
              className="img-icon"
              name="img-points"
            />
            <div class="achievement-text">
              <span>x{{ achievements.points }}</span>
            </div>
          </div>
          <div class="achievement-item">
            <svg-icon
              className="img-icon"
              name="img-badges"
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
        <svg-icon
          className="img-icon"
          name="icon-info"
          @click="customToast('Will refresh daily at 00:00 (UTC+0).')"
        />
      </div>
      <TaskItem
        v-for="(item, index) in dailyTasks"
        v-show="showAllDailyTasks || index < 2"
        :key="`${item.taskId}-${item.rewardAmount}`"
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
        <svg-icon
          className="img-icon"
          name="icon-info"
          @click="customToast('One-time tasks cannot be completed repeatedly, and tasks will be updated from time to time.')"
        />
      </div>
      <TaskItem
        v-for="(item, index) in popups"
        :key="`${item.taskId}-${item.rewardAmount}`"
        :item="item"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-wrap {
  padding: 0 16px 12px 16px;
}
.header-left {
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
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
