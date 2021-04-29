<template>
	<view class="wrap">
		<uni-notice-bar showIcon="true" :noticeList="noticesList" :showGetMore="true" @getmore="getNoticeDetail" speed="50" scrollable="true" single="true" v-if="noticesList.length > 0"></uni-notice-bar>
		<view class="block-wrap" style="border-bottom: none;">
			<view class="cu-bar bg-white solid-bottom" style="min-height: 0;">
				<view class="action title">
					我的待办
				</view>
			</view>
			<view class="cu-list grid col-4">
				<view class="cu-item" v-for="(item, index) in todoList" :key="index" @click="routeTo(item.url)">
					<view class="pic-wrap" style="width: auto; height:auto;">
						<text style="font-size: 26rpx !important">{{item.name}}</text>
					</view>
					<text style="color: #E02020;font-size: 40rpx !important;">{{item.num}}</text>
				</view>
			</view>
		</view>
		
		<!-- <view class="block-wrap">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action title">
					查看监控视频
				</view>
			</view>
			<view class="cu-list grid col-4">
				<view class="cu-item" @click="routeTo('../video/index')">
					<view class="pic-wrap">
						<image src="/static/login/logo.png" mode="aspectFill"></image>
					</view>
					<text>查看视频</text>
				</view>
			</view>
		</view> -->

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
				todoList: [{
						name: "检查中心",
						url: "../inspect/index",
						num: 1
					},
					{
						name: "整改中心",
						url: "../rectify/index",
						num: 2
					},
					{
						name: "预警中心",
						url: "../warning/index",
						num: 1
					},
					{
						name: "任务中心",
						url: "../task/index",
						num: 3
					},
				],
				noticesList: []
			};
		},
		components: {
			uniNoticeBar
		},
		created() {
			this.getNoticesList();
		},
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			getNoticesList() {
				API.getAllNotice({
					size: -1
				}).then(res => {
					if(res.data.code == 200) {
						this.noticesList = res.data.data.list;
					}
				})
			},
			
			getNoticeDetail(index) {
				this.routeTo(`../notice/detail?id=${this.noticesList[index].id}`);
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

			.title {
				font-size: 32rpx;
				font-weight: 600;
				line-height: 48rpx;
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
