<template>
	<view>
		<HMfilterDropdown :filterData="filterData" :defaultSelected="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>

		<you-scroll ref="scroll" @onPullDown="onPullDown">
			<view class="scroll-items">
				<view v-if="warningOrders.length === 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
					<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
					<view class="text-gray">
						暂无内容
					</view>
				</view>
				<view v-else class="scroll-item" v-for="(ite, ind) in warningOrders" :key="ind" @click="showOrderDetail(ite.id, ite.tenantId)">
					<view class="scroll-item-text-box">
						<view class="name text-cut">
							{{ite.typeName}}
						</view>
						<view class="info">
							<text>预警等级：</text>
							<text>{{ite.levelName}}</text>
						</view>
						<view class="info">
							<text class="cuIcon-time"></text>
							<text>{{ite.occurredTime}}</text>
						</view>
						<view>
							<view class="cu-tag bg-yellow light sm round custom-pos" v-if="ite.status == 1">待审核</view>
							<block v-else-if="ite.status == 2">
								<view class="cu-tag bg-red light sm round custom-pos" v-if="ite.levelId == 1">部门待处理</view>
								<view class="cu-tag bg-red light sm round custom-pos" v-else>待处理</view>
							</block>
							<view class="cu-tag bg-green light sm round custom-pos" v-else-if="ite.status == 3">已处理</view>
							<view class="cu-tag bg-grey light sm round custom-pos" v-else>已关闭</view>
						</view>
					</view>
				</view>
			</view>
		</you-scroll>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import YouScroll from '@/components/you-scroll/index';
	import HMfilterDropdown from "@/components/HM-filterDropdown/HM-filterDropdown.vue";
	import {
		getItem
	} from "@/utils/storage.js";

	export default {
		props: {
			warningOrders: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			HMfilterDropdown,
			YouScroll
		},
		created() {
			setTimeout(() => {
				this.filterDropdownValue = [
					[
						[0],
						[0]
					]
				];
				this.filterData = [{
						"type": 'filter',
						"submenu": [{
								"name": "处理状态",
								"submenu": [{
										"name": "全部",
										"value": "全部"
									},
									{
										"name": "待处理",
										"value": "待处理"
									},
									{
										"name": "已处理",
										"value": "已处理"
									}
								]
							},
							{
								"name": "预警等级",
								"submenu": [{
										"name": "全部",
										"value": "全部"
									},
									{
										"name": "一级",
										"value": "一级"
									},
									{
										"name": "二级",
										"value": "二级"
									},
									{
										"name": "三级",
										"value": "三级"
									},
									{
										"name": "四级",
										"value": "四级"
									}
								]
							}
						]
					}
				]
			}, 0);
		},
		data() {
			return {
				filterDropdownValue: [],
				filterData: [],

				searchParams: [],

				rStatusMap: {
					"全部": "",
					// "待审核": 1,
					"待处理": 2,
					"已处理": 3
				},
				levelMap: {
					"全部": "",
					"一级": 1,
					"二级": 2,
					"三级": 3,
					"四级": 4
				},
			}
		},
		methods: {
			async confirm(e) {
				let valueArr = e.value[0];
				let _r = [];
				if (valueArr[0].length > 0) {
					for (let item of valueArr[0]) {
						if (item === "全部") {
							_r = ["2", "3"]
							break;
						}
						_r.push(this.rStatusMap[item]);
					}
				} else {
					_r = ["2", "3"];
				}
				let _r1 = [];
				if (valueArr[1].length > 0) {
					for (let item of valueArr[1]) {
						if (item === "全部") {
							break;
						}
						_r1.push(this.levelMap[item]);
					}
				}

				this.searchParams = [{
						"fieldName": "status",
						"operate": "in",
						"value": _r.join(",")
					},
					{
						"fieldName": "levelId",
						"operate": "in",
						"value": _r1.join(",")
					},
					{
						"fieldName": "principalId",
						"operate": "eq",
						"value": getItem("principal_id")
					}
				];
				this.$emit("confirm", this.searchParams);
			},
			async onPullDown(done) {
				await this.$emit("getWarningList", 1);
				done();
			},

			showOrderDetail(id, tenantId) {
				this.$emit("showOrderDetail", { id, tenantId });
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
