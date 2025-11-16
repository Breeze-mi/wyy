import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// import DefaultLayout from "../layouts/DefaultLayout.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/views/Home.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
