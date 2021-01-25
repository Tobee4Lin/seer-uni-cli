import {
	SERVER_URL,
	SERVER_PORT
} from "@/config/index.js"

const $http = (url, data = {}, method = "get", header) => {
	let deal_url = `${SERVER_URL}:${SERVER_PORT}/${url}`;

	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: "加载中",
			mask: true
		})
		uni.request({
			url: deal_url,
			method,
			header,
			data,
			success(res) {
				uni.hideLoading();
				if (res.data.code == 401) {
					//登录过期逻辑
					uni.showModal({
						title: "提示",
						content: "登录过期，请重新登录",
						showCancel: false,
						success() {
							uni.reLaunch({
								url: "/pages/login/home"
							});
							reject(res);
						}
					});
				} else {
					resolve(res);
				}
			},
			fail(err) {
				uni.showToast({
					title: "网络出了差错,请重试",
					icon: "none"
				});
				reject(err);
			}
		});
	});
}

export default $http;
