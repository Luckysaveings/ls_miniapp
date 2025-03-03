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
      />
      <div
        v-else
        class="task-status-text"
      >
        Go
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  item: any;
}>();
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
      width: 44px;
      height: 44px;
      color: var(--LS-Gray-01, #fff);
      font-size: 16px;
      font-weight: 500;
      line-height: 44px;
      text-align: center;
      border-radius: 14px;
      background: var(--LS-Gray-07, #18181b);
    }
  }
}
</style>
