import { createApp } from "vue";
import { store } from "./store";
import i18n from "./lang";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// tailwindcss
import "./styles/tailwind.css";
// vant
import "vant/lib/index.css";
// svg icon
import "virtual:svg-icons-register";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);

app.mount("#app");
