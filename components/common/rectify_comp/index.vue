<template>
	<view>
		<HMfilterDropdown :filterData="filterData" :defaultSelected="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>

		<you-scroll ref="scroll" @onPullDown="onPullDown">
			<view class="scroll-items">
				<view v-if="rectifyOrders.length === 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
					<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
					<view class="text-gray">
						暂无内容
					</view>
				</view>
				<view v-else class="scroll-item" v-for="(ite, ind) in rectifyOrders" :key="ind" @click="showOrderDetail(ite.id)">
					<view class="scroll-item-text-box">
						<view class="name text-cut">
							{{ite.rectifyPrincipalName}}
						</view>
						<view class="info">
							<text class="cuIcon-time"></text>
							下发时间：
							<text>{{ite.beginTime}}</text>
						</view>
						<view class="info">
							<text class="cuIcon-time"></text>
							截止时间：
							<text>{{ite.limitTime}}</text>
						</view>
						<view class="info" v-if="ite.status == '1'">
							<text class="cuIcon-time"></text>
							完成时间：
							<text>{{ite.finishedTime}}</text>
						</view>
						<view>
							<view class="cu-tag bg-green light sm round custom-pos" v-if="ite.status == '1'">已完成</view>
							<view class="cu-tag bg-yellow light sm round custom-pos" v-else-if="ite.status == '2'">已超时</view>
							<view class="cu-tag bg-red light sm round custom-pos" v-else>未完成</view>
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
			rectifyOrders: {
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
					"已超时": 2
				}
			}
		},
		created() {
			setTimeout(() => {
				this.filterDropdownValue = [
					[
						[0]
					]
				];
				this.filterData = [{
						"type": "filter",
						"submenu": [{
							"name": "整改状态",
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
								}
							]
						}]
					}

				]
			}, 0);
		},
		methods: {
			async onPullDown(done) {
				await this.$emit("getRectifyOrder", 1);
				done();
			},
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
						"fieldName": "rectify.rectifyPrincipalId",
						"operate": "eq",
						"value": getItem("principal_id")
					},
					{
						"fieldName": "status",
						"operate": "in",
						"value": _r.join(",")
					}
				];
				this.$emit("comfirm", this.searchParams);
			},
			showOrderDetail(id) {
				this.$emit("showOrderDetail", id);
			},

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
	}

	.scroll-item {
		padding: 25rpx;
		background-color: white;
		border-radius: 8rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid rgba(229, 229, 229, 1);
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
		position: relative;
		width: 100%;

		.custom-pos {
			position: absolute;
			right: 20rpx;
			top: 10rpx;
		}

		.name_0 {
			font-size: 24rpx;
			color: #777;
			line-height: 38rpx;
		}

		.name {
			font-size: 32rpx;
			font-weight: 600;
			color: rgba(55, 55, 55, 1);
			line-height: 48rpx;
			width: 82%;
		}

		.info {
			font-size: 26rpx;
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
</style>
