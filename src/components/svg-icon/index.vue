<script setup lang="ts">
import { isExternal } from "@/utils/index";
// import { computed } from "vue";

interface Props {
  name: string;
  className?: string;
  size?: string;
}
const props = withDefaults(defineProps<Props>(), {
  name: "",
  className: "",
});

const isExternalIcon = computed(() => isExternal(props.name));
const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  let className = "svg-icon ";
  if (props.size) {
    const size = props.size.replace("px", "");
    className += `svg-size-${size} `;
  }
  if (props.className) {
    return className + props.className;
  } else {
    return className;
  }
});
// 外链 icon
const styleExternalIcon = computed(() => {
  return {
    mask: `url(${props.name}) no-repeat 50% 50%`,
    "-webkit-mask": `url(${props.name}) no-repeat 50% 50%`,
  };
});
</script>

<template>
  <div
    v-if="isExternalIcon"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped lang="scss">
.svg-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: transparent;
  overflow: hidden;

  &.svg-size-16 {
    width: 16px;
    height: 16px;
  }
  &.svg-size-18 {
    width: 18px;
    height: 18px;
  }
  &.svg-size-20 {
    width: 20px;
    height: 20px;
  }
  &.svg-size-24 {
    width: 24px;
    height: 24px;
  }
  &.svg-size-26 {
    width: 26px;
    height: 26px;
  }
  &.svg-size-28 {
    width: 28px;
    height: 28px;
  }
  &.svg-size-32 {
    width: 32px;
    height: 32px;
  }
}

.svg-external-icon {
  background-color: transparent;
  mask-size: cover !important;
  display: inline-block;
}
</style>
