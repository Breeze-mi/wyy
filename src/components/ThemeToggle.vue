<template>
    <el-button circle :icon="themeStore.isDark ? Sunny : Moon" @click="themeStore.toggleTheme"
        :title="themeStore.isDark ? '切换到日间模式' : '切换到夜间模式'" />
</template>

<script setup lang="ts">
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
</script>
