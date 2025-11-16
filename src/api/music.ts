import Request from "@/utils/request";

// 响应数据类型
export interface ApiResponse<T = any> {
	status: number;
	success: boolean;
	message: string;
	data: T;
}

// 歌曲信息
export interface Song {
	id: string;
	name: string;
	artists: string;
	album: string;
	picUrl: string;
	duration?: number;
}

// 歌曲详情
export interface SongDetail {
	name: string;
	ar_name: string;
	al_name: string;
	level: string;
	size: string;
	url: string;
	pic: string;
	lyric: string;
}

// 歌单信息
export interface Playlist {
	name: string;
	creator: string;
	description: string;
	coverImgUrl: string;
	trackCount: number;
	tracks: Song[];
}

// 专辑信息
export interface Album {
	name: string;
	artist: string;
	description: string;
	coverImgUrl: string;
	songs: Song[];
}

// 音乐 API
const MusicApi = {
	// 健康检查
	health: async () => {
		return Request.get<ApiResponse>("/health");
	},

	// 搜索歌曲
	search: async (keyword: string, limit: number = 30) => {
		return Request.post<ApiResponse<Song[]>>("/search", {
			keyword,
			limit,
		});
	},

	// 获取歌曲详情和播放链接
	getSong: async (id: string | number, level: string = "lossless") => {
		return Request.post<ApiResponse<SongDetail>>("/song", {
			id: String(id), // 修正参数名为id
			level,
			type: "json",
		});
	},

	// 获取歌单
	getPlaylist: async (id: string) => {
		return Request.post<ApiResponse<{ playlist: Playlist }>>("/playlist", {
			id,
		});
	},

	// 获取专辑
	getAlbum: async (id: string) => {
		return Request.post<ApiResponse<{ album: Album }>>("/album", {
			id,
		});
	},
};

export default MusicApi;
