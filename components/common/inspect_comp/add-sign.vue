<template>
	<view>
		<w-picker mode="dateTime" :startYear="sYear" :endYear="cYear" :current="true" @confirm="globalLimitTimeChange"
		 @cancel="closeGlobalLimitTimePicker" ref="globalLimitTimePicker" themeColor="#0091FF"></w-picker>
		<view class="wrap">
			<view class="content">
				<view class="top">
					<p class="title">检查方：{{inspectOrder.inspectTenantName || ''}}</p>
					<p class="title">被检查方：{{inspectOrder.beInspectedPrincipalName || ''}}</p>
					<p class="status" style="color: #0091FF;" v-if="inspectOrder._result == '2'"><span>检查结果：</span>符合</p>
					<p class="status" style="color: #E02020;" v-else><span>检查结果：</span>不符合</p>
					<p>检查时间：{{inspectOrder.beginTime || ''}}</p>

					<view v-if="rectify" class="cu-form-group" style="margin-bottom: 25rpx;padding: 0 10rpx 0 0;" @click="showGlobalLimitTimePicker">
						<view style="font-size: 32rpx;">整改截止期限</view>
						<view class="picker">
							<text style="color: #555555;font-size: 32rpx;">{{globalLimitTime || ''}}</text>
							<text class="lg text-gray cuIcon-right"></text>
						</view>
					</view>

					<view class="margin-tb-sm flex">
						<button class="flex-sub cu-btn bg-blue md shadow" style="margin-right:15rpx;height: 80rpx" @click="addSign"
						 data-target="Modal"><text class="cuIcon-upload text-white"></text> 负责人电子签名</button>
						<button class="flex-sub cu-btn bg-blue md shadow" style="margin-right:15rpx;height: 80rpx" @click="addBeSign"
						 data-target="Modal"><text class="cuIcon-upload text-white"></text> 自查人员电子签名</button>
					</view>

					<view class="flex">
						<view class="flex-sub">
							<p>负责人签名：</p>
							<view class="customer-img-box" v-if="sign1">
								<image :src="sign1" mode="aspectFill" :data-src="sign1" @click="signImgShow" style="width: 100%;height: 100%;"></image>
							</view>
						</view>
						<view class="flex-sub">
							<p>自查人员签名：</p>
							<view class="customer-img-box" v-if="sign2">
								<image :src="sign2" mode="aspectFill" :data-src="sign2" @click="signImgShow"
								 style="width: 100%;height: 100%;"></image>
							</view>
						</view>
					</view>
				</view>

				<view class="" v-for="(ite, idx) in inspectOrder.subjects" :key="idx">
					<uni-collapse style="width: 100%;">
						<uni-collapse-item :title="ite.name" :hasUnqualified="ite.hasUnqualified" :hasToBeImproved="ite.hasToBeImproved"
						 :unqualifiedNum="ite.unqualifiedNum" show-animation="true" accordion="true" style="padding: 0 30rpx;">
							<view class="rectify-items" v-for="(item, index) in ite.items" :key="item.content">
								<view class="pending-view">
									<view class="cu-list menu">
										<view class="cu-item" style="border-bottom: 1rpx solid #E5E5E5;">
											<view class="content">
												<text class="text-black" style="font-weight: 600;">{{(idx+1)+'-'+(item.number === 0 ? index+1 : item.number)}}、{{item.content}}</text>
											</view>
											<view class="action">
												<view class="cu-tag bg-red light" v-if="item.result == 1">不合格</view>
												<view class="cu-tag bg-yellow light" v-else-if="item.result == 3">有待完善</view>
												<view class="cu-tag bg-green light" v-else>合格</view>
											</view>
										</view>
									</view>
									<view class="bottom-view" v-if="item.result == 1">
										<p class="title">情况描述：</p>
										<view class="desc" v-if="item.description">
											{{item.description}}
										</view>
										<view class="desc" v-else>暂无</view>
										<p class="title">现场照片：</p>
										<view class="pic-box">
											<view v-if="item.fileInfos.length === 0">
												暂无
											</view>
											<view class="pic" v-for="(picItem, picIndex) in item.fileInfos" :key="picIndex">
												<image :src="picItem.downloadUrl" mode="aspectFill" v-if="picItem.downloadUrl" :data-src="picItem.downloadUrl"
												 @click="imgShow"></image>
												<view class="cu-load-1 loading"></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</view>

		<view class="margin-tb-sm lg text-center fix-btn">
			<button class="cu-btn round bg-blue lg shadow" @click="requestAddInspectOrder">提交检查单</button>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
	import wPicker from '@/components/w-picker/w-picker.vue';
	import {
		SERVER_URL,
		SERVER_PORT
	} from "@/config/index.js";
	import {
		downloadFile
	} from "@/utils/index.js";
	import Handwriting from "@/libs/signature.js";
	import {
		generateCurrentDate,
		format,
		formatDate
	} from "@/utils/date.js";

	export default {
		props: {
			rectify: {
				type: Boolean,
				default: false
			},
			inspectOrder: {
				type: Object,
				default () {
					return {};
				}
			},
			sign1: {
				type: String,
				default: ""
			},
			sign2: {
				type: String,
				default: ""
			}
		},
		watch: {
			inspectOrder: {
				async handler(nV, oV) {
					console.log(nV, oV)
					if (nV) {}
				},
				deep: true
			}
		},
		data() {
			return {
				picArr: [],
				inspector_sign_id: "",
				be_inspector_sign_id: "",
				sign: "",
				globalLimitTime: "",
				cYear: "",
				sYear: ""
			};
		},
		components: {
			wPicker,
			uniCollapse,
			uniCollapseItem
		},
		created() {
			this.generateCurrentDate();
			// this.sign1 = uni.getStorageSync("sign1") || "";
			// this.sign2 = uni.getStorageSync("sign2") || "";
		},
		// destroyed() {
		// 	uni.getStorageSync("sign1") && uni.removeStorageSync("sign1");
		// 	uni.getStorageSync("sign2") && uni.removeStorageSync("sign2");
		// },
		methods: {
			getRectifyLimitDay() {
				API.getDict("RECTIFY_LIMIT_DAY").then(res => {
					this.globalLimitTime = this.getFinalDay(this.globalLimitTime, res.data.data.items[0].name);
				})
			},
			getFinalDay(d, t) {
				d = new Date(d);
				d = +d + (1000 * 60 * 60 * 24) * t;
				d = new Date(d);
				return format(new Date(d), "yyyy-MM-dd hh:mm:ss")
			},
			generateCurrentDate() {
				let {
					date,
					month,
					day,
					hour,
					minutes
				} = generateCurrentDate();
				this.cYear = date.getFullYear() + 1;
				this.sYear = date.getFullYear() - 1;
				this.globalLimitTime = `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:00`;
			},
			globalLimitTimeChange(e) {
				if (formatDate(e.result + ":00") < Date.now()) {
					this.$showToast("整改期限不能小于或等于当前日期");
					this.closeGlobalLimitTimePicker();
					return;
				}
				this.globalLimitTime = e.result + ":00";
			},
			closeGlobalLimitTimePicker() {
				this.$refs.globalLimitTimePicker.hide();
			},
			showGlobalLimitTimePicker() {
				this.$refs.globalLimitTimePicker.show();
			},

			requestAddInspectOrder() {
				if (!this.sign1 || !this.sign2) {
					uni.showModal({
						title: '提示',
						content: '检查双方签名暂未填写完整，是否直接提交？',
						success: res => {
							if (res.confirm) {
								this.uploadInspectOrder();
							} else if (res.cancel) {
								return;
							}
						}
					});
				} else {
					this.uploadInspectOrder();
				}
			},
			async uploadInspectOrder() {
				uni.showLoading({
					title: "提交检查单中...",
					mask: true
				});

				if (this.sign1) await this.uploadSign();
				if (this.sign2) await this.uploadBeSign();

				this.inspectOrder.inspectSignId = this.inspector_sign_id;
				this.inspectOrder.beInspectSignId = this.be_inspector_sign_id;
				this.inspectOrder.limitTime = this.globalLimitTime;
				this.inspectOrder.rectify = this.rectify;

				API.addInspectOrders(this.inspectOrder).then(async res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						this.$showToast("提交成功", "success");
						uni.getStorageSync("sign1") && uni.removeStorageSync("sign1");
						uni.getStorageSync("sign2") && uni.removeStorageSync("sign2");

						setTimeout(() => {
							uni.navigateBack({
								delta: 4
							});
						}, 1500)
					} else {
						this.$showToast(res.data.message);
					}
				});
			},
			addSign(e) {
				this.$emit("routeToSign", "1");
			},
			addBeSign(e) {
				this.$emit("routeToSign", "2");
			},
			async uploadSign() {
				let header = {
					Authorization: uni.getStorageSync("token"),
					"platform-code": uni.getStorageSync("platformCode")
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${SERVER_URL}:${SERVER_PORT}/isp-cloud-base/files/multiple`,
						filePath: this.sign1,
						name: 'files',
						header,
						success: uploadFileRes => {
							this.inspector_sign_id = JSON.parse(uploadFileRes.data.substring(0, uploadFileRes.data.length)).data[0].id;
							resolve();
						}
					});
				})
			},
			async uploadBeSign() {
				let header = {
					Authorization: uni.getStorageSync("token"),
					"platform-code": uni.getStorageSync("platformCode")
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${SERVER_URL}:${SERVER_PORT}/isp-cloud-base/files/multiple`,
						filePath: this.sign2,
						name: 'files',
						header,
						success: uploadFileRes => {
							this.be_inspector_sign_id = JSON.parse(uploadFileRes.data.substring(0, uploadFileRes.data.length)).data[0].id;
							resolve();
						}
					});
				})
			},

			imgShow(e) {
				let src = e.currentTarget.dataset.src;
				uni.previewImage({
					current: src,
					urls: this.picArr
				});
			},
			signImgShow(e) {
				let src = e.currentTarget.dataset.src;
				uni.previewImage({
					current: src,
					urls: [src]
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.cu-bar .content {
		width: calc(100% - 140rpx);
	}

	.cu-list.menu>.cu-item .content {
		font-size: 28rpx;
	}

	.fix-btn {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
	}

	.wrap {
		position: relative;

		.content {
			.customer-img-box {
				width: 100rpx;
				height: 100rpx;
				display: inline-block;
				margin-left: 15rpx;
				// border: 1rpx solid #999;
				margin-top: 15rpx;
			}

			button {
				border-radius: 0;
			}

			button::after {
				border-radius: 0;
			}

			.top {
				// margin-top: 15rpx;
				border-bottom: 25rpx solid #F7F7FA;
				padding: 25rpx;
				background-color: #FFFFFF;

				p {
					color: #999999;
					font-size: 30rpx;
					font-weight: 400;
					margin-bottom: 10rpx;
				}

				.title {
					font-size: 38rpx;
					font-weight: 600;
					color: #222222;
					margin-bottom: 20rpx;
				}

				.status {
					font-weight: 400;
					color: #0091FF;

					span {
						color: #999999;
					}
				}
			}

			.rectify-items {

				// border-bottom: 25rpx solid #F7F7FA;
				.sub-title {
					font-weight: 500;
					color: rgba(0, 145, 255, 1);
					text-align: left;
					font-size: 30rpx;
				}

				.sub-title-1 {
					padding-left: 20rpx;
				}

				.pending-view {
					// padding-top: 20rpx;
					background-color: #FFFFFF;
					border-radius: 5rpx;
					margin-bottom: 15rpx;

					.top-view {
						padding: 25rpx;
						border-bottom: 1px solid #E5E5E5;

						p {
							display: inline-block;
							vertical-align: top;
							font-size: 36rpx;
							font-weight: 600;
							color: rgba(0, 145, 255, 1);
						}
					}

					.content {
						padding: 25rpx 20rpx 25rpx 0;
					}

					.bottom-view {
						padding: 20rpx 25rpx;
						border-bottom: 1rpx solid #E5E5E5;

						.title {
							font-weight: 400;
							color: rgba(0, 0, 0, 1);
							font-size: 30rpx;
							margin-bottom: 10rpx;
						}

						.desc {
							font-size: 26rpx;
							color: #999999;
							line-height: 38rpx;
							padding: 20rpx 15rpx;
							background-color: #FFFFFF;
							word-wrap: break-word;
						}
					}


				}

				.rectified-view {
					padding-top: 20rpx;
					background-color: #FFFFFF;
					border-radius: 5rpx;
					margin-bottom: 15rpx;

					.content {
						padding: 25rpx 20rpx 25rpx 0;
					}

					.bottom-view {
						padding: 0 25rpx;
					}

					.not-rectify {}

					.title {
						font-weight: 400;
						color: rgba(0, 0, 0, 1);
						font-size: 30rpx;
						margin-bottom: 10rpx;
					}

					.desc {
						font-size: 26rpx;
						color: #999999;
						line-height: 38rpx;
						padding: 20rpx 15rpx;
						background-color: #FFFFFF;
						word-wrap: break-word;
					}
				}

				.pic-box {
					margin-bottom: 20rpx;

					.pic {
						width: 130rpx;
						height: 130rpx;
						border: 1px solid #F7F7FA;
						border-radius: 10rpx;
						overflow: hidden;
						display: inline-block;
						vertical-align: top;
						margin-right: 20rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
