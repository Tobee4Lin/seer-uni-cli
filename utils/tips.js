// 全局封装showToast方法
export const showToast = (title, type = "") => {
	uni.showToast({
		icon: type == "success" ? "success" : "none",
		title
	});
}

// 全局封装showModal方法
export const showModal = (content, successCallback) => {
	let params = {
		title: "提示",
		content,
		success: (res) => {
			if (res.confirm) {
				successCallback();
			}
		}
	};
	uni.showModal(params);
}