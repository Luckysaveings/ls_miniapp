<script setup lang="ts">
import { isExternal } from "@/utils/validate";
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
  if (props.className) {
    return "svg-icon " + props.className;
  } else {
    return "svg-icon";
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
    :style="{ width: size, height: size }"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: transparent;
  overflow: hidden;
}

.svg-external-icon {
  background-color: transparent; 
  mask-size: cover !important;
  display: inline-block;
}
</style>
