<template>
  <div class="content-box tasks-box">
    <div class="task-item">
      <img
        v-if="item.iconUrl"
        class="task-img"
        :src="item.iconUrl"
        alt="task"
      />
      <svg-icon
        v-else
        name="tasks-daily-tasks-2"
        class="task-img"
      />

      <div class="task-text">
        <span class="task-title">{{ item.name }}</span>
        <div class="task-points">
          <svg-icon
            v-if="item.rewardType === 0"
            className="img-icon"
            name="img-points"
          />
          <svg-icon
            v-else
            className="img-icon"
            name="img-badges"
          />
          <span
            class="task-points-text"
            :class="item.rewardType === 1 ? 'badge' : ''"
            >+{{ item.rewardAmount }}</span
          >
        </div>
      </div>
    </div>
    <div class="task-status">
      <svg-icon
        v-if="item.status === 3"
        className="img-status"
        name="icon-success"
        @click="taskClick(item)"
      />
      <div
        v-else-if="item.status === 1 && item.isCheck === 0"
        class="task-status-text"
        @click="taskClick(item)"
      >
        Go
      </div>
      <!-- <svg-icon
        v-else-if="item.status === 1 && item.isCheck === 1"
        className="img-status"
        name="icon-refresh"
      /> -->
      <div
        v-else-if="item.status === 1 && item.isCheck === 1"
        class="refresh"
        @click="taskClick(item)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon-tabler-refresh"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3C4.55228 3 5 3.44772 5 4V6.34298C6.64938 4.30446 9.17168 3 12 3C16.5903 3 20.3767 6.43564 20.9304 10.8763C20.9988 11.4243 20.6099 11.924 20.0618 11.9923C19.5138 12.0607 19.0141 11.6718 18.9458 11.1237C18.5153 7.67174 15.5689 5 12 5C9.62231 5 7.51998 6.18566 6.25442 8H9C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10H4C3.44772 10 3 9.55228 3 9V4C3 3.44772 3.44772 3 4 3ZM3.93815 12.0077C4.48619 11.9393 4.98587 12.3282 5.05421 12.8763C5.48467 16.3283 8.43109 19 12 19C14.3777 19 16.48 17.8143 17.7456 16H15C14.4477 16 14 15.5523 14 15C14 14.4477 14.4477 14 15 14H20C20.5523 14 21 14.4477 21 15V20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20V17.657C17.3506 19.6955 14.8283 21 12 21C7.40967 21 3.62332 17.5644 3.06958 13.1237C3.00124 12.5757 3.39011 12.076 3.93815 12.0077Z"
            fill="#18181B"
          />
        </svg>
      </div>
      <div
        v-else-if="item.status === 2"
        class="task-status-text"
        @click="taskClick(item)"
      >
        {{ $t("common.Claim") }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { checkTask, claimTask } from "@/api/index";
const props = defineProps<{
  item: any;
}>();
const taskClick = (task: any) => {
  if (task.status === 1) {
    checkTask(task.taskId).then((res) => {
      if (task.isCheck === 0) {
        task.status = 2;
      } else {
        task.status = res.data.status;
      }
    });
  } else if (task.status === 2) {
    claimTask(task.taskId).then((res) => {
      if (res.data) {
        props.item.status = 3;
      }
    });
  }
};
</script>

<style scoped lang="scss">
.tasks-box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .task-item {
    display: flex;
    align-items: center;
    justify-content: center;
    .task-img {
      width: 50px;
      height: 50px;
      margin-right: 16px;
    }

    .task-text {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
      height: 50px;
      .task-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
      }
      .task-points {
        display: flex;
        align-items: center;
        justify-content: center;
        .img-icon {
          width: 24px;
          height: 24px;
          margin-right: 6px;
        }
        .task-points-text {
          color: var(--LS-Primary-02, #ddb305);
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;

          &.badge {
            color: #2d87fa;
          }
        }
      }
    }
  }
  .task-status {
    display: flex;
    align-items: center;
    justify-content: center;
    .img-status {
      width: 44px;
      height: 44px;
    }
    .task-status-text {
      min-width: 44px;
      height: 44px;
      color: var(--LS-Gray-01, #fff);
      font-size: 16px;
      font-weight: 500;
      line-height: 44px;
      text-align: center;
      border-radius: 14px;
      background: var(--LS-Gray-07, #18181b);
      padding: 0 10px;
    }
    .icon-tabler-refresh {
      width: 24px;
      height: 24px;
    }
    .refresh {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #fff;
      display: flex;
      padding: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 2px solid var(--ls-line-12, rgba(24, 24, 27, 0.12));
    }
  }
}
</style>
