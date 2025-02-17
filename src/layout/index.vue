<script setup lang="ts">
import { useRoute } from "vue-router";

import tabbar from "@/components/tabbar/index.vue";
import { useCachedViewStoreHook } from "@/store/modules/cached-view";

const route = useRoute();
// 根据路由 meta 字段判断是否显示 Tabbar
const showTabbar = computed(() => {
  return route.meta.showTabbar ?? true; // 默认显示 Tabbar
});
const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});
</script>

<template>
  <div class="app-wrapper">
    <van-config-provider>
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <tabbar v-if="showTabbar" />
    </van-config-provider>
  </div>
</template>

<style lang="less" scoped>
@import "@/styles/mixin.less";

.app-wrapper {
  .clearfix();
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
