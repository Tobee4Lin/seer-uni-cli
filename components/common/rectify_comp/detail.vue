<template>
	<view style="height: 100vh;background-color: #F7F7FA;">
		<view class="wrap">
			<view class="content">
				<view class="top">
					<p class="title">{{rectifyOrder.rectifyPrincipalName || ''}}</p>
					<p class="status" style="color: #E02020;" v-if="rectifyOrder.status == '0'"><span>整改状态：</span>未整改</p>
					<p class="status" style="color: #fbbd08;" v-else-if="rectifyOrder.status == '2'"><span>整改状态：</span>已超时</p>
					<p class="status" v-else><span>整改状态：</span>已整改</p>
					<p>整改单下发时间：{{rectifyOrder.beginTime || ''}}</p>
					<p>整改单整改期限：{{rectifyOrder.limitTime || ''}}</p>
				</view>

				<view class="rectify-items" v-for="(item, index) in rectifyOrder.items" :key="index">
					<view class="pending-view">
						<!-- 整改前 -->
						<view class="cu-list menu">
							<view class="cu-item" style="border-bottom: 1rpx solid #E5E5E5;">
								<view class="content">
									<text class="text-black" style="font-weight: 600;">{{index+1}}、{{item.content}}</text>
								</view>
								<view class="action" v-if="rectifyOrder.status == '0' || rectifyOrder.status == '2'">
									<view class="cu-tag bg-red light">未整改项</view>
								</view>
								<view class="action" v-else>
									<view class="cu-tag bg-blue light">已整改项</view>
								</view>
							</view>
						</view>
						<view class="bottom-view">
							<p class="title">情况描述：</p>
							<view class="desc">
								{{item.oriItemDescription || '无'}}
							</view>

							<p class="title">现场照片：</p>
							<view class="pic-box">
								<view class="pic" v-for="(picItem, picIndex) in item.oriFileInfos" :key="picIndex">
									 <u-image :src="picItem.downloadUrl" :lazy-load="true" width="130" height="130" :data-src="picItem.downloadUrl"
									  @click.native="imgShow"></u-image>
								</view>
							</view>
						</view>
					</view>

					<view class="rectified-view">
						<p class="sub-title sub-title-1">整改后</p>
						<!-- 整改后 -->
						<view class="bottom-view" v-if="rectifyOrder.status == '1'">
							<p class="title">整改情况描述：</p>
							<view class="desc">
								{{item.description}}
							</view>
							<p class="title">整改照片：</p>
							<view class="pic-box">
								<view class="pic" v-for="(picItem, picIndex) in item.fileInfos" :key="picIndex">
									
									<u-image :src="picItem.downloadUrl" :lazy-load="true" width="130" height="130" :data-src="picItem.downloadUrl"
									 @click.native="imgShow"></u-image>
									<!-- <image :src="picItem.downloadUrl" mode="aspectFill" v-if="picItem.downloadUrl" :data-src="picItem.downloadUrl"
									 @click="imgShow"></image> -->
								</view>
							</view>

						</view>
						
						<view class="not-rectify bottom-view" v-else>
							<QSTextarea value="" textareaWidth=110 placeholder="请输入整改描述" v-model="item.description"></QSTextarea>
							<view class="pic-info">
								<p class="title">现场照片：</p>
								<!-- 需要去插件目录下config目录中pics.js中配置上传图片url -->
								<QSInfinitePics :ref="'picRef_'+index" title="上传图片" max=5></QSInfinitePics>
							</view>
						</view>
					</view>
				</view>
				<button type="primary" style="background-color: #0091FF;" @click="submitRectify" v-if="rectifyOrder.status == '0' || rectifyOrder.status == '2'">提交整改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import {
		downloadFile
	} from "@/utils/index.js";
	import QSTextarea from "@/components/QS-inputs-split/elements/QS-textarea/index.vue";
	import QSInfinitePics from "@/components/QS-inputs-split/elements/QS-infinitePics/index.vue";
	import QSApp from "@/components/QS-inputs-split/js/app.js";
	export default {
		props: {
			rectifyOrder: {
				type: Object,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				picArr: []
			};
		},
		components: {
			QSInfinitePics,
			QSTextarea
		},
		methods: {
			imgShow(e) {
				let src = e.currentTarget.dataset.src;
				this.$emit("imgShow", src);
			},
			submitRectify() {
				let rectifyInfo = {
					rectifyOrderId: this.rectifyOrder.id,
					items: []
				};
				uni.showLoading({
					title: "上传整改单中...",
					mask: true
				});
				let promiseArr = [];
				let dealArr = this.rectifyOrder.items;
				for (let key in this.$refs) {
					promiseArr.push(this.$refs[key][0].getUpLoadPromiseArray());
				}
				Promise.all(promiseArr).then(res => {
					let dealInfo = [];
					res.map((item_1, index_1) => {
						let arr = [];
						let arr1 = [];
						let obj = {};

						obj.itemId = dealArr[index_1].id;
						obj.description = dealArr[index_1].description;
						item_1.map(item_2 => {
							let info = JSON.parse(item_2.upLoadResult[1].data);
							arr.push(info.data[0]);
							arr1.push(info.data[0].id);
						});
						dealInfo.push(arr);
						obj.fileIds = arr1;
						rectifyInfo.items.push(obj);
					});

					this.requestAddRectifyOrder(rectifyInfo);
				});
			},
			requestAddRectifyOrder(rectifyInfo) {
				API.addRectifyOrders(rectifyInfo).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						this.$showToast("上传成功", "success");
						setTimeout(() => {
							this.$emit("rectifySuccess");
						}, 500);
					} else {
						this.$showToast(res.data.message);
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.cu-form-group {
		padding: 0 !important;
	}

	.wrap {
		position: relative;

		.content {
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
					// margin-bottom: 20rpx;
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
				border-bottom: 25rpx solid #F7F7FA;

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
						padding: 25rpx;
					}

					.not-rectify {}

					.title {
						font-weight: 400;
						color: rgba(0, 0, 0, 1);
						font-size: 30rpx;
						// margin-bottom: 10rpx;
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
