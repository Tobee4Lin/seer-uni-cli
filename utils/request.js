/*
 * @fileoverview | 基于uni-request的二次扩展，Promise 对象实现的request使用方式，支持请求和响应拦截
 * @Author: zhengzebin
 * @version 0.1 | 2021-1-26 // Initial version.
 * @Date:   2021-1-26 10:20:27
 * @Last Modified by: zhengzebin
 */
import {
	SERVER_URL,
	SERVER_PORT
} from "@/config";

const request = (url, data, method, header) => {
	//默认请求配置
	const defaultConfig = {
		baseUrl: `${SERVER_URL}:${SERVER_PORT}/`,
		header,
		data: {},
		method: "GET",
		success() {},
		fail() {},
		complete() {}
	};
	// 拦截器相关
	const interceptor = {
		request: null,
		response: null
	};

	let options = {
		url: url.includes("com") && url.includes("http") ? url : defaultConfig.baseUrl + url,
		data: data || {},
		method: method || defaultConfig.method,
		header: Object.assign({}, header)
	};

	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: "加载中",
			mask: true
		});
		let _config = null;
		// 响应相关
		options.complete = (res) => {
			res.config = _config;
			uni.hideLoading();
			resolve(res);
			// if (/20\d$/.test(String(res.data.code))) {
			// 	resolve(res);
			// } else if (res.data.code === 401) {
			// 	// token过期
			// 	uni.showModal({
			// 		title: "提示",
			// 		content: "登录过期，请重新登录",
			// 		showCancel: false,
			// 		success() {
			// 			uni.reLaunch({
			// 				url: "/pages/login/index"
			// 			});
			// 			reject(res);
			// 		}
			// 	});
			// } else {
			// 	reject(res);
			// }
			// 拦截response
			if (interceptor.response) {
				let newResponse = interceptor.response(res);
				if (newResponse) {
					res = newResponse;
				}
			}
			// 统一的响应日志记录
			_reslog(res);
		};
		options.fail = (res) => {
			uni.showToast({
				icon: "none",
				title: "网络出了差错,请重试"
			});
		};

		// 请求相关
		_config = Object.assign({}, defaultConfig, options);
		// _config.requestId = new Date().getTime()
		// if (interceptor.request) {
		// 	interceptor.request(_config)
		// }
		uni.request(_config);
	})
}

export default request;

/**
 * 响应接口日志记录
 */
const _reslog = res => {
	if (process.env.NODE_ENV === "development") {
		console.log("地址：" + res.config.url);
	}
}
