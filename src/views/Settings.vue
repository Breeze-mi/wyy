<template>
    <div class="settings-page">
        <!-- 顶部栏 -->
        <div class="top-bar">
            <el-button :icon="ArrowLeft" circle @click="goBack" title="返回" />
            <h1>设置</h1>
        </div>

        <!-- 设置内容 -->
        <div class="settings-content">
            <!-- 外观设置 -->
            <div class="settings-section">
                <h2>外观</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">主题模式</div>
                        <div class="setting-desc">切换深色或浅色主题</div>
                    </div>
                    <el-switch v-model="themeStore.isDark" active-text="深色" inactive-text="浅色" />
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">主题预设</div>
                        <div class="setting-desc">选择预设主题快速切换风格</div>
                    </div>
                    <el-select v-model="selectedThemePreset" placeholder="选择主题" style="width: 200px"
                        @change="handleThemePresetChange">
                        <el-option label="网易云红色（默认）" value="default" />
                        <el-option label="酷狗蓝色" value="kugou" />
                        <el-option label="QQ音乐绿色" value="qq" />
                        <el-option label="橙黄橘绿" value="orange" />
                        <el-option label="粉装玉琢" value="pink" />
                        <el-option label="重厅球紫" value="purple" />
                    </el-select>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">主题颜色</div>
                        <div class="setting-desc">自定义主题主色调（高级）</div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <el-color-picker v-model="customPrimaryColor" @change="handlePrimaryColorChange" />
                        <el-button size="small" @click="handleResetThemeColors">恢复默认</el-button>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">选中背景色</div>
                        <div class="setting-desc">自定义歌曲选中时的背景颜色（高级）</div>
                    </div>
                    <el-color-picker v-model="customSelectedBg" @change="handleSelectedBgChange" />
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">选中文字色</div>
                        <div class="setting-desc">自定义歌曲选中时的文字颜色（高级）</div>
                    </div>
                    <el-color-picker v-model="customSelectedText" @change="handleSelectedTextChange" />
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">歌词背景色</div>
                        <div class="setting-desc">自定义歌词显示区域的背景颜色（高级）</div>
                    </div>
                    <el-color-picker v-model="customLyricBg" @change="handleLyricBgChange" />
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">未播放歌词颜色</div>
                        <div class="setting-desc">自定义未播放歌词的文字颜色（高级）</div>
                    </div>
                    <el-color-picker v-model="customLyricInactiveText" @change="handleLyricInactiveTextChange" />
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">字体系列</div>
                        <div class="setting-desc">选择界面字体（主页、列表、设置页面）</div>
                    </div>
                    <el-select v-model="selectedFontFamily" placeholder="选择字体" style="width: 200px"
                        @change="handleFontFamilyChange">
                        <el-option label="微软雅黑（默认）" value="Microsoft YaHei" />
                        <el-option label="苹方" value="PingFang SC" />
                        <el-option label="思源黑体" value="Source Han Sans CN" />
                        <el-option label="宋体" value="SimSun" />
                        <el-option label="黑体" value="SimHei" />
                        <el-option label="楷体" value="KaiTi" />
                        <el-option label="Arial" value="Arial" />
                        <el-option label="Helvetica" value="Helvetica" />
                    </el-select>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">字体大小</div>
                        <div class="setting-desc">调整界面字体大小</div>
                    </div>
                    <el-radio-group v-model="settingsStore.fontSize" @change="handleFontSizeChange">
                        <el-radio-button label="small">小</el-radio-button>
                        <el-radio-button label="medium">中</el-radio-button>
                        <el-radio-button label="large">大</el-radio-button>
                    </el-radio-group>
                </div>
            </div>

            <!-- 播放设置 -->
            <div class="settings-section">
                <h2>播放</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">音质选择</div>
                        <div class="setting-desc">选择播放音质，高音质失败会自动降级</div>
                    </div>
                    <el-select v-model="settingsStore.quality" placeholder="选择音质" style="width: 180px">
                        <el-option label="标准音质 (128k)" value="standard" />
                        <el-option label="极高音质 (320k)" value="exhigh" />
                        <el-option label="无损音质 (FLAC)" value="lossless" />
                        <el-option label="Hi-Res音质" value="hires" />
                        <el-option label="高清环绕声" value="jyeffect" />
                        <el-option label="沉浸环绕声" value="sky" />
                        <el-option label="超清母带" value="jymaster" />
                    </el-select>
                </div>
            </div>

            <!-- 缓存管理 -->
            <div class="settings-section">
                <h2>缓存管理</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">试听缓存</div>
                        <div class="setting-desc">
                            <div>占用空间：{{ formatBytes(audioCacheInfo.totalSize) }}</div>
                            <el-progress :percentage="audioCachePercentage" :show-text="false"
                                :color="audioCachePercentage > 80 ? '#f56c6c' : '#409eff'" style="margin-top: 8px;" />
                        </div>
                    </div>
                    <el-button type="danger" @click="handleClearAudioCache"
                        :disabled="audioCacheInfo.totalSize === 0">清空缓存</el-button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">歌词缓存</div>
                        <div class="setting-desc">
                            <div>占用空间：{{ cacheInfo.size }}</div>
                        </div>
                    </div>
                    <el-button type="danger" @click="handleClearLyricCache"
                        :disabled="cacheInfo.count === 0">清空缓存</el-button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">封面缓存</div>
                        <div class="setting-desc">
                            <div>占用空间：{{ cacheInfo.size }}</div>
                        </div>
                    </div>
                    <el-button type="danger" @click="handleClearCoverCache"
                        :disabled="cacheInfo.count === 0">清空缓存</el-button>
                </div>
                <!-- 存储统计：仅在开发环境显示 -->
                <div class="setting-item" v-if="settingsStore.isDevelopment()">
                    <div class="setting-info">
                        <div class="setting-title">存储统计 <el-tag size="small" type="warning">开发模式</el-tag></div>
                        <div class="setting-desc">
                            <div>试听缓存：{{ formatBytes(audioCacheInfo.totalSize) }}</div>
                            <div>歌曲信息：{{ cacheInfo.size }}</div>
                            <div>本地音乐：{{ formatBytes(indexedDBInfo.used) }}（{{ indexedDBInfo.trackCount }} 首）</div>
                            <div>歌单数据：{{ playlistDataSize }}</div>
                            <div>总计：{{ totalStorageSize }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 数据备份 -->
            <div class="settings-section">
                <h2>数据备份</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">数据导出</div>
                        <div class="setting-desc">导出收藏和歌单数据为JSON文件</div>
                    </div>
                    <el-button type="primary" @click="handleExportData">导出数据</el-button>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">数据导入</div>
                        <div class="setting-desc">从JSON文件导入收藏和歌单数据</div>
                    </div>
                    <el-button type="primary" @click="handleImportData">导入数据</el-button>
                </div>
            </div>

            <!-- 网络设置：开发环境或 Electron 环境显示 -->
            <div class="settings-section" v-if="settingsStore.isDevelopment() || settingsStore.isElectron()">
                <h2>网络</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">API服务器地址</div>
                        <div class="setting-desc">
                            自定义后端API地址，留空使用默认地址。保存后立即生效，无需重启。
                            <div v-if="currentApiUrl" style="margin-top: 4px;">
                                <el-text size="small" type="info">当前使用：{{ currentApiUrl }}</el-text>
                            </div>
                        </div>
                    </div>
                    <div class="api-input-group">
                        <el-input v-model="apiUrlInput" placeholder="http://localhost:5000" style="width: 300px"
                            clearable />
                        <el-button type="primary" @click="handleSaveApiUrl">保存</el-button>
                        <el-button @click="handleResetApiUrl">重置</el-button>
                    </div>
                </div>
            </div>



            <!-- 关于 -->
            <div class="settings-section">
                <h2>关于</h2>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">版本信息</div>
                        <div class="setting-desc">网易云音乐播放器 v1.0.0</div>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">技术栈</div>
                        <div class="setting-desc">Vite + Vue 3 + TypeScript + Electron + Pinia</div>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">技术栈</div>
                        <div class="setting-desc">Vite + Vue 3 + TypeScript + Electron</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { useThemeStore } from "@/stores/theme";
import { useCacheStore } from "@/stores/cache";
import { useSettingsStore } from "@/stores/settings";
import { usePlaylistStore } from "@/stores/playlist";
import { useAudioCacheStore } from "@/stores/audioCache";
import { StorageFactory } from "@/storage/storageFactory";
import { resetAPIHealthStatus } from "@/utils/request";
import { themePresets } from "@/config/theme";

const router = useRouter();
const themeStore = useThemeStore();
const cacheStore = useCacheStore();
const settingsStore = useSettingsStore();
const playlistStore = usePlaylistStore();
const audioCacheStore = useAudioCacheStore();

// 主题预设选择
const selectedThemePreset = ref<string>('default');

// 字体系列选择
const selectedFontFamily = ref<string>(settingsStore.fontFamily);

// 自定义颜色
const customPrimaryColor = ref<string>('');
const customSelectedBg = ref<string>('');
const customSelectedText = ref<string>('');
const customLyricBg = ref<string>('');
const customLyricInactiveText = ref<string>('');

// 初始化自定义颜色和主题预设
const initCustomColors = () => {
    const savedColors = themeStore.customColors;
    if (savedColors) {
        customPrimaryColor.value = savedColors.primary || '';
        customSelectedBg.value = savedColors.selectedBg || '';
        customSelectedText.value = savedColors.selectedText || '';
        customLyricBg.value = savedColors.lyricBg || '';
        customLyricInactiveText.value = savedColors.lyricInactiveText || '';

        // 检测当前使用的是哪个预设主题
        const currentPrimary = savedColors.primary;
        if (currentPrimary === '#2878ff') {
            selectedThemePreset.value = 'kugou';
        } else if (currentPrimary === '#31c27c') {
            selectedThemePreset.value = 'qq';
        } else if (currentPrimary === '#ff9800') {
            selectedThemePreset.value = 'orange';
        } else if (currentPrimary === '#e91e63') {
            selectedThemePreset.value = 'pink';
        } else if (currentPrimary === '#9c27b0') {
            selectedThemePreset.value = 'purple';
        } else if (currentPrimary === '#ec4141') {
            selectedThemePreset.value = 'netease';
        } else {
            selectedThemePreset.value = 'default';
        }
    } else {
        selectedThemePreset.value = 'default';
    }
};

// API地址输入框
const apiUrlInput = ref(settingsStore.apiBaseUrl);

// 当前实际使用的 API 地址
const currentApiUrl = computed(() => {
    // 优先使用自定义地址
    if (settingsStore.apiBaseUrl && settingsStore.apiBaseUrl.trim()) {
        return settingsStore.apiBaseUrl.trim();
    }
    // 使用环境变量地址
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    // 默认地址
    return "http://localhost:5000";
});

// IndexedDB存储信息（本地音乐）
const indexedDBInfo = ref({
    used: 0,
    quota: 0,
    trackCount: 0,
});

// 音频缓存信息
const audioCacheInfo = ref({
    count: 0,
    totalSize: 0,
});

// 加载IndexedDB信息
const loadIndexedDBInfo = async () => {
    try {
        const storage = StorageFactory.getAdapter();
        await storage.init();
        const info = await storage.getStorageInfo();
        const tracks = await storage.listTracks();
        indexedDBInfo.value = {
            used: info.used,
            quota: info.quota,
            trackCount: tracks.length,
        };
    } catch (error) {
        console.error("加载IndexedDB信息失败:", error);
    }
};

// 加载音频缓存信息
const loadAudioCacheInfo = async () => {
    try {
        // 无论 Web 还是 Electron 环境，音频缓存都使用 IndexedDB
        // 因为音频缓存是在渲染进程中管理的
        const stats = await audioCacheStore.getCacheStats();
        audioCacheInfo.value = stats;
    } catch (error) {
        console.error("加载音频缓存信息失败:", error);
    }
};

onMounted(() => {
    loadIndexedDBInfo();
    loadAudioCacheInfo();
    initCustomColors();
});

const goBack = () => {
    router.push("/");
};

// 计算缓存信息
const cacheInfo = computed(() => {
    const info = cacheStore.getCacheInfo();
    return {
        count: info.count,
        size: formatBytes(info.bytes),
        bytes: info.bytes
    };
});

// 格式化字节大小
const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// 计算音频缓存占用百分比（基于空间大小，假设最大 500MB）
const audioCachePercentage = computed(() => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    return Math.min((audioCacheInfo.value.totalSize / maxSize) * 100, 100);
});

