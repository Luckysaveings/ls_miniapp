<template>
  <van-toast
    :show="modelValue"
    @update:show="$emit('update:modelValue', $event)"
    :position="position"
    :class-name="className"
  >
    <template #message>
      <div class="toast-message">
        <svg-icon
          name="check-circle"
          size="24px"
        ></svg-icon>
        <span class="toast-text">{{ message }}</span>
      </div>
    </template>
  </van-toast>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "top",
  },
  className: {
    type: String,
    default: "custom-toast-wrapper",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style>
.custom-toast-wrapper {
  padding: 0;
  background-color: transparent;
}
</style>
<style scoped lang="scss">
.toast-message {
  padding: 10px 14px;
  border-radius: 48px;
  border: 1px solid rgba(24, 24, 27, 0.04);
  background: #06c756;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .toast-text {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
}
</style>
