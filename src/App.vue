<template>
  <div class="app-container">
    <!-- 侧边栏 - 在全屏页面时隐藏 -->
    <transition name="sidebar-slide">
      <Sidebar v-if="!isFullscreenPage" />
    </transition>

    <!-- 主内容区 -->
    <div class="main-wrapper" :class="{ 'fullscreen': isFullscreenPage }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 全局播放控制栏 -->
    <PlayerBar />

    <!-- 播放列表抽屉 -->
    <PlaylistDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import PlayerBar from "@/components/PlayerBar.vue";
import PlaylistDrawer from "@/components/PlaylistDrawer.vue";

const route = useRoute();

// 判断当前页面是否为全屏页面
const isFullscreenPage = computed(() => {
  return route.meta.fullscreen === true;
});
</script>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  min-width: 800px;
  overflow: hidden;
  display: flex;
}

.main-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &.fullscreen {
    width: 100%;
  }
}

/* 为整个应用设置最小宽度 */
body {
  min-width: 800px;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

/* 侧边栏滑动动画 */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: all 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
