<template>
	<view>
		<view class="cu-modal" :class="modalName=='txtModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">详情</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view style="padding: 40rpx 20rpx;">
					{{txtContent}}
				</view>
			</view>
		</view>
		<view class="wrap">
			<view class="title">
				{{notice.title || ""}}
			</view>
			<view class="time-info">
				{{notice.createDate || ""}} 发布人：{{notice.createBy || ""}}
			</view>
			<view class="content">
				<jyf-parser :html="notice.content" ref="article"></jyf-parser>
				<view class="cu-list menu-avatar">
					<!-- 图片 -->
					<view class="cu-item file-item radius bg-white" v-if="picItem.contentType.indexOf('image') > -1" v-for="(picItem, picIndex) in notice.fileInfos"
					 :key="picIndex" @click="showFileContent(index)">
						<view class="cu-avatar radius lg" :style="{'background-image': 'url(' + picItem.downloadUrl + ')'}" :data-src="picItem.downloadUrl"
						 @click="imgShow"></view>
						<view class="content">
							<view>
								<view class="text-cut">{{picItem.fileOriName}}</view>
							</view>
						</view>
					</view>
					<!-- 文档 -->
					<view class="cu-item file-item radius bg-white" v-for="(item, index) in fileInfoArr" :key="index" @click="showFileContent(index, item.suffix, $event)"
					 data-target="txtModal">
						<view class="cu-avatar radius lg">
							<image :src="picAndSuffixObj[item.suffix]" mode="aspectFill" style="width: 100%;height: 100%;"></image>
						</view>
						<view class="content">
							<view>
								<view class="text-cut">{{item.fileOriName}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		SERVER_URL,
		SERVER_PORT
	} from "@/config/index.js";
	import {
		downloadFile
	} from "@/utils/index.js";
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import imgShowMixin from "@/mixins/imgShow.js";

	export default {
		props: {
			notice: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		mixins: [imgShowMixin],
		data() {
			return {
				filePathArr: [],
				fileInfoArr: [],
				modalName: null,
				txtContent: "",
				picAndSuffixObj: {
					"doc": "/static/notice/WORD.png",
					"docx": "/static/notice/WORD.png",
					"xls": "/static/notice/Excel.png",
					"xlsx": "/static/notice/Excel.png",
					"pdf": "/static/notice/pdf.png",
					"txt": "/static/login/logo.png",
				}
			};
		},
		components: {
			jyfParser
		},
		watch: {
			notice: {
				async handler(nV, oV) {
					if (nV) {
						let header = {
							Authorization: uni.getStorageSync("token"),
							"platform-code": uni.getStorageSync("platformCode")
						}
						if (nV.fileInfos.length > 0) {
							for (let item of nV.fileInfos) {
								if (item.contentType.indexOf("image") !== -1) {
									await downloadFile(item, this, true);
								} else if (item.contentType === "text/plain") {
									this.fileInfoArr.push({
										suffix: item.fileName.split(".")[1],
										fileOriName: item.fileOriName
									});
									await this.getTxtFile(item.id, header);
								} else {
									this.fileInfoArr.push({
										suffix: item.fileName.split(".")[1],
										fileOriName: item.fileOriName
									});
									await this.getFileInfos(item.id, header);
								}
							}
						}
					}
				}
			}
		},
		methods: {
			async getFileInfos(id, header) {
				let _this = this;
				uni.showLoading();
				return new Promise((resolve, reject) => {
					let url = `${SERVER_URL}:${SERVER_PORT}/isp-cloud-base/files/download/${id}`;
					uni.downloadFile({
						url,
						header,
						success: (res) => {
							let filePath = res.tempFilePath;
							_this.filePathArr.push(filePath);
							uni.hideLoading();
							resolve();
						},
						fail: () => {
							this.$showToast("文档加载失败");
							uni.hideLoading();
						}
					});
				})
			},
			async getTxtFile(id, header) {
				let _this = this;
				uni.showLoading();
				return new Promise((resolve, reject) => {
					let url = `${SERVER_URL}:${SERVER_PORT}/isp-cloud-base/files/download/${id}`;
					let fs = uni.getFileSystemManager();
					uni.downloadFile({
						url,
						header,
						success: (res) => {
							let filePath = res.tempFilePath;
							_this.filePathArr.push(filePath);
							fs.readFile({
								filePath,
								encoding: 'utf8',
								complete(res) {
									_this.txtContent = res.data;
								}
							});
							uni.hideLoading();
							resolve();
						},
						fail: () => {
							this.$showToast("文档加载失败");
							uni.hideLoading();
						}
					});
				})
			},
			hideModal() {
				this.modalName = null;
			},
			showFileContent(index, suffix, e) {
				let _this = this;
				if (suffix === "txt") {
					this.modalName = e.currentTarget.dataset.target;
				} else {
					uni.openDocument({
						filePath: this.filePathArr[index],
						fileType: this.fileInfoArr[index].suffix,
						success: (res) => {},
						fail: (err) => {
							this.$showToast("暂不支持此文件类型");
						}
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.cu-list.menu-avatar>.cu-item .content {
		width: calc(100% - 96rpx - 60rpx) !important;
	}

	.cu-avatar {
		background-color: #FFF !important;
	}

	.wrap {
		padding: 30rpx;

		.title {
			font-size: 46rpx;
			font-weight: 600;
			color: rgba(0, 0, 0, 1);
			line-height: 66rpx;
		}

		.time-info {
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(136, 136, 136, 1);
			line-height: 42rpx;
			margin: 25rpx 0;
		}

		.content {
			.dl {
				font-size: 30rpx;
				font-weight: 400;
				color: rgba(17, 17, 17, 1);
				line-height: 50rpx;
				text-indent: 70rpx;
				overflow: hidden;
			}

			.file-wrap {
				width: 100%;
				padding: 20rpx 0;

				.file-item {
					width: 100%;
					border: 1rpx solid #999;
					color: #666;
				}
			}
		}
	}
</style>
