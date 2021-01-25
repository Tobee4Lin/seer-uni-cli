import Vue from 'vue'
import App from './App'
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import QSInfinitePics from "@/components/QS-inputs-split/elements/QS-infinitePics/index.vue"

Vue.config.productionTip = false

App.mpType = 'app'

//全局注册上拉加载，下拉刷新插件
Vue.component("mescroll-body", MescrollBody);

//全局注册图片上传插件
Vue.component("QSInfinitePics", QSInfinitePics);

const app = new Vue({
    ...App
})
app.$mount()


//TODO:
// 1. 封装请求,API接口,拦截器设置,接口返回状态处理,权限处理等;
// 2. 状态管理相关,封装vuex,本地存储;
// 3. 一些常用工具方法的封装,包括对uniapp的一些API进行二次封装,如showModal,showToast等;
// 4. 对一些插件进行二次封装,如上拉加载更多,下拉刷新等插件;

// - 发布npm私有包