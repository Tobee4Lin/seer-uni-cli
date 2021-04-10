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
		components: {
			YouScroll
		},
		data() {
			return {
				topNav: "",
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
				],

				boardcastList: [],
				noticeList: [],

				isBoardcastSearch: true,
				boardcastPage: 1,
				totalBoardcastElements: 0,

				isNoticeSearch: true,
				noticePage: 1,
				totalNoticeElements: 0,
				
				orderParams: [{
					"fieldName": "notice.createDate",
					"order": "desc"
				}]
			}
		},
		// onReady() {
		// 	let _this = this;
		// 	uni.createSelectorQuery().select('.border-bottom').boundingClientRect(function(e) {
		// 		_this.topNav = e.height;
		// 	}).exec();
		// },
		created() {
			this.getNoticesList();
			this.getBoartcastsList();
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
				this.isNoticeSearch = true;
				this.noticePage = 1;
				await this.getNoticesList();
				this.isNoticeSearch = false;
				done();
			},
			async onPullDownBoardcast(done) {
				this.isBoardcastSearch = true;
				this.boardcastPage = 1;
				await this.getBoartcastsList();
				this.isBoardcastSearch = false;
				done();
			},
			onLoadMore(e) {},
			getNoticesList() {
				return new Promise((resolve, reject) => {
					API.getAllNotice({
						orderParams: this.orderParams,
						searchParams: [{
							"fieldName": "notice.broadcast",
							"operate": "eq",
							"value": 0
						}, ],
						page: this.noticePage
					}).then(res => {
						if (res.data.code == 200) {
							this.totalNoticeElements = res.data.data.totalElements; //总条数
							if (this.isNoticeSearch) {
								this.noticeList = [];
								this.noticeList = res.data.data.list;
							} else {
								this.noticeList = this.noticeList.concat(res.data.data.list);
							}
							this.noticeList.map(item => {
								item.noticeTypeNameArr = item.noticeTypeName.split(",");
							})
							resolve();
						}
					})
				})
			},
			getBoartcastsList() {
				return new Promise((resolve, reject) => {
					API.getAllNotice({
						orderParams: this.orderParams,
						searchParams: [{
							"fieldName": "notice.broadcast",
							"operate": "eq",
							"value": 1
						}, ],
						page: this.boardcastPage
					}).then(res => {
						if (res.data.code == 200) {
							this.totalBoardcastElements = res.data.data.totalElements; //总条数
							if (this.isBoardcastSearch) {
								this.boardcastList = [];
								this.boardcastList = res.data.data.list;
							} else {
								this.boardcastList = this.boardcastList.concat(res.data.data.list);
							}
							this.boardcastList.map(item => {
								item.noticeTypeNameArr = item.noticeTypeName.split(",");
							})
							resolve();
						}
					})
				})
			},
			showOrderDetail(id) {
				uni.navigateTo({
					url: `./detail?id=${id}`
				});
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
