import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { tabSync } from "@/utils/sync";

// 音质类型
export type QualityLevel =
  | "standard" // 标准音质 (128kbps)
  | "exhigh" // 极高音质 (320kbps)
  | "lossless" // 无损音质 (FLAC)
  | "hires" // Hi-Res音质 (24bit/96kHz)
  | "jyeffect" // 高清环绕声
  | "sky" // 沉浸环绕声
  | "jymaster"; // 超清母带

// 搜索类型
export type SearchType = "music" | "song" | "playlist" | "album";

const STORAGE_KEY = "music-player-settings";

export const useSettingsStore = defineStore("settings", () => {
  // 从 localStorage 加载设置
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("加载设置失败:", error);
    }
    return { quality: "lossless", searchType: "music" };
  };

  const savedSettings = loadSettings();

  // 音质设置
  const quality = ref<QualityLevel>(savedSettings.quality);

  // 搜索类型
  const searchType = ref<SearchType>(savedSettings.searchType);

  // 标志：是否正在从其他标签页同步数据（避免循环广播）
  let isSyncing = false;

  // 保存设置到 localStorage 并同步到其他标签页
  const saveSettings = () => {
    // 如果正在同步，跳过广播
    if (isSyncing) return;

    try {
      const state = {
        quality: quality.value,
        searchType: searchType.value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      // 广播到其他标签页
      tabSync.broadcast("settings", state);
    } catch (error) {
      console.error("保存设置失败:", error);
    }
  };

  // 监听变化并自动保存
  watch([quality, searchType], saveSettings);

  // 订阅其他标签页的更新
  tabSync.subscribe("settings", (data) => {
    // 设置同步标志，避免触发 watch 导致循环广播
    isSyncing = true;

    // 更新本地状态
    quality.value = data.quality || "lossless";
    searchType.value = data.searchType || "music";

    // 重置同步标志
    setTimeout(() => {
      isSyncing = false;
    }, 0);
  });

  // 设置音质
  const setQuality = (level: QualityLevel) => {
    quality.value = level;
  };

  // 设置搜索类型
  const setSearchType = (type: SearchType) => {
    searchType.value = type;
  };

  return {
    quality,
    searchType,
    setQuality,
    setSearchType,
  };
});
