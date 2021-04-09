<template>
	<view>
		<HMfilterDropdown :filterData="filterData" :defaultSelected="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>

		<you-scroll ref="scroll" @onPullDown="onPullDown">
			<view class="scroll-items">
				<view v-if="taskOrders.length == 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
					<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
					<view class="text-gray">
						暂无内容
					</view>
				</view>
				<view v-else class="scroll-item" v-for="(ite, ind) in taskOrders" :key="ind" @click="showOrderDetail(ite)">
					<view class="scroll-item-text-box">
						<view class="left">
							<view class="name text-cut">
								{{ite.title}}
							</view>
							<view class="info">
								<text class="cuIcon-time"></text>
								下发时间：<text>{{ite.beginTime}}</text>
							</view>
							<template v-if="ite.status != '1'">
								<view class="info">
									<text class="cuIcon-time"></text>
									截止时间：<text>{{ite.limitTime}}</text>
								</view>
								<view>
									<view v-if="ite.status == '0'" class="cu-tag bg-red light sm round custom-pos">未完成</view>
									<view v-else-if="ite.status == '2'" class="cu-tag bg-yellow light sm round custom-pos">已超时</view>
									<view v-else class="cu-tag bg-grey light sm round custom-pos">已取消</view>
								</view>
							</template>
							<!-- 已完成 -->
							<template v-else>
								<view class="info">
									<text class="cuIcon-time"></text>
									完成时间：
									<text>{{ite.finishedTime}}</text>
								</view>
								<view>
									<view class="cu-tag bg-green light sm round custom-pos">已完成</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>
		</you-scroll>
	</view>
</template>

<script>
	import API from "@/api/index.js"
	import YouScroll from "@/components/you-scroll/index";
	import HMfilterDropdown from "@/components/HM-filterDropdown/HM-filterDropdown.vue";
	import { getItem } from "@/utils/storage.js";
	
	export default {
		props: {
			taskOrders: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			YouScroll,
			HMfilterDropdown
		},
		data() {
			return {
				filterDropdownValue: [],
				filterData: [],
				rStatusMap: {
					"全部": "",
					"未完成": 0,
					"已完成": 1,
					"已超时": 2,
					"已取消": 3
				},

				searchParams: []
			}
		},
		created() {
			setTimeout(() => {
				this.filterDropdownValue = [
					[
						[2, 3]
					]
				];
				this.filterData = [
					{
						"type": 'filter',
						"submenu": [{
							"name": "完成状态",
							"submenu": [{
									"name": "全部",
									"value": "全部"
								},
								{
									"name": "已完成",
									"value": "已完成"
								},
								{
									"name": "未完成",
									"value": "未完成"
								},
								{
									"name": "已超时",
									"value": "已超时"
								},
								{
									"name": "已取消",
									"value": "已取消"
								}
							]
						}]
					}
				];
			}, 0);
		},
		
		methods: {
			async confirm(e) {
				let valueArr = e.value[0];
				let _r = [];
				if (valueArr[0].length > 0) {
					for (let item of valueArr[0]) {
						if (item === "全部") {
							break;
						}
						_r.push(this.rStatusMap[item]);
					}
				}
				this.searchParams = [{
						"fieldName": "executor.executeOrganizationId",
						"operate": "eq",
						"value": getItem("principal_id")
					},
					{
						"fieldName": "batch.inspect",
						"operate": "eq",
						"value": 1
					},
					{
						"fieldName": "task.status",
						"operate": "in",
						"value": _r.join(",")
					}
				];

				this.$emit("confirm", this.searchParams);
			},
			async onPullDown(done) {
				await this.$emit("getTaskList", 1);
				done();
			},
			
			showOrderDetail(item) {
				let { id, status, workOrderId } = item;
				if(status == 3) {
					this.$showToast("该任务已取消");
					return;
				}
				if (status == 0 || status == 2) {
					this.$emit("dealDetailPath", `./detail?id=${id}`);
				} else {
					this.$emit("dealDetailPath", `./preview-order-detail?id=${workOrderId}`);
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.scroll-items {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 20rpx;
		margin-top: 90rpx;

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

		.left {
			position: relative;
			width: 100%;
			display: inline-block;
			word-wrap: break-word;

			.custom-pos {
				position: absolute;
				right: 20rpx;
				top: 10rpx;
			}

			.name_0 {
				font-size: 24rpx;
				// font-family:PingFangSC-Medium,PingFang SC;
				color: #777;
				line-height: 38rpx;
			}

			.name {
				font-size: 32rpx;
				// font-family:PingFangSC-Medium,PingFang SC;
				font-weight: 600;
				color: rgba(55, 55, 55, 1);
				line-height: 48rpx;
				width: 82%;
			}

			.info {
				font-size: 26rpx;
				// font-family: PingFangSC-Regular,PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				line-height: 1.8;

				text {
					color: #999999;
					margin-right: 8rpx;
					line-height: 36rpx;
				}
			}
		}

		.right {
			display: inline-block;
			margin-left: 30rpx;
			height: 100%;
			vertical-align: top;
		}
	}
</style>
