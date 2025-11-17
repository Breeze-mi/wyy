import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style.css";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ElementPlus);
if (
  process.env.NODE_ENV === "development" &&
  (window as any)?.electronAPI?.openF12
) {
  window.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      (window as any)?.electronAPI?.openF12();
      return false;
    }
  });
}
app.mount("#app");
