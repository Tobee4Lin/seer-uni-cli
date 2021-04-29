<template>
	<view>
		<view class="wrap">
			<form>
				<view class="cu-form-group">
					<view class="title">预警类型</view>
					<input disabled="true" name="input" v-model="warningOrder.typeName"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">预警等级</view>
					<uni-rate style="position: absolute;right: 100rpx;top: 150rpx;" :disabled="true" :max="4" :value="(4 - warningOrder.levelId) + 1"></uni-rate>
					<view style="position: absolute;right: 30rpx;">
						{{warningOrder.levelName || ""}}
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">预警下发时间</view>
					<input disabled="true" name="input" v-model="warningOrder.occurredTime"></input>
				</view>
				<view class="cu-form-group" style="padding: 15rpx 30rpx;">
					<view class="title" style="min-width: 180rpx;">处理角色</view>
					<view>
						<view v-if="!warningOrder.eventTypeHandleRoleCodes || warningOrder.eventTypeHandleRoleCodes.length == 0" style="font-size: 30rpx;">
							暂无
						</view>
						<view v-else class="cu-tag radius" style="margin-bottom: 15rpx;" v-for="(ite, idx) in warningOrder.eventTypeHandleRoleCodes"
						 :key="idx">
							{{ite.platformName || "--"}} - {{ite.roleName || "--"}}
						</view>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">描述</view>
					<textarea v-model="warningOrder.description" :disabled="true" style="color: #333;"></textarea>
				</view>

				<!-- 图片 -->
				<view class="cu-list menu" v-if="warningOrder.extraDatagram.pictureFiles && warningOrder.extraDatagram.pictureFiles.length > 0">
					<view class="cu-item">
						<view class="content" style="min-width: 175rpx;">
							<text>预警照片：</text>
						</view>
						<view class="action">
							<view class="cu-avatar-group" style="padding: 0 10rpx 0 0;" v-for="(picItem, picIndex) in warningOrder.extraDatagram.pictureFiles" :key="picIndex">
								<text v-if="false">{{JSON.parse(JSON.stringify(picItem))}}</text>
								<u-image :src="picItem.downloadUrl" :lazy-load="true" width="120" height="120" :data-src="picItem.downloadUrl"
								 @click.native="imgShow"></u-image>
							</view>
						</view>
					</view>
				</view>
				<!-- 视频 -->
				<view class="bottom-view" v-if="warningOrder.extraDatagram.videoFiles && warningOrder.extraDatagram.videoFiles.length > 0">
					<p class="title">现场视频：</p>
					<view class="pic-box">
						<view v-if="!warningOrder.extraDatagram.videoFiles || warningOrder.extraDatagram.videoFiles.length === 0">
							暂无
						</view>
						<view v-else class="video" v-for="(videoItem, videoIndex) in warningOrder.extraDatagram.videoFiles" :key="videoIndex">
							<video :src="videoItem.downloadUrl" style="width: 100%;" v-if="videoItem.downloadUrl" controls></video>
							<view class="cu-load-1 loading" v-else></view>
						</view>
					</view>
				</view>

				<template>
					<!-- 待处理 -->
					<template v-if="warningOrder.status == '2'">
						<view v-if="warningOrder.levelId != '4'" class="cu-bar bg-white solid-bottom margin-top">
							<view class="action">
								<text class="cuIcon-title text-orange"></text> 预警反馈
							</view>
							<view class="action"></view>
						</view>

						<template v-if="warningOrder.levelId != '4'">
							<block>
								<p class="sub-title">反馈描述</p>
								<QSTextarea value="" textareaWidth=110 placeholder="输入反馈描述" v-model="handleDescription" :cursor_spacing="TEXTAREA_CURSOR_SPACING"></QSTextarea>
								<view class="pic-info">
									<p class="sub-title">现场照片</p>
									<QSInfinitePics ref="picRef" title="上传图片" max=5></QSInfinitePics>
								</view>
							</block>
						</template>

						<view class="padding flex flex-direction">

							<button v-if="warningOrder.status == 2 && warningOrder.levelId != 4" class="cu-btn bg-blue margin-tb-sm lg" @click="submitFeedback">提交反馈</button>
							<button v-if="warningOrder.status == 2 && warningOrder.levelId == 4" class="cu-btn bg-blue margin-tb-sm lg" @click="submitFeedback">了解</button>
						</view>
					</template>

					<!-- 审核中 -->
					<template v-else-if="warningOrder.status == '1'">
						<view class="cu-form-group">
							<view class="content">
								<view class="title">预警状态</view>
							</view>
							<view class="action">
								<view class="cu-tag round bg-yellow light">审核中</view>
							</view>
						</view>
					</template>

					<!-- 已关闭 -->
					<template v-else-if="warningOrder.status == '0'">
						<view class="cu-form-group">
							<view class="content">
								<view class="title">预警状态</view>
							</view>
							<view class="action">
								<view class="cu-tag round bg-grey light">已关闭</view>
							</view>
						</view>
						<view class="cu-form-group">
							<view class="title">关闭原因</view>
							<input disabled="true" placeholder="关闭原因" name="input" v-model="warningOrder.closedReason"></input>
						</view>
					</template>

					<!-- 已处理 -->
					<template v-else>
						<view class="cu-bar bg-white solid-bottom margin-top">
							<view class="action">
								<text class="cuIcon-title text-blue"></text> 反馈记录
							</view>
							<view class="action"></view>
						</view>

						<template>
							<view class="cu-form-group">
								<view class="content">
									<view class="title">预警状态</view>
								</view>
								<view class="action">
									<view class="cu-tag round bg-green light">已处理</view>
								</view>
							</view>
							<view class="cu-form-group">
								<view class="title">处理时间</view>
								<input disabled="true" name="input" v-model="warningOrder.handledTime"></input>
							</view>
							<view class="cu-form-group">
								<view class="title">处理描述</view>
								<textarea v-model="warningOrder.handleDescription" :disabled="true" style="color: #333;"></textarea>
							</view>
							<view class="bottom-view">
								<p class="title">现场照片：</p>
								<view class="pic-box">
									<view v-if="warningOrder.handleFileInfos.length === 0">
										暂无
									</view>
									<view v-else class="pic" v-for="(picItem, picIndex) in warningOrder.handleFileInfos" :key="picIndex">
										<text v-if="false">{{JSON.parse(JSON.stringify(picItem))}}</text>
										<u-image :src="picItem.downloadUrl" :lazy-load="true" width="120" height="120" :data-src="picItem.downloadUrl"
										 @click.native="imgShow"></u-image>
									</view>
								</view>
							</view>
						</template>
					</template>
				</template>
			</form>

			<view v-if="warningOrder.status == 2 && warningOrder.levelId != 4">
				<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
				 @trigger="trigger"></uni-fab>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import uniFab from "@/components/uni-fab/uni-fab.vue";
	import uniRate from '@/components/uni-rate/uni-rate.vue';
	import QSTextarea from "@/components/QS-inputs-split/elements/QS-textarea/index.vue";
	import QSInfinitePics from "@/components/QS-inputs-split/elements/QS-infinitePics/index.vue";
	import {
		TEXTAREA_CURSOR_SPACING
	} from "@/constants/index.js";
	import {
		downloadFile
	} from "@/utils/index.js";
	import imgShowMixin from "@/mixins/imgShow.js";

	export default {
		props: {
			sourceId: {
				type: String,
				default: ""
			},
			tenantId: {
				type: String,
				default: ""
			},
			warningOrder: {
				type: Object,
				default () {
					return [];
				}
			}
		},
		mixins: [imgShowMixin],
		data() {
			return {
				horizontal: "right",
				vertical: "bottom",
				direction: "horizontal",
				pattern: {
					color: "#7A7E83",
					backgroundColor: "#fff",
					selectedColor: "#007AFF",
					buttonColor: "#007AFF"
				},
				content: [
					{
						iconPath: "/static/add-check.png",
						selectedIconPath: "/static/add-check.png",
						text: "新增检查记录",
						active: false
					},
					{
						iconPath: "/static/add-check.png",
						selectedIconPath: "/static/add-check.png",
						text: "新增整改单",
						active: false
					}
				]
			};
		},
		components: {
			uniRate,
			uniFab,
			QSTextarea,
			QSInfinitePics
		},
		watch: {
			warningOrder: {
				async handler(nV, oV) {
					if (nV) {
						let _ext = nV.extraDatagram;
						if (_ext) {
							if (_ext.pictureFiles && _ext.pictureFiles.length > 0) {
								for await (let picItem of _ext.pictureFiles) {
									downloadFile(picItem, this, true);
								}
							}
							// if (_ext.videoFiles && _ext.videoFiles.length > 0) {
							// 	for (let videoItem of _ext.videoFiles) {
							// 		await downloadFile(picItem, this, true);
							// 	}
							// }
						}
						if (nV.handleFileInfos && nV.handleFileInfos.length > 0) {
							for (let picItem of nV.handleFileInfos) {
								await downloadFile(picItem, this, true);
							}
						}
					}
				}
			}
		},
		methods: {
			trigger(e) {
				if (e.index == 0) {
					this.$emit("dealInspect", {
						sourceId: this.sourceId,
						sourceType: 1,
						principalId: this.warningOrder.principalId,
						principalName: this.warningOrder.principalName,
						tenantId: this.tenantId,
						eventVersion: this.warningOrder.version,
						handleDescription: this.handleDescription
					});
					// this.$navigateTo("/pages/inspect/choose-template", {
					// 	sourceId: this.sourceId,
					// 	sourceType: 1,
					// 	principalId: this.warningOrder.principalId,
					// 	principalName: this.warningOrder.principalName,
					// 	handleDescription: this.handleDescription
					// });
				} else {
					this.$emit("dealRectify", {
						sourceId: this.sourceId,
						sourceType: 1,
						principalId: this.warningOrder.principalId,
						principalName: this.warningOrder.principalName,
						tenantId: this.tenantId,
						eventVersion: this.warningOrder.version,
						handleDescription: this.handleDescription
					});
				}
			},
			submitFeedback() {
				if(this.warningOrder.levelId == "4" && this.warningOrder.status == 2) {
					let data = {
						id: this.warningOrder.id,
						version: this.warningOrder.version,
						handleType: 4	//了解处理
					}
					
					API.addWarningFeedback(data).then(res => {
						if(res.data.code == 200) {
							this.$showToast("已处理");
							setTimeout(() => {
								uni.navigateBack();
							}, 1500)
						} else {
							this.$showToast(res.data.message);
						}
						return;
					})
					return;
				}
				if(!this.handleDescription) {
					this.$showToast("请先填写反馈描述");
					return;
				}
				let arr = [];
				this.$refs.picRef.getUpLoadPromiseArray().then(res => {
					res.map(item => {
						let info = JSON.parse(item.upLoadResult[1].data);
						arr.push(info.data[0].id);
					});
					
					let data = {
						id: this.warningOrder.id,
						handleFileIds: arr
					}
					
					API.addWarningFeedback(data).then(res => {
						if(res.data.code == 200) {
							uni.showToast({
								title: "反馈成功",
								success() {
									setTimeout(() => {
										uni.navigateBack()
									}, 1500);
								}
							})
						} else {
							this.$showToast(res.data.message);
						}
					})
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.cu-avatar-group {
		direction: ltr;
		padding: 0;
	}
	.wrap {
		.sub-title {
			display: block; // 让字体换行
			line-height: 40upx;
			padding: 0 30rpx;
			font-size: 30rpx;
		}
		.bottom-view {
			padding: 20rpx 25rpx;
			border-bottom: 1rpx solid #E5E5E5;
			.title {
				font-weight:400;
				color:rgba(0,0,0,1);
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
				
				.video {
					width: 100%;
				}
			}
		}
	}
</style>
