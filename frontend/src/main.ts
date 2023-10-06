import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import "./app.css";
import "@fontsource-variable/inter";

import App from "./App.vue";
import router from "./router";
import * as echarts from "echarts";
import { chartTheme } from "./utils/theme";

const app = createApp(App);

echarts.registerTheme("dark", chartTheme);

app.use(createPinia());
app.use(router);

app.mount("#app");
