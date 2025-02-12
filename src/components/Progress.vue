<template>
  <div class="box-progress">
    <div class="progress-inner">
      <div
        class="percentage"
        :style="{
          width: `${percentage}%`,
          background: bgColor,
        }"
      />
      <van-icon
        :style="{
          left: `${percentage}%`,
        }"
        class="pivot"
        :name="iconGift"
        color="#FF4E7A"
        size="26px"
      />
    </div>
  </div>
</template>

<script setup name="Progress">
import iconGift from "@/assets/icon-gift.svg";
defineProps({
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  bgColor: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.box-progress {
  width: 100%;
  height: 28px;
  padding: 5px 0px;
  margin: 10px 0 12px 0;

  .progress-inner {
    position: relative;
    height: 20px;

    border-radius: 24px;
    background: rgba(24, 24, 27, 0.04);

    .percentage {
      border-radius: 24px;
      background: #18181b;
      height: 100%;
      width: 50%;
    }
    .pivot {
      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
      font-size: 18px;
      padding: 2px;
      box-sizing: content-box;
      background: linear-gradient(180deg, #ff4e7a 0%, #ff3039 100%);
      border-radius: 8px;
      /* 阴影/01 */
      box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
