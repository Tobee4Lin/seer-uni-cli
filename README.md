##### TODO:
- [x] 1. 封装请求，API接口，拦截器设置，接口返回状态处理，权限处理等;
- [x] 2. 状态管理相关，封装vuex，本地存储;
- [x] 3. 一些常用工具方法的封装，包括对uniapp的一些API进行二次封装，如showModal，showToast等;
- [x] 4. 对一些常用插件进行集成，如上拉加载更多，下拉刷新，图片上传等插件;

- 上拉加载，下拉刷新功能，使用mescroll-uni插件。示例见/pages/demo/list
- 图片上传使用QS-inputs-split中的QSInfinitePics插件。示例见/pages/demo/uploadPic

#### 使用方式
1. 全局安装脚手架：npm install seer-uni-cli -g 
2. 根据脚手架创建项目：npm seer-uni-cli init my-project