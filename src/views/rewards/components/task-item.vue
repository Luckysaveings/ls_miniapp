<template>
  <div class="content-box tasks-box">
    <div class="task-item">
      <img
        class="task-img"
        :src="item.img"
        alt="task"
      />
      <div class="task-text">
        <span class="task-title">{{ item.title }}</span>
        <div class="task-points">
          <img
            class="img-icon"
            src="@/assets/img-points.svg"
            alt="points"
          />
          <span class="task-points-text">+{{ item.points }}</span>
        </div>
      </div>
    </div>
    <div class="task-status">
      <img
        v-if="item.status"
        class="img-status"
        src="@/assets/icon-success.svg"
        alt="status"
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
<style scoped>
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
