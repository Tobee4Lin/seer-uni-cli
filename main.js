import Vue from "vue";
import App from "./App";
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import QSInfinitePics from "@/components/QS-inputs-split/elements/QS-infinitePics/index.vue";
import store from "./store/index.js";

import { navigateTo } from "@/utils/route.js";
Vue.prototype.$navigateTo = navigateTo;

import { showToast, showModal } from "@/utils/tips.js";
Vue.prototype.$showToast = showToast;
Vue.prototype.$showModal = showModal;

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false;
Vue.prototype.$store = store;

App.mpType = "app";

//全局注册上拉加载，下拉刷新插件
Vue.component("mescroll-body", MescrollBody);

//全局注册图片上传插件
Vue.component("QSInfinitePics", QSInfinitePics);

const app = new Vue({
    ...App
});
app.$mount();