import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Settings from "@/views/Settings.vue";
import SongDetail from "@/views/SongDetail.vue";

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
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
