<template>
    <div class="player-bar">
        <!-- 左侧：歌曲信息 -->
        <div class="song-info" @click="playerStore.toggleDetail">
            <div v-if="playerStore.currentSong" class="song-cover-wrapper">
                <img :src="playerStore.currentSong.picUrl" :alt="playerStore.currentSong.name" class="song-cover"
                    :class="{ rotating: playerStore.isPlaying }" />
            </div>
            <div v-if="playerStore.currentSong" class="song-details">
                <div class="song-name">{{ playerStore.currentSong.name }}</div>
                <div class="song-artist">{{ playerStore.currentSong.artists }}</div>
            </div>
        </div>

        <!-- 中间：播放控制 -->
        <div class="player-controls">
            <div class="control-buttons">
                <el-button circle :icon="playModeIcon" @click="playerStore.togglePlayMode" :title="playModeText" />
                <el-button circle :icon="DArrowLeft" @click="playerStore.playPrev" />
                <el-button circle size="large" type="primary" :icon="playerStore.isPlaying ? VideoPause : VideoPlay"
                    @click="playerStore.togglePlay" :class="{ 'is-playing': playerStore.isPlaying }" />
                <el-button circle :icon="DArrowRight" @click="playerStore.playNext" />
                <el-button circle :icon="volumeIcon" @click="toggleMute" />
            </div>
            <div class="progress-bar">
                <span class="time">{{ formatTime(playerStore.currentTime) }}</span>
                <el-slider v-model="progressValue" :show-tooltip="false" @change="handleProgressChange"
                    @input="handleProgressInput" />
                <span class="time">{{ formatTime(playerStore.duration) }}</span>
            </div>
        </div>

        <!-- 右侧：音量和播放列表 -->
        <div class="player-actions">
            <div class="volume-control">
                <el-slider v-model="volumeValue" :show-tooltip="false" @input="handleVolumeChange" />
            </div>
            <el-button circle :icon="List" @click="playerStore.togglePlaylist" :badge="playerStore.playlist.length" />
        </div>

        <!-- 音频元素 -->
        <audio ref="audioRef" @timeupdate="handleTimeUpdate" @loadedmetadata="handleLoadedMetadata"
            @ended="handleEnded" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
    VideoPlay,
    VideoPause,
    DArrowLeft,
    DArrowRight,
    List,
    Refresh,
    Sort,
    RefreshRight,
    Mute,
    Microphone,
} from "@element-plus/icons-vue";
import { usePlayerStore, PlayMode } from "@/stores/player";
import MusicApi from "@/api/music";
import { ElMessage } from "element-plus";

const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement>();

const progressValue = ref(0);
const volumeValue = ref(playerStore.volume * 100);
const isMuted = ref(false);

// 播放模式图标
const playModeIcon = computed(() => {
    switch (playerStore.playMode) {
        case PlayMode.SEQUENCE:
            return Sort;
        case PlayMode.RANDOM:
            return Refresh;
        case PlayMode.LOOP:
            return RefreshRight;
        default:
            return Sort;
    }
});

// 播放模式文本
const playModeText = computed(() => {
    switch (playerStore.playMode) {
        case PlayMode.SEQUENCE:
            return "顺序播放";
        case PlayMode.RANDOM:
            return "随机播放";
        case PlayMode.LOOP:
            return "单曲循环";
        default:
            return "顺序播放";
    }
});

// 音量图标
const volumeIcon = computed(() => {
    return isMuted.value || volumeValue.value === 0 ? Mute : Microphone;
});

// 格式化时间
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// 监听当前歌曲变化，加载音频
watch(
    () => playerStore.currentSong,
    async (newSong) => {
        if (newSong && audioRef.value) {
            try {
                const { data } = await MusicApi.getSong(newSong.id);
                if (data.value?.success) {
                    const songDetail = data.value.data;
                    playerStore.setCurrentSongDetail(songDetail);
                    audioRef.value.src = songDetail.url;
                    // 等待音频加载完成后再播放
                    await audioRef.value.load();
                    if (playerStore.isPlaying) {
                        await audioRef.value.play().catch(err => {
                            console.error("播放失败:", err);
                            ElMessage.error("播放失败，请重试");
                        });
                    }
                } else {
                    ElMessage.error("获取歌曲失败");
                }
            } catch (error) {
                console.error("加载歌曲失败:", error);
                ElMessage.error("加载歌曲失败");
            }
        }
    }
);

// 监听播放状态
watch(
    () => playerStore.isPlaying,
    async (playing) => {
        if (audioRef.value && audioRef.value.src) {
            if (playing) {
                try {
                    await audioRef.value.play();
                } catch (err) {
                    console.error("播放失败:", err);
                }
            } else {
                audioRef.value.pause();
            }
        }
    }
);

// 监听音量变化
watch(
    () => playerStore.volume,
    (vol) => {
        if (audioRef.value) {
            audioRef.value.volume = vol;
        }
    }
);

// 是否正在拖动进度条
const isDragging = ref(false);

// 时间更新
const handleTimeUpdate = () => {
    if (audioRef.value && !isDragging.value) {
        playerStore.setCurrentTime(audioRef.value.currentTime);
        progressValue.value = playerStore.progress;
    }
};

// 加载元数据
const handleLoadedMetadata = () => {
    if (audioRef.value) {
        playerStore.setDuration(audioRef.value.duration);
    }
};

// 播放结束
const handleEnded = () => {
    playerStore.playNext();
};

// 进度条拖动中
const handleProgressInput = (value: number) => {
    isDragging.value = true;
    progressValue.value = value;
};

// 进度条变化完成
const handleProgressChange = (value: number) => {
    if (audioRef.value && playerStore.duration > 0) {
        const newTime = (value / 100) * playerStore.duration;
        audioRef.value.currentTime = newTime;
        playerStore.setCurrentTime(newTime);
    }
    isDragging.value = false;
};

// 音量变化
const handleVolumeChange = (value: number) => {
    playerStore.setVolume(value / 100);
    isMuted.value = false;
};

// 切换静音
const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (audioRef.value) {
        audioRef.value.muted = isMuted.value;
    }
};
</script>

<style scoped lang="scss">
.player-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    z-index: 1000;

    .song-info {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 280px;
        flex-shrink: 0;
        cursor: pointer;

        .song-cover-wrapper {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;
            background: var(--el-fill-color-light);

            .song-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;

                &.rotating {
                    animation: rotate 20s linear infinite;
                }
            }
        }

        .song-details {
            flex: 1;
            min-width: 0;

            .song-name {
                font-size: 13px;
                font-weight: 500;
                color: var(--el-text-color-primary);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 4px;
            }

            .song-artist {
                font-size: 12px;
                color: var(--el-text-color-secondary);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .player-controls {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16px;

        .control-buttons {
            display: flex;
            align-items: center;
            gap: 8px;

            .el-button {
                &.is-playing {
                    animation: pulse 1.5s ease-in-out infinite;
                }
            }
        }

        .progress-bar {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;

            .time {
                font-size: 12px;
                color: var(--el-text-color-secondary);
                min-width: 42px;
                text-align: center;
            }

            .el-slider {
                flex: 1;
            }
        }
    }

    .player-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 200px;
        flex-shrink: 0;
        justify-content: flex-end;

        .volume-control {
            width: 100px;
        }
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

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0.7);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(var(--el-color-primary-rgb), 0);
    }
}
</style>
