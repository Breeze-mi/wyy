import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Song, SongDetail } from "@/api/music";

// 播放模式
export enum PlayMode {
  SEQUENCE = "sequence", // 顺序播放
  RANDOM = "random", // 随机播放
  LOOP = "loop", // 单曲循环
}

export const usePlayerStore = defineStore("player", () => {
  // 播放列表
  const playlist = ref<Song[]>([]);
  // 当前播放索引
  const currentIndex = ref(-1);
  // 是否正在播放
  const isPlaying = ref(false);
  // 播放模式
  const playMode = ref<PlayMode>(PlayMode.SEQUENCE);
  // 当前歌曲详情
  const currentSongDetail = ref<SongDetail | null>(null);
  // 音量 (0-1)
  const volume = ref(0.7);
  // 当前播放时间
  const currentTime = ref(0);
  // 歌曲总时长
  const duration = ref(0);
  // 是否显示播放列表
  const showPlaylist = ref(false);
  // 是否显示歌曲详情页
  const showDetail = ref(false);

  // 当前播放歌曲
  const currentSong = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
      return playlist.value[currentIndex.value];
    }
    return null;
  });

  // 播放进度 (0-100)
  const progress = computed(() => {
    if (duration.value === 0) return 0;
    return (currentTime.value / duration.value) * 100;
  });

  // 添加歌曲到播放列表
  const addToPlaylist = (song: Song) => {
    const index = playlist.value.findIndex((s) => s.id === song.id);
    if (index === -1) {
      playlist.value.push(song);
    }
  };

  // 播放指定歌曲
  const playSong = (song: Song) => {
    const index = playlist.value.findIndex((s) => s.id === song.id);
    if (index === -1) {
      playlist.value.push(song);
      currentIndex.value = playlist.value.length - 1;
    } else {
      currentIndex.value = index;
    }
    isPlaying.value = true;
  };

  // 播放/暂停
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
  };

  // 上一首
  const playPrev = () => {
    if (playlist.value.length === 0) return;

    if (playMode.value === PlayMode.RANDOM) {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length);
    } else {
      currentIndex.value =
        currentIndex.value <= 0
          ? playlist.value.length - 1
          : currentIndex.value - 1;
    }
    isPlaying.value = true;
  };

  // 下一首
  const playNext = () => {
    if (playlist.value.length === 0) return;

    if (playMode.value === PlayMode.LOOP) {
      // 单曲循环，触发重新加载
      const temp = currentIndex.value;
      currentIndex.value = -1;
      setTimeout(() => {
        currentIndex.value = temp;
        isPlaying.value = true;
      }, 10);
      return;
    }

    if (playMode.value === PlayMode.RANDOM) {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length);
    } else {
      currentIndex.value =
        currentIndex.value >= playlist.value.length - 1
          ? 0
          : currentIndex.value + 1;
    }
    isPlaying.value = true;
  };

  // 切换播放模式
  const togglePlayMode = () => {
    const modes = [PlayMode.SEQUENCE, PlayMode.RANDOM, PlayMode.LOOP];
    const currentModeIndex = modes.indexOf(playMode.value);
    playMode.value = modes[(currentModeIndex + 1) % modes.length];
  };

  // 从播放列表删除歌曲
  const removeFromPlaylist = (index: number) => {
    if (index === currentIndex.value) {
      playNext();
    } else if (index < currentIndex.value) {
      currentIndex.value--;
    }
    playlist.value.splice(index, 1);
  };

  // 清空播放列表
  const clearPlaylist = () => {
    playlist.value = [];
    currentIndex.value = -1;
    isPlaying.value = false;
    currentSongDetail.value = null;
  };

  // 设置当前歌曲详情
  const setCurrentSongDetail = (detail: SongDetail) => {
    currentSongDetail.value = detail;
  };

  // 设置音量
  const setVolume = (val: number) => {
    volume.value = Math.max(0, Math.min(1, val));
  };

  // 设置当前播放时间
  const setCurrentTime = (time: number) => {
    currentTime.value = time;
  };

  // 设置歌曲总时长
  const setDuration = (time: number) => {
    duration.value = time;
  };

  // 切换播放列表显示
  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value;
  };

  // 切换详情页显示
  const toggleDetail = () => {
    showDetail.value = !showDetail.value;
  };

  return {
    // state
    playlist,
    currentIndex,
    isPlaying,
    playMode,
    currentSongDetail,
    volume,
    currentTime,
    duration,
    showPlaylist,
    showDetail,
    // computed
    currentSong,
    progress,
    // actions
    addToPlaylist,
    playSong,
    togglePlay,
    playPrev,
    playNext,
    togglePlayMode,
    removeFromPlaylist,
    clearPlaylist,
    setCurrentSongDetail,
    setVolume,
    setCurrentTime,
    setDuration,
    togglePlaylist,
    toggleDetail,
  };
});
