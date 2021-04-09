<template>
	<view style="height: 100vh;background-color: #F7F7FA;">
		<view class="wrap">
			<view class="content">
				<view class="top">
					<p class="title">检查方：{{inspectOrder.inspectTenantName || ""}}</p>
					<p class="title">被检查方：{{inspectOrder.beInspectedPrincipalName || ""}}</p>
					<p class="status" style="color: #0091FF;" v-if="inspectOrder.result == '2'"><span>检查结果：</span>符合</p>
					<p class="status" style="color: #E02020;" v-else><span>检查结果：</span>不符合</p>
					<p>完成时间：{{inspectOrder.beginTime || ""}}</p>
					<view class="flex" v-if="inspectOrder.subjects.length > 0">
						<view class="flex-sub">
							<p>负责人签名：</p>
							<u-image :src="inspectOrder.inspectSign.downloadUrl" :lazy-load="true"
							 width="130" height="130" :data-src="inspectOrder.inspectSign.downloadUrl" @click.native="signImgShow"></u-image>
						</view>
						<view class="flex-sub">
							<p>自查人员签名：</p>
							<u-image :src="inspectOrder.beInspectSign.downloadUrl" :lazy-load="true"
							 width="130" height="130" :data-src="inspectOrder.beInspectSign.downloadUrl" @click.native="signImgShow"></u-image>
						</view>
					</view>
				</view>

				<block v-if="inspectOrder.subjects.length > 0">
					<view class="" v-for="(ite, idx) in inspectOrder.subjects" :key="idx">
						<uni-collapse style="width: 100%;">
							<uni-collapse-item :title="ite.name" :hasUnqualified="ite.hasUnqualified" :hasToBeImproved="ite.hasToBeImproved"
							 :unqualifiedNum="ite.unqualifiedNum" show-animation="true" accordion="true" style="padding: 0 30rpx;">
								<view class="rectify-items" v-for="(item, index) in ite.items" :key="item.content">
									<view class="pending-view">
										<view class="cu-list menu">
											<view class="cu-item" style="border-bottom: 1rpx solid #E5E5E5;">
												<view class="content">
													<text class="text-black" style="font-weight: 600;">{{(idx+1)+'-'+(index+1)}}、{{item.content}}</text>
												</view>
												<view class="action">
													<view class="cu-tag bg-red light" v-if="item.result == 1">不合格</view>
													<view class="cu-tag bg-yellow light" v-else-if="item.result == 3">有待完善</view>
													<view class="cu-tag bg-green light" v-else>合格</view>
												</view>
											</view>
										</view>
										<view class="bottom-view" v-if="item.result == 1">
											<view class="cu-form-group" style="padding: 0;">
												<view class="title text-grey text-sm" style="margin-bottom: 0;">整改类型：</view>
												<input disabled="true" style="font-weight: 600;" :value="item.rectifyTypeName"></input>
											</view>
											<p class="title">情况描述：</p>
											<view class="desc">
												{{item.description}}
											</view>
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
				</block>
				<block v-else>
					<p style="padding-left: 25rpx;font-size: 26rpx;color: #333;">检查描述：{{inspectOrder.description || ""}}</p>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCollapse from "@/components/uni-collapse/uni-collapse.vue";
	import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue";
	import {
		downloadFile
	} from "@/utils/index.js";

	export default {
		props: {
			inspectOrder: {
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
			uniCollapse,
			uniCollapseItem
		},
		methods: {
			imgShow(e) {
				let src = e.currentTarget.dataset.src;
				this.$emit("imgShow", src);
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
	.cu-list.menu>.cu-item .content {
		font-size: 28rpx;
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
