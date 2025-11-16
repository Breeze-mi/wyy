<template>
    <div class="search-bar">
        <el-input v-model="searchStore.keyword" placeholder="搜索音乐" :prefix-icon="Search" clearable
            @keyup.enter="handleSearch" />
        <el-button type="primary" :icon="Search" @click="handleSearch" :loading="searchStore.searching">搜索</el-button>
    </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import MusicApi from "@/api/music";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();

const handleSearch = async () => {
    if (!searchStore.keyword.trim()) {
        ElMessage.warning("请输入搜索关键词");
        return;
    }

    searchStore.setSearching(true);
    try {
        const { data } = await MusicApi.search(searchStore.keyword);
        if (data.value?.success) {
            searchStore.setSearchResults(data.value.data);
            if (data.value.data.length === 0) {
                ElMessage.info("未找到相关歌曲");
            }
        } else {
            ElMessage.error(data.value?.message || "搜索失败");
        }
    } catch (error) {
        ElMessage.error("搜索失败，请稍后重试");
    } finally {
        searchStore.setSearching(false);
    }
};
</script>

<style scoped lang="scss">
.search-bar {
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 600px;

    .el-input {
        flex: 1;
    }
}
</style>
