<template>
    <el-drawer v-model="playerStore.showPlaylist" direction="btt" :size="400" title="播放列表" :show-close="true">
        <template #header>
            <div class="playlist-header">
                <span>播放列表 ({{ playlist.length }})</span>
                <el-button text @click="handleClearAll">清空</el-button>
            </div>
        </template>

        <div class="playlist-content">
            <div v-for="(song, index) in playlist" :key="song.id" class="playlist-item"
                :class="{ active: index === currentIndex }" @click="handlePlaySong(index)">
                <div class="item-left">
                    <img :src="song.picUrl" :alt="song.name" class="song-cover" />
                    <div class="song-info">
                        <div class="song-name">
                            {{ song.name }}
                            <el-icon v-if="index === currentIndex && isPlaying" class="playing-icon">
                                <VideoPlay />
                            </el-icon>
                        </div>
                        <div class="song-artist">{{ song.artists }}</div>
                    </div>
                </div>
                <div class="item-right">
                    <el-button text :icon="Delete" @click.stop="handleRemove(index)" />
                </div>
            </div>

            <el-empty v-if="playlist.length === 0" description="播放列表为空" />
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { Delete, VideoPlay } from "@element-plus/icons-vue";
import { usePlayerStore } from "@/stores/player";
import { ElMessageBox } from "element-plus";

const playerStore = usePlayerStore();
const { playlist, currentIndex, isPlaying } = playerStore;

const handlePlaySong = (index: number) => {
    playerStore.currentIndex = index;
    playerStore.isPlaying = true;
};

const handleRemove = (index: number) => {
    playerStore.removeFromPlaylist(index);
};

const handleClearAll = () => {
    ElMessageBox.confirm("确定要清空播放列表吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        playerStore.clearPlaylist();
    });
};
</script>

<style scoped lang="scss">
.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.playlist-content {
    height: 100%;
    overflow-y: auto;

    .playlist-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
        border-radius: 8px;

        &:hover {
            background: var(--el-fill-color-light);
        }

        &.active {
            background: var(--el-color-primary-light-9);

            .song-name {
                color: var(--el-color-primary);
            }
        }

        .item-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;

            .song-cover {
                width: 48px;
                height: 48px;
                border-radius: 4px;
                object-fit: cover;
            }

            .song-info {
                flex: 1;
                min-width: 0;

                .song-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--el-text-color-primary);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 4px;

                    .playing-icon {
                        color: var(--el-color-primary);
                        animation: pulse 1s ease-in-out infinite;
                    }
                }

                .song-artist {
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                    margin-top: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .item-right {
            opacity: 0;
            transition: opacity 0.2s;
        }

        &:hover .item-right {
            opacity: 1;
        }
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
