import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { tabSync } from "@/utils/sync";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  // 标志：是否正在从其他标签页同步数据（避免循环广播）
  let isSyncing = false;

  // 应用主题到DOM
  const applyTheme = (dark: boolean, broadcast = true) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    // 广播到其他标签页（如果不是在同步中）
    if (broadcast && !isSyncing) {
      tabSync.broadcast("theme", { isDark: dark });
    }
  };

  // 切换主题（手动调用）
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme(isDark.value);
  };

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    isDark.value = savedTheme === "dark";
    applyTheme(isDark.value, false); // 初始化时不广播
  };

  // 监听 isDark 变化，自动应用主题（用于 switch 组件）
  watch(isDark, (newValue) => {
    applyTheme(newValue);
  });

  // 订阅其他标签页的主题更新
  tabSync.subscribe("theme", (data) => {
    // 设置同步标志，避免循环广播
    isSyncing = true;

    // 更新本地状态
    isDark.value = data.isDark ?? false;
    applyTheme(isDark.value, false);

    // 重置同步标志
    setTimeout(() => {
      isSyncing = false;
    }, 0);
  });

  return {
    isDark,
    toggleTheme,
    initTheme,
  };
});
