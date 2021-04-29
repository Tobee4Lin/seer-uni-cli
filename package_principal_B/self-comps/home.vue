<template>
	<view class="wrap">
		<uni-notice-bar showIcon="true" :noticeList="noticesList" :showGetMore="true" @getmore="getNoticeDetail" speed="50" scrollable="true" single="true" v-if="noticesList.length > 0"></uni-notice-bar>
		<view class="block-wrap" style="border-bottom: none;">
			<view class="cu-bar bg-white">
				<view class="action title">
					我的待办
				</view>
				<view class="message" @click="routeTo('../task/todo-task-type-list')">
					查看全部
					<text class="cuIcon-right" style="margin-left: 5rpx;color: #999999;"></text>
				</view>
			</view>
			<view>
				<view class="customer-bg radius" v-for="(item, index) in todoTaskTypeList" :key="index" @click="routeTodoTask(item.id)">
					<view class="customer-text">{{item.name}}</view>
					<view class="num-text">{{item.count}}</view>
				</view>
			</view>
		</view>

		<view class="block-wrap" style="padding-bottom: 20rpx;">
			<view class="cu-bar bg-white">
				<view class="action title">
					我派发的
				</view>
				<view class="message" @click="routeTo('../task/my-task-type-list')">
					查看全部
					<text class="cuIcon-right" style="margin-left: 5rpx;color: #999999;"></text>
				</view>
			</view>
			<view>
				<view class="customer-bg radius" v-for="(item, index) in mytaskTypeList" :key="index" @click="routeMyTask(item.id)">
					<view class="customer-text">{{item.name}}</view>
					<view class="num-text">{{item.count}}</view>
				</view>
			</view>
		</view>

		<view class="block-wrap">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action title">
					新增检查单
				</view>
			</view>
			<view class="cu-list grid col-4">
				<view class="cu-item" @click="routeTo('../inspect/choose-template')">
					<view class="pic-wrap">
						<image src="/static/login/logo.png" mode="aspectFill"></image>
					</view>
					<text>新增检查单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue";
	
	export default {
		data() {
			return {
				todoTaskTypeList: [],
				mytaskTypeList: [],
				noticesList: []
			};
		},
		components: {
			uniNoticeBar
		},
		created() {
			this.getAllTaskType();
			this.getAllMyTaskType();
			this.getNoticesList();
		},
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			
			routeTodoTask(tid) {
				this.$navigateTo("../task/todo-task-list", {
					typeId: tid
				});
			},
			
			routeMyTask(tid) {
				this.$navigateTo("../task/my-task-list", {
					typeId: tid
				});
			},

			getAllTaskType() {
				return new Promise((resolve, reject) => {
					API.getAllTaskType({
						assignee: "ys_fj_admin_li",
						executeOrganizationId: "1229619270476890115"
					}).then(res => {
						if (res.data.code == 200) {
							this.todoTaskTypeList = res.data.data.filter(i => i.name.indexOf("视频") < 0 && i.name.indexOf("日常") < 0).splice(
								0, 3);
							resolve();
						}
					})
				})
			},

			getAllMyTaskType() {
				return new Promise((resolve, reject) => {
					API.getAllMyTaskType({
						issuedOrganizationId: "1229619270476890115",
						issuer: "ys_fj_admin_li"
					}).then(res => {
						if (res.data.code == 200) {
							this.mytaskTypeList = res.data.data.splice(0, 3);
							resolve();
						}
					})
				})
			},
			
			getNoticesList() {
				API.getNoticesList({
					size: -1
				}).then(res => {
					if(res.data.code == 200) {
						this.noticesList = res.data.data.list;
					}
				})
			},
			
			getNoticeDetail(index) {
				this.$navigateTo(`../notice/detail?id=${this.noticesList[index].id}`);
			},
		}
	}
</script>

<style lang="less" scoped>
	.wrap {
		padding: 30rpx 0;

		/deep/ button {
			margin-bottom: 14rpx;
		}

		.block-wrap {
			border-bottom: 25rpx solid #F7F7FA;

			.customer-bg {
				background: linear-gradient(to left, #6075ed, #008dd3);
				width: 30%;
				// width: 320rpx;
				height: 180rpx;
				margin-left: 20rpx;
				margin-bottom: 20rpx;
				display: inline-block;
			}

			.customer-text {
				height: 50%;
				text-align: center;
				color: #FFFFFF;
				font-size: 30rpx;
				line-height: 42rpx;
				padding-top: 35rpx;
			}

			.num-text {
				text-align: center;
				color: #FFFFFF;
				font-size: 40rpx;
				line-height: 56rpx;
				height: 50%;
				padding-top: 17rpx;
			}

			.check-tag {
				position: absolute;
				right: 13rpx;
				top: -11rpx;

				text {
					font-size: 30rpx !important;
					color: #39b54a;
				}
			}

			.title {
				font-size: 32rpx;
				font-weight: 600;
				line-height: 48rpx;
			}

			.message {
				color: #999999;
				font-size: 24rpx;
				margin-right: 15rpx;
			}

			.pic-wrap {
				width: 72rpx;
				height: 72rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
					object-fit: fill;
				}
			}
		}
	}
</style>