// 计算歌单数据大小
const playlistDataSize = computed(() => {
    try {
        const playlistKey = "music-playlists";
        const stored = localStorage.getItem(playlistKey);
        if (stored) {
            return formatBytes(new Blob([stored]).size);
        }
        return "0 B";
    } catch (error) {
        return "0 B";
    }
});

// 计算总存储大小
const totalStorageSize = computed(() => {
    const onlineAudioBytes = audioCacheInfo.value.totalSize;
    const localMusicBytes = indexedDBInfo.value.used;
    const localStorageBytes = cacheStore.getTotalStorageSize();
    return formatBytes(onlineAudioBytes + localMusicBytes + localStorageBytes);
});

// 清空试听缓存
const handleClearAudioCache = async () => {
    ElMessageBox.confirm(
        `确定要清空试听缓存吗？这将删除约 ${formatBytes(audioCacheInfo.value.totalSize)} 的缓存数据。下次播放时需要重新下载。`,
        "清空确认",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(async () => {
            try {
                // 无论 Web 还是 Electron 环境，都使用 IndexedDB 清空
                await audioCacheStore.clearAllCache();
                await loadAudioCacheInfo();
                ElMessage.success("试听缓存已清空");
            } catch (error) {
                console.error("清空试听缓存失败:", error);
                ElMessage.error("清空失败");
            }
        })
        .catch(() => { });
};

// 清空歌词缓存
const handleClearLyricCache = async () => {
    ElMessageBox.confirm(
        `确定要清空歌词缓存吗？这将删除 ${cacheInfo.value.count} 首歌曲的歌词信息。`,
        "清空确认",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(async () => {
            try {
                if (settingsStore.isElectron()) {
                    // Electron 环境
                    const result = await (window as any).electron?.invoke("clear-lyric-cache");
                    if (result?.success) {
                        cacheStore.clearLyricCache();
                        ElMessage.success("歌词缓存已清空");
                    } else {
                        throw new Error(result?.error || "清空失败");
                    }
                } else {
                    // Web 环境
                    cacheStore.clearLyricCache();
                    ElMessage.success("歌词缓存已清空");
                }
            } catch (error) {
                console.error("清空歌词缓存失败:", error);
                ElMessage.error("清空失败");
            }
        })
        .catch(() => { });
};

// 清空封面缓存
const handleClearCoverCache = async () => {
    ElMessageBox.confirm(
        `确定要清空封面缓存吗？这将删除 ${cacheInfo.value.count} 首歌曲的封面图片。`,
        "清空确认",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(async () => {
            try {
                if (settingsStore.isElectron()) {
                    // Electron 环境
                    const result = await (window as any).electron?.invoke("clear-cover-cache");
                    if (result?.success) {
                        cacheStore.clearCoverCache();
                        ElMessage.success("封面缓存已清空");
                    } else {
                        throw new Error(result?.error || "清空失败");
                    }
                } else {
                    // Web 环境
                    cacheStore.clearCoverCache();
                    ElMessage.success("封面缓存已清空");
                }
            } catch (error) {
                console.error("清空封面缓存失败:", error);
                ElMessage.error("清空失败");
            }
        })
        .catch(() => { });
};

// 导出数据
const handleExportData = () => {
    try {
        const data = {
            version: "1.0.0",
            exportTime: new Date().toISOString(),
            favorites: playlistStore.favoriteList,
            playlists: playlistStore.playlists,
            history: playlistStore.historyList,
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `music-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        ElMessage.success("数据导出成功");
    } catch (error) {
        console.error("导出数据失败:", error);
        ElMessage.error("数据导出失败");
    }
};

// 导入数据
const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // 验证数据格式
            if (!data.version || !data.favorites || !data.playlists) {
                throw new Error("数据格式不正确");
            }

            ElMessageBox.confirm(
                "导入数据将覆盖当前的收藏和歌单，是否继续？",
                "导入确认",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    playlistStore.favoriteList = data.favorites || [];
                    playlistStore.playlists = data.playlists || [];
                    if (data.history) {
                        playlistStore.historyList = data.history;
                    }
                    ElMessage.success("数据导入成功");
                })
                .catch(() => { });
        } catch (error) {
            console.error("导入数据失败:", error);
            ElMessage.error("数据导入失败，请检查文件格式");
        }
    };
    input.click();
};

// 字体系列变化
const handleFontFamilyChange = (family: string) => {
    settingsStore.setFontFamily(family);
    ElMessage.success("字体已更新");
};

// 字体大小变化
const handleFontSizeChange = (size: string) => {
    settingsStore.setFontSize(size as any);
    ElMessage.success("字体大小已更新");
};

// 辅助函数：生成主色调的衍生颜色
const generateColorVariants = (baseColor: string) => {
    // 简单的颜色变体生成（实际项目中可以使用更复杂的算法）
    return {
        primary: baseColor,
        primaryLight3: baseColor, // 可以使用颜色库生成更精确的变体
        primaryLight5: baseColor,
        primaryLight7: baseColor,
        primaryLight9: baseColor,
        primaryDark2: baseColor,
    };
};

// 获取当前自定义颜色对象
const getCurrentCustomColors = () => {
    const colors: any = {};

    if (customPrimaryColor.value) {
        Object.assign(colors, generateColorVariants(customPrimaryColor.value));
        colors.selectedBorder = customPrimaryColor.value;
    }

    if (customSelectedBg.value) {
        colors.selectedBg = customSelectedBg.value;
    }

    if (customSelectedText.value) {
        colors.selectedText = customSelectedText.value;
    }

    if (customLyricBg.value) {
        colors.lyricBg = customLyricBg.value;
    }

    if (customLyricInactiveText.value) {
        colors.lyricInactiveText = customLyricInactiveText.value;
    }

    return Object.keys(colors).length > 0 ? colors : null;
};

// 主色调变化
const handlePrimaryColorChange = () => {
    const colors = getCurrentCustomColors();
    themeStore.setCustomColors(colors);
};

// 选中背景色变化
const handleSelectedBgChange = () => {
    const colors = getCurrentCustomColors();
    themeStore.setCustomColors(colors);
};

// 选中文字色变化
const handleSelectedTextChange = () => {
    const colors = getCurrentCustomColors();
    themeStore.setCustomColors(colors);
};

// 歌词背景色变化
const handleLyricBgChange = () => {
    const colors = getCurrentCustomColors();
    themeStore.setCustomColors(colors);
};

// 未播放歌词颜色变化
const handleLyricInactiveTextChange = () => {
    const colors = getCurrentCustomColors();
    themeStore.setCustomColors(colors);
};

// 主题预设变化
const handleThemePresetChange = (preset: string) => {
    const themeConfig = themePresets[preset as keyof typeof themePresets];
    themeStore.setCustomColors(themeConfig);

    // 清空自定义颜色输入框
    customPrimaryColor.value = '';
    customSelectedBg.value = '';
    customSelectedText.value = '';
    customLyricBg.value = '';
    customLyricInactiveText.value = '';

    const themeNames: Record<string, string> = {
        default: '网易云红色',
        netease: '网易云红色',
        kugou: '酷狗蓝色',
        qq: 'QQ音乐绿色',
        orange: '橙黄橘绿',
        pink: '粉装玉琢',
        purple: '重厅球紫',
    };

    ElMessage.success(`已切换到${themeNames[preset]}主题`);
};

// 恢复默认主题颜色
const handleResetThemeColors = () => {
    ElMessageBox.confirm(
        '确定要恢复默认主题颜色吗？所有自定义颜色将被清除。',
        '恢复默认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        selectedThemePreset.value = 'default';
        customPrimaryColor.value = '';
        customSelectedBg.value = '';
        customSelectedText.value = '';
        customLyricBg.value = '';
        customLyricInactiveText.value = '';
        themeStore.setCustomColors(null);
        ElMessage.success('已恢复默认主题颜色');
    }).catch(() => {
        // 用户取消
    });
};

// 保存API地址
const handleSaveApiUrl = () => {
    const url = apiUrlInput.value.trim();
    // 验证URL格式
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        ElMessage.warning("请输入有效的URL地址（以http://或https://开头）");
        return;
    }

    // 保存到 store（会自动保存到 localStorage）
    settingsStore.setApiBaseUrl(url);

    // 🔧 重置 API 健康检查状态（关键修复）
    // 清除之前的失败记录，允许使用新地址重新连接
    resetAPIHealthStatus();

    // 立即生效提示
    ElMessage.success({
        message: "API地址已更新",
        duration: 1500
    });

    // // 可选：测试新地址是否可用
    // testApiConnection(url || currentApiUrl.value);
};

// 重置API地址
const handleResetApiUrl = () => {
    apiUrlInput.value = "";
    settingsStore.setApiBaseUrl("");

    // 🔧 重置 API 健康检查状态（关键修复）
    // 清除之前的失败记录，允许使用默认地址重新连接
    resetAPIHealthStatus();

    // ElMessage.success({
    //     message: "已重置为默认API地址并立即生效",
    //     duration: 2000
    // });
};

// 测试 API 连接（可选）
// const testApiConnection = async (url: string) => {
//     try {
//         // 简单的连接测试，不显示错误提示
//         const response = await fetch(`${url}/health`, {
//             method: 'GET',
//             signal: AbortSignal.timeout(3000)
//         });

//         if (response.ok) {
//             ElMessage.success({
//                 message: "API 连接测试成功",
//                 duration: 1500
//             });
//         }
//     } catch (error) {
//         // 静默失败，不影响用户体验
//         console.warn("API 连接测试失败:", error);
//     }
// };
</script>

<style scoped lang="scss">
.settings-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);

    .top-bar {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 24px;
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color);

        h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: var(--el-text-color-primary);
        }
    }

    .settings-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        padding-bottom: 90px;

        .settings-section {
            margin-bottom: 32px;

            h2 {
                font-size: 16px;
                font-weight: 600;
                color: var(--el-text-color-primary);
                margin: 0 0 16px 0;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--el-border-color-lighter);
            }

            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                background: var(--el-fill-color-blank);
                border-radius: 8px;
                margin-bottom: 12px;
                transition: background 0.2s;

                &:hover {
                    background: var(--el-fill-color-light);
                }

                .setting-info {
                    flex: 1;

                    .setting-title {
                        // font-size: 15px;
                        font-weight: 500;
                        color: var(--el-text-color-primary);
                        margin-bottom: 4px;
                    }

                    .setting-desc {
                        // font-size: 13px;
                        color: var(--el-text-color-secondary);
                        max-width: 1000px;

                        >div {
                            margin-bottom: 4px;

                            &:last-child {
                                margin-bottom: 0;
                            }
                        }

                        :deep(.el-progress) {
                            width: 100%;
                        }
                    }
                }

                .api-input-group {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
            }
        }
    }
}
</style>
