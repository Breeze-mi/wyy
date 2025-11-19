import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Settings from "@/views/Settings.vue";
import SongDetail from "@/views/SongDetail.vue";
import PlaylistDetail from "@/views/PlaylistDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/song-detail",
    name: "SongDetail",
    component: SongDetail,
    meta: { fullscreen: true }, // 标记为全屏页面
  },
  {
    path: "/playlist/:id",
    name: "PlaylistDetail",
    component: PlaylistDetail,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
