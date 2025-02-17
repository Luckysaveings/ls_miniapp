<template>
  <van-tabbar
    v-model="active"
    :placeholder="true"
    :route="true"
    fixed
    active-color="#E8C411"
  >
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon"
      :to="item.to"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
const active = ref(0);
const tabbarData = reactive([
  {
    icon: "wap-home-o",
    title: "Home",
    to: {
      name: "Home",
    },
  },
  {
    icon: "coupon",
    title: "Pool",
    badge: 5,
    to: {
      name: "Pool",
    },
  },
  {
    icon: "point-gift",
    title: "Rewards",
    to: {
      name: "Rewards",
    },
  },
]);
</script>
