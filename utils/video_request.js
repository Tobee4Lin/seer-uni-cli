/*
 * @Author: zhengzebin
 * @version 0.1 | 2021-1-26 // Initial version.
 * @Date:   2021-1-26 10:20:27
 * @Last Modified by: zhengzebin
 */

const video_request = (url, data, method, header) => {
	//默认请求配置
	const defaultConfig = {
		baseUrl: `${VIDEO_SERVER_URL}:${VIDEO_SERVER_PORT}/`,
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
			// 拦截response
			if (interceptor.response) {
				let newResponse = interceptor.response(res);
				if (newResponse) {
					res = newResponse;
				}
			}
		};
		options.fail = (res) => {
			uni.showToast({
				icon: "none",
				title: "网络出了差错,请重试"
			});
		};

		// 请求相关
		_config = Object.assign({}, defaultConfig, options);
		uni.request(_config);
	})
}

export default video_request;