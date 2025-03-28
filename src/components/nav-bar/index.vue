<script setup lang="ts" name="NavBar">
const onClickRight = (event: TouchEvent | MouseEvent) => {};
</script>

<template>
  <van-nav-bar
    fixed
    placeholder
    left-arrow
    @click-right="onClickRight"
  >
    <template #right>
      <van-icon
        name="search"
        size="18"
      />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
