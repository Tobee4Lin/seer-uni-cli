<template>
	<view>
		<view class="content">
			<view class="header">
				<image src="/static/login/school.png"></image>
			</view>

			<view class="list">
				<view class="list-call">
					<image class="img" src="/static/login/user1.png"></image>
					<input class="title" v-model="username" type="text" maxlength="50" placeholder="输入用户名" />
				</view>
				<view class="list-call">
					<image class="img" src="/static/login/pwd.png"></image>
					<input class="title" v-model="password" type="text" maxlength="50" placeholder="输入密码" :password="!showPassword" />
					<image class="img" :src="showPassword?'/static/login/op.png':'/static/login/cl.png'" @tap="display"></image>
				</view>
				
				<view style="position: relative;padding-top: 10rpx;">
					<view style="position: absolute;right: 0;">
						<checkbox-group @change="changeCheck">
							<label class="checkbox checkwords">
								<checkbox value="check" class="blue" style="transform:scale(0.7);" :checked="isChecked?true:false" /><text
								 style="font-size: 28rpx;color: #666;margin-left: 10rpx;display: inline-block;vertical-align: middle;">记住我</text>
							</label>
						</checkbox-group>
					</view>
				</view>
			</view>

			<view class="dlbutton" hover-class="dlbutton-hover" @tap="login()">
				<text>登录</text>
			</view>

			<view class="statement" style="color: #666;font-size: 22rpx;margin: 50rpx auto;">
				此小程序仅为指定学校使用，请凭用户账号和密码登录
			</view>
		</view>
	</view>
</template>

<script>
	import { setItem, getItem, removeItem } from "@/utils/storage.js";
	export default {
		onLoad(opt) {
			
		},
		data() {
			return {
				username: "",
				password: "",
				showPassword: false,
				isChecked: getItem("_rememberPsw") || false
			};
		},
		mounted() {
			//缓存的账号
			const _username = getItem("_username");
			//缓存的密码
			const _password = getItem("_password");
			if (_username && _password) {
				this.username = _username;
				this.password = _password;
			} else {
				this.username = "";
				this.password = "";
			}
		},
		methods: {
			RadioChange(e) {
				this.currentPrincipal = e.detail.value;
			},
			display() {
				this.showPassword = !this.showPassword;
			},
			changeCheck(e) {
				this.isChecked = e.detail.value[0] == 'check' ? true : false;
			},
			login() {
				if (!this.username) {
					this.$showToast("用户名不能为空");
					return;
				}
				if (!this.password) {
					this.$showToast("密码不能为空");
					return;
				}
				if (this.isChecked) {
					setItem("_username", this.username);
					setItem("_password", this.password);
					setItem("_rememberPsw", this.isChecked);
				} else {
					removeItem("_username");
					removeItem("_password");
					removeItem("_rememberPsw");
				}
				uni.switchTab({
					url: "../index/index"
				});
			}
		}
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.header {
		width: 140rpx;
		height: 140rpx;
		background: rgba(63, 205, 235, 1);
		box-shadow: 0upx 12upx 13upx 0upx rgba(63, 205, 235, 0.47);
		border-radius: 50%;
		margin-top: 30upx;
		margin-left: auto;
		margin-right: auto;
	}

	.header image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding-top: 50upx;
		padding-left: 70upx;
		padding-right: 70upx;
	}

	.list-call {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100upx;
		color: #333333;
		border-bottom: 1upx solid rgba(230, 230, 230, 1);
	}

	.list-call .img {
		width: 40upx;
		height: 40upx;
	}

	.list-call .title {
		flex: 1;
		text-align: left;
		font-size: 32upx;
		line-height: 100upx;
		margin-left: 16upx;
	}

	.dlbutton {
		color: #FFFFFF;
		font-size: 34upx;
		width: 470upx;
		height: 100upx;
		background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
		box-shadow: 0upx 0upx 13upx 0upx rgba(164, 217, 228, 0.2);
		border-radius: 50upx;
		line-height: 100upx;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-top: 100upx;
	}

	.dlbutton-hover {
		background: linear-gradient(-90deg, rgba(63, 205, 235, 0.9), rgba(188, 226, 158, 0.9));
	}

	.xieyi {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		margin-top: 80upx;
		color: #FFA800;
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}

	.xieyi text {
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
