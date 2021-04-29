<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			this.autoUpdate();
		},
		methods: {
			autoUpdate: function() {
				let self = this
				// 获取小程序更新机制兼容
				if (wx.canIUse('getUpdateManager')) {
					const updateManager = wx.getUpdateManager();
					//1. 检查小程序是否有新版本发布
					updateManager.onCheckForUpdate(function(res) {
						// 请求完新版本信息的回调
						if (res.hasUpdate) {
							//检测到新版本，需要更新，给出提示
							wx.showModal({
								title: '更新提示',
								content: '检测到新版本，请下载新版本并重启小程序',
								showCancel: false, //隐藏取消按钮
								success: function(res) {
									if (res.confirm) {
										//2. 用户确定下载更新小程序，小程序下载及更新静默进行
										self.downLoadAndUpdate(updateManager);
									} else if (res.cancel) {
										//用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
										wx.showModal({
											title: '温馨提示',
											content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问',
											showCancel: false, //隐藏取消按钮
											confirmText: "确定更新", //只保留确定更新按钮
											success: function(res) {
												if (res.confirm) {
													//下载新版本，并重新应用
													self.downLoadAndUpdate(updateManager);
												}
											}
										})
									}
								}
							})
						}
					})
				} else {
					// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			},
			/**
			 * 下载小程序新版本并重启应用
			 */
			downLoadAndUpdate: function(updateManager) {
				let self = this;
				wx.showLoading();
				//静默下载更新小程序新版本
				updateManager.onUpdateReady(function() {
					wx.hideLoading();
					//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				})
				updateManager.onUpdateFailed(function() {
					// 新的版本下载失败
					wx.showModal({
						title: '提示',
						content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "uview-ui/index.scss";

	.cu-form-group input {
		text-align: right;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		/* background-image: url("./static/wave-bg.png"); */
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 28upx;
		font-weight: 300;
		width: 210upx;
	}

	.nav-title::first-letter {
		font-size: 34upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 24upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 32upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.tabBar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		border-top: 1px solid #E5E5E5;
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;

		.tabBar_list {
			width: 100%;
			display: flex;
			justify-content: space-between;

			image {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 2rpx;
			}

			.tabBar_item {
				// width: 95rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 24rpx;
				color: #969BA3;
			}

			.tabBar_item2 {
				width: 68rpx;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 20rpx;
				color: #969BA3;
				margin-top: -20rpx;
				position: relative;
				z-index: 101;

				image {
					width: 68rpx;
					height: 68rpx;
				}
			}
		}
	}
</style>
