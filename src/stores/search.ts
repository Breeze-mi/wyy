import { defineStore } from "pinia";
import { ref } from "vue";
import type { Song } from "@/api/music";

export const useSearchStore = defineStore("search", () => {
  // 搜索关键词
  const keyword = ref("");
  // 搜索结果
  const searchResults = ref<Song[]>([]);
  // 是否正在搜索
  const searching = ref(false);
  // 是否显示搜索结果
  const showResults = ref(false);

  // 设置搜索结果
  const setSearchResults = (results: Song[]) => {
    searchResults.value = results;
    showResults.value = true;
  };

  // 清空搜索结果
  const clearSearchResults = () => {
    searchResults.value = [];
    showResults.value = false;
    keyword.value = "";
  };

  // 设置搜索状态
  const setSearching = (status: boolean) => {
    searching.value = status;
  };

  // 设置关键词
  const setKeyword = (kw: string) => {
    keyword.value = kw;
  };

  return {
    keyword,
    searchResults,
    searching,
    showResults,
    setSearchResults,
    clearSearchResults,
    setSearching,
    setKeyword,
  };
});
