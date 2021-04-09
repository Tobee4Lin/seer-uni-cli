<template>
	<view>
		<view class="border-bottom">
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?' cur':''" v-for="(item, index) in cList" :key="index" :style="{color: index==TabCur?'#0091FF':''}"
				 @click="tabSelect($event, item)" :data-id="index">
					{{item.name}}
				</view>
			</scroll-view>
		</view>

		<view class="notify" v-if="selectChildValue == 'unread'">
			<you-scroll @onPullDown="onPullDownUnreadNotify">
				<view class="scroll-items">
					<view v-if="unreadNotifies.length == 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 50px auto;">
						<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
						<view class="text-gray">
							暂无内容
						</view>
					</view>
					<view v-else class="cu-list list" style="margin-top: 50px;">
						<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in unreadNotifies"
						 :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
							<view class="flex_grow">
								<view class="flex_col">
									<view class="flex_grow">{{item.title}}</view>
									<view class="time">{{item.createDate.substr(0, 10)}}</view>
								</view>
								<view class="info">{{item.content}}</view>
							</view>
							<view class="move" style="top: 0;">
								<view class="bg-grey" @click="setRead(index)">标为已读</view>
								<!-- <view class="bg-red" @click="deleteNotify(index)">删除</view> -->
							</view>
						</view>
					</view>
				</view>
			</you-scroll>
		</view>

		<view class="notify" v-else-if="selectChildValue == 'read'">
			<you-scroll @onPullDown="onPullDownReadNotify">
				<view class="scroll-items">
					<view v-if="readNotifies.length == 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 50px auto;">
						<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
						<view class="text-gray">
							暂无内容
						</view>
					</view>
					<view v-else class="cu-list list" style="margin-top: 50px;">
						<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in readNotifies"
						 :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
							<view class="flex_grow">
								<view class="flex_col">
									<view class="flex_grow">{{item.title}}</view>
									<view class="time">{{item.createDate.substr(0, 10)}}</view>
								</view>
								<view class="info">{{item.content}}</view>
							</view>
							<view class="move" style="top: 0;">
								<view class="bg-grey" @click="setUnread(index)">标为未读</view>
								<!-- <view class="bg-red" @click="deleteNotify(index)">删除</view> -->
							</view>
						</view>
					</view>
				</view>
			</you-scroll>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import QSTabs from '@/components/QS-tabs/QS-tabs.vue';
	import YouScroll from '@/components/you-scroll/index';
	
	export default {
		props: {
			readNotifies: {
				type: Array,
				default () {
					return [];
				}
			},
			unreadNotifies: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			QSTabs,
			YouScroll
		},
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,

				TabCur: 0,
				scrollLeft: 0,
				selectChildValue: "unread",
				cList: [{
						name: "未读通知",
						value: "unread"
					},
					{
						name: "已读通知",
						value: "read"
					}
				]
			}
		},
		methods: {
			tabSelect(e, item) {
				this.modalName = null;
				this.selectChildValue = item.value;
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.$emit("tabSelect", this.selectChildValue);
			},
			showNotyfyDetail(id) {
				/* 因弹出遮罩问题，所以需要在遮罩弹出的情况下阻止列表事件的触发 */
				if (this.showShade) {
					return;
				}
				// uni.navigateTo({
				// 	url: `./detail?id=${id}`
				// });
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},

			setRead(index) {
				//标为已读
				this.$emit("setRead", index);
			},
			setUnread(index) {
				//标为未读
				this.$emit("setUnread", index);
			},
			deleteNotify(index) {},

			async onPullDownReadNotify(done) { // 下拉刷新
				await this.$emit("getReadNotifies", 1);
				done();
			},
			async onPullDownUnreadNotify(done) {
				await this.$emit("getUnreadNotifies", 1);
				done();
			}
		}
	}
</script>

<style scoped lang="less">
	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}

	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;

		font-size: 32rpx;
		// font-family:PingFangSC-Medium,PingFang SC;
		font-weight: 600;
		color: rgba(55, 55, 55, 1);
		line-height: 40rpx;
		// white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}

	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		user-select: none;
		touch-callout: none;

		&>view {
			padding: 24rpx 30rpx;
			position: relative;

			&:not(:last-child) {
				border-bottom: 1rpx solid #e5e5e5;
			}

			&>view {
				line-height: 40rpx;

				.time,
				.info {
					color: rgba(153, 153, 153, 1);
					font-size: 26rpx;
				}

				.time {
					font-weight: 400;
					width: 150rpx;
					text-align: right;
				}

				.info {
					font-weight: 400;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; // 控制多行的行数
					-webkit-box-orient: vertical;
				}
			}
		}

	}

	.border-bottom {
		border-bottom: 1rpx solid #E5E5E5;
		position: fixed;
		z-index: 130;
		width: 100%;

		.nav .cu-item {
			margin: 0 !important;
			width: 50%;
			text-align: center;
		}
	}

	.notify {
		// position: fixed;
		z-index: 120;
		width: 100%;
	}

	.scroll-items {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 20rpx;
	}
</style>
