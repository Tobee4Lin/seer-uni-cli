<template>
	<view>
		<view class="content-wrap">
			<view class="top-content">
				<view class="pic-wrap">
					<image src="/static/login/logo.png" mode="aspectFill" data-src="/static/user/user.png" @click="imgShow"></image>
				</view>
				<view class="text-content">
					<p class="sname">张三</p>
					<p class="sname">张三1</p>
				</view>
			</view>
			<view class="info-content">
				<view class="cu-list menu">
					<view class="cu-item arrow" @click="routeTo('../notice/index')">
						<view class="content">
							<image src="/static/user/check.png" class="png" mode="aspectFit"></image>
							<text class="text-grey text">公告中心</text>
						</view>
					</view>
					<view class="cu-item arrow custom-list-item" @click="logout">
						<view class="content">
							<image src="/static/user/exit.png" class="png" mode="aspectFit"></image>
							<text class="text-grey text">退出登录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			imgShow(e) {
				let src = e.currentTarget.dataset.src;
				uni.previewImage({
					current: src,
					urls: [src]
				});
			},
			logout() {
				let _this = this;
				uni.showModal({
					title: "提示",
					content: "确认退出登录吗？",
					success(res) {
						if (res.confirm) {
							_this.$emit("logout");
							_this.$showToast("退出成功", "success");
						} else if (res.cancel) {
							return;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content-wrap {
		height: 100vh;
		background-color: #F7F7FA;

		.top-content {
			display: flex;
			padding: 130rpx 20rpx 130rpx 40rpx;
			background-color: #0091FF;

			// background: linear-gradient(270deg,rgba(0,145,255,1) 0%,rgba(86,143,244,1) 100%);
			.pic-wrap {
				width: 150rpx;
				height: 150rpx;
				overflow: hidden;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, .7);
				text-align: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.text-content {
				flex: 3;
				margin-left: 30rpx;
				color: #FFFFFF;
				padding-top: 22rpx;

				p {
					font-size: 34rpx;
					font-weight: 500;
					line-height: 56rpx;
				}
			}
		}

		.info-content {
			.custom-list-item {
				margin-bottom: 25rpx;

				.icon-wrap {
					width: 48rpx;
					height: 48rpx;
					text-align: center;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.text {
				margin-left: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 1);
				line-height: 1.6em;
			}
		}
	}
</style>
