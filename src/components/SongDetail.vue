<template>
    <el-drawer v-model="playerStore.showDetail" direction="rtl" :size="'100%'" :show-close="false"
        class="song-detail-drawer">
        <div class="song-detail">
            <!-- 返回按钮 -->
            <div class="detail-header">
                <el-button circle :icon="ArrowLeft" @click="playerStore.toggleDetail" />
                <span class="header-title">{{ currentSong?.name }}</span>
            </div>

            <!-- 专辑封面 -->
            <div class="album-cover-wrapper">
                <div class="album-cover" :class="{ rotating: isPlaying }" :style="{
                    backgroundImage: currentSong
                        ? `url(${currentSong.picUrl})`
                        : 'none',
                }"></div>
            </div>

            <!-- 歌曲信息 -->
            <div class="song-info">
                <h2 class="song-name">{{ currentSong?.name }}</h2>
                <p class="song-artist">{{ currentSong?.artists }}</p>
                <p class="song-album">{{ currentSong?.album }}</p>
            </div>

            <!-- 歌词 -->
            <div class="lyrics-container">
                <div v-if="lyrics.length > 0" class="lyrics">
                    <div v-for="(line, index) in lyrics" :key="index" class="lyric-line"
                        :class="{ active: index === currentLyricIndex }">
                        {{ line.text }}
                    </div>
                </div>
                <el-empty v-else description="暂无歌词" />
            </div>

            <!-- 播放控制 -->
            <div class="detail-controls">
                <el-button circle size="large" :icon="DArrowLeft" @click="playerStore.playPrev" />
                <el-button circle size="large" type="primary" :icon="isPlaying ? VideoPause : VideoPlay"
                    @click="playerStore.togglePlay" />
                <el-button circle size="large" :icon="DArrowRight" @click="playerStore.playNext" />
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
    ArrowLeft,
    VideoPlay,
    VideoPause,
    DArrowLeft,
    DArrowRight,
} from "@element-plus/icons-vue";
import { usePlayerStore } from "@/stores/player";

const playerStore = usePlayerStore();
const { currentSong, isPlaying, currentTime, currentSongDetail } = playerStore;

interface LyricLine {
    time: number;
    text: string;
}

const lyrics = ref<LyricLine[]>([]);
const currentLyricIndex = ref(0);

// 解析歌词
const parseLyric = (lyricText: string) => {
    if (!lyricText) return [];

    const lines = lyricText.split("\n");
    const result: LyricLine[] = [];

    lines.forEach((line) => {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3]);
            const time = minutes * 60 + seconds + milliseconds / 1000;
            const text = match[4].trim();
            if (text) {
                result.push({ time, text });
            }
        }
    });

    return result.sort((a, b) => a.time - b.time);
};

// 监听歌曲详情变化，解析歌词
watch(
    () => playerStore.currentSongDetail,
    (detail) => {
        if (detail?.lyric) {
            lyrics.value = parseLyric(detail.lyric);
        } else {
            lyrics.value = [];
        }
        currentLyricIndex.value = 0;
    }
);

// 监听播放时间，更新当前歌词
watch(
    () => playerStore.currentTime,
    (time) => {
        if (lyrics.value.length === 0) return;

        for (let i = 0; i < lyrics.value.length; i++) {
            if (time < lyrics.value[i].time) {
                currentLyricIndex.value = Math.max(0, i - 1);
                break;
            }
            if (i === lyrics.value.length - 1) {
                currentLyricIndex.value = i;
            }
        }
    }
);
</script>

<style scoped lang="scss">
.song-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--el-color-primary-light-9) 0%, var(--el-bg-color) 50%);
    padding: 20px;

    .detail-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;

        .header-title {
            font-size: 16px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .album-cover-wrapper {
        display: flex;
        justify-content: center;
        margin: 40px 0;

        .album-cover {
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

            &.rotating {
                animation: rotate 20s linear infinite;
            }
        }
    }

    .song-info {
        text-align: center;
        margin-bottom: 20px;

        .song-name {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin: 0 0 8px 0;
        }

        .song-artist {
            font-size: 16px;
            color: var(--el-text-color-secondary);
            margin: 0 0 4px 0;
        }

        .song-album {
            font-size: 14px;
            color: var(--el-text-color-placeholder);
            margin: 0;
        }
    }

    .lyrics-container {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 20px;

        .lyrics {
            padding: 20px;

            .lyric-line {
                text-align: center;
                font-size: 16px;
                line-height: 2;
                color: var(--el-text-color-secondary);
                transition: all 0.3s;
                padding: 8px 0;

                &.active {
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--el-color-primary);
                    transform: scale(1.05);
                }
            }
        }
    }

    .detail-controls {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 20px 0;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
