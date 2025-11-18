import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  // 应用主题到DOM
  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
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
    applyTheme(isDark.value);
  };

  // 监听 isDark 变化，自动应用主题（用于 switch 组件）
  watch(isDark, (newValue) => {
    applyTheme(newValue);
  });

  return {
    isDark,
    toggleTheme,
    initTheme,
  };
});
