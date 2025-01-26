<script setup lang="ts">
const onClickRight = (event: TouchEvent | MouseEvent) => {};
</script>

<template>
  <van-nav-bar fixed placeholder @click-right="onClickRight" left-arrow>
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
