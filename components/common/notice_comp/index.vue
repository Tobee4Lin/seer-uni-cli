<template>
	<view>
		<view class="border-bottom" style="top: 0;">
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item, index) in cList" :key="index" @click="tabSelect($event, item)"
				 :data-id="index">
					{{item.name}}
				</view>
			</scroll-view>
		</view>

		<view class="wrap" v-if="selectChildValue == 'boardcast-list'">
			<you-scroll ref="boardcastScroll" @onPullDown="onPullDownNotice">
				<view class="scroll-items">
					<view v-if="boardcastList.length === 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
						<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
						<view class="text-gray">
							暂无内容
						</view>
					</view>
					<view v-else class="scroll-item" v-for="(ite, ind) in boardcastList" :key="ind" @click="showOrderDetail(ite.id)">
						<view class="scroll-item-text-box">
							<view class="name custom-text-cut-2">
								{{ite.title}}
							</view>
							<view class="info">
								<text class="cuIcon-time"></text>
								<text>{{ite.createDate}}</text>
							</view>
							<view>
								<view class="cu-tag bg-gray round" style="margin: 10rpx 10rpx 10rpx 0;" v-for="(i, idx) in ite.noticeTypeNameArr"
								 :key="idx">
									{{i}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</you-scroll>
		</view>

		<view class="wrap" v-else-if="selectChildValue == 'notice-list'">
			<you-scroll ref="noticeScroll" @onPullDown="onPullDownBoardcast">
				<view class="scroll-items">
					<view v-if="noticeList.length === 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
						<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
						<view class="text-gray">
							暂无内容
						</view>
					</view>
					<view v-else class="scroll-item" v-for="(ite, ind) in noticeList" :key="ind" @click="showOrderDetail(ite.id)">
						<view class="scroll-item-text-box">
							<view class="name custom-text-cut-2">
								{{ite.title}}
							</view>
							<view class="info">
								<text class="cuIcon-time"></text>
								<text>{{ite.createDate}}</text>
							</view>
							<view>
								<view class="cu-tag bg-gray round" style="margin: 10rpx 10rpx 10rpx 0;" v-for="(i, idx) in ite.noticeTypeNameArr"
								 :key="idx">
									{{i}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</you-scroll>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js"
	import YouScroll from "@/components/you-scroll/index";
	
	export default {
		props: {
			noticeList: {
				type: Array,
				default () {
					return [];
				}
			},
			boardcastList: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			YouScroll
		},
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				selectChildValue: "boardcast-list",
				cList: [{
						name: "广播",
						value: "boardcast-list"
					},
					{
						name: "公告",
						value: "notice-list"
					},
				]
			}
		},
		async onReachBottom() {
			if (this.selectChildValue === "notice-list" &&
				this.noticeList.length < this.totalNoticeElements) {
				this.noticePage++;
				this.isNoticeSearch = false;
				await this.getNoticesList();
			}
			if (this.selectChildValue === "boardcast-list" &&
				this.boardcastList.length < this.totalBoardcastElements) {
				this.boardcastPage++;
				this.isBoardcastSearch = false;
				await this.getBoartcastsList();
			}
		},
		methods: {
			tabSelect(e, item) {
				this.selectChildValue = item.value;
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			},
			async onPullDownNotice(done) {
				await this.$emit("getNoticesList", 1);
				done();
			},
			async onPullDownBoardcast(done) {
				await this.$emit("getBoartcastsList", 1);
				done();
			},
			showOrderDetail(id) {
				this.$emit("showOrderDetail", id);
			},

		}
	}
</script>

<style scoped lang="less">
	.border-bottom {
		border-bottom: 1rpx solid #E5E5E5;
		position: fixed;
		z-index: 130;
		width: 100%;
	}

	.wrap {
		z-index: 120;
		width: 100%;
		margin-top: 100rpx;
	}

	.scroll-items {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 20rpx;

		.loading {
			margin: 0 auto;
		}
	}

	.scroll-item {
		padding: 25rpx;
		background-color: white;
		border-radius: 8rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid rgba(229, 229, 229, 1);
		// &:first-child {
		// 	border-top: 1px solid rgba(229,229,229,1);
		// }

		.custom-text-cut-2 {
			margin-top: 10rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}

	.center {
		text-align: center;
		font-size: 28rpx;
		color: #8F8F94;
	}

	.scroll-item-image-box {
		flex-grow: 0;
	}

	.scroll-item-text-box {
		width: 100%;

		.name {
			font-size: 32rpx;
			font-weight: 600;
			color: rgba(55, 55, 55, 1);
			line-height: 48rpx;
		}

		.info {
			font-size: 26rpx;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);

			text {
				color: #999999;
				margin-right: 8rpx;
				line-height: 36rpx;
			}
		}
	}
</style>
