<template>
	<view class="content">
		<!-- 首页 -->
		<view style="margin-bottom: 200rpx;" :style="{'display':showIndex == 0 ?'block':'none'}">
			<Home ref="home" />
		</view>
		<!-- 消息 -->
		<view style="margin-bottom: 200rpx;" :style="{'display':showIndex == 1 ?'flex':'none'}">
			<Notify ref="notify" style="width: 100%;"/>
		</view>
		<!-- 个人中心 -->
		<view :style="{'display':showIndex == 2? 'block':'none'}">
			<User ref="user" @logout="logout" />
		</view>
		<view class="tabBar">
			<view class="tabBar_list">
				<view v-for="(item, index) in tabNavList" :key="index" class="tabBar_item" @tap="changeTabbar(index, item.name)" style="width: 33%;">
					<!-- <view :class="item.icon" :style="{'color': showIndex == index ? '#0091FF' : '#bbb', 'font-size': '48rpx'}"></view> -->
					<image v-if="showIndex == index" :src="item.activeImg"></image>
					<image v-else :src="item.inactiveImg"></image>
					<view :class="{'tabBar_name':true,'nav_active':showIndex == index}" :style="{'color': showIndex == index ? '#0091FF' : '#bbb'}">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Home from "../../self-comps/home.vue";
	import Notify from "../../self-comps/notify.vue";
	import User from "../../self-comps/user.vue";

	export default {
		components: {
			Home,
			Notify,
			User
		},
		data() {
			return {
				showIndex: 0,
				tabNavList: [{
					"icon": "cuIcon-homefill",
					"inactiveImg": "/static/tabBar/home.png",
					"activeImg": "/static/tabBar/home-active.png",
					"name": "首页"
				}, {
					"icon": "cuIcon-apps",
					"inactiveImg": "/static/tabBar/ring.png",
					"activeImg": "/static/tabBar/ring-active.png",
					"name": "消息"
				}, {
					"icon": "cuIcon-cartfill",
					"inactiveImg": "/static/tabBar/user.png",
					"activeImg": "/static/tabBar/user-active.png",
					"name": "我的"
				}]
			};
		},
		onReachBottom() {
			if (this.showIndex === 1) {
				this.$refs.notify.dealReachBottom();
			}
		},
		onShow() {
			uni.hideHomeButton();
		},
		// onPullDownRefresh(e) {
		// 	if (this.showIndex === 1) {
		// 		uni.stopPullDownRefresh();
		// 		return false;
		// 	}
		// },
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			changeTabbar(tIndex, name) {
				this.showIndex = tIndex;
				uni.setNavigationBarTitle({
					title: name
				});
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff"
				});
				
				if (this.showIndex == 0) {

				}
				if (this.showIndex == 1) {

				}
				if (this.showIndex == 2) {
					uni.setNavigationBarColor({
						frontColor: "#ffffff",
						backgroundColor: "#0091FF"
					});
				}
			},
			logout() {
				uni.reLaunch({
					url: "../../../pages/login/index"
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	
</style>
