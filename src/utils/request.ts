import { useFetch } from "@vueuse/core";

// 网易云音乐 API 基础地址
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export const request = async <T>(url: string, method: Method, body?: any) => {
	const options: any = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (body && (method === "POST" || method === "PUT")) {
		options.body = JSON.stringify(body);
	}

	const { data, isFetching, error } = await useFetch<T>(
		`${baseUrl}${url}`,
		options
	).json();

	return { data, isFetching, error };
};

export const Request = {
	get: async <T>(url: string) => {
		return request<T>(url, "GET");
	},
	post: async <T>(url: string, body?: any) => {
		return request<T>(url, "POST", body);
	},
	put: async <T>(url: string, body?: any) => {
		return request<T>(url, "PUT", body);
	},
	delete: async <T>(url: string) => {
		return request<T>(url, "DELETE");
	},
};

export default Request;
