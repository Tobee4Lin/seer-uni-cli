<template>
	<view>
		<w-picker mode="linkage" :level="2" @confirm="onConfirm" ref="linkage" :linkList="linkList" themeColor="#0091FF"></w-picker>
		<view class="wrap">
			<view class="top-wrap">
				<view>
					<view class="cu-list grid border col-2">
						<!-- 检查 -->
						<view class="cu-item border" style="padding: 60rpx;" @click="routeTo('./inspect-list')">
							<view style="width: 96rpx;height: 96rpx;">
								<image style="width: 100%;height: 100%;" src="/static/pic-1.png" mode="aspectFill"></image>
							</view>
							<view class="content" style="position: absolute;left: 80rpx;width: calc(100% - 96rpx);line-height: 1.5em;margin-top: -30rpx;">
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">符合</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{qualifiedInspectOrderNum}}</text>
								</view>
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">基本符合</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{mainlyQualifiedInspectOrderNum}}</text>
								</view>
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">不符合</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{unqualifiedInspectOrderNum}}</text>
								</view>
							</view>
						</view>
						<!-- 整改 -->
						<view class="cu-item border" style="padding: 60rpx;" @click="routeTo('./rectify-list')">
							<view style="width: 96rpx;height: 96rpx;">
								<image style="width: 100%;height: 100%;" src="/static/pic-2.png" mode="aspectFill"></image>
							</view>
							<view class="content" style="position: absolute;left: 80rpx;width: calc(100% - 96rpx);line-height: 1.5em;margin-top: -30rpx;">
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">待整改</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{todoRectifyOrderNum}}</text>
								</view>
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">已整改</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{finishRectifyOrderNum}}</text>
								</view>
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">已超时</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{timeoutRectifyOrderNum}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="cu-list grid border col-2" style="margin-top: 0;">
						<!-- 预警 -->
						<view class="cu-item border" style="padding: 60rpx;" @click="routeTo('./warning-list')">
							<view style="width: 96rpx;height: 96rpx;">
								<image style="width: 100%;height: 100%;" src="/static/pic-3.png" mode="aspectFill"></image>
							</view>
							<view class="content" style="position: absolute;left: 80rpx;width: calc(100% - 96rpx);line-height: 1.5em;margin-top: -6rpx;">
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">待处理</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{uncheckWarningNum}}</text>
								</view>
								<view style="width: 200rpx;margin-left: 45rpx;">
									<text style="width: 60%">已处理</text><text style="color: #0091FF;font-size: 36rpx;width:20%">{{checkWarningNum}}</text>
								</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>

			<view class="bottom-wrap">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="title-2">主体基本信息</text>
					</view>
				</view>
				<view class="content-wrap">
					<p class="info"><span>主体名称：</span>XX食品有限公司</p>
					<p class="info"><span>主体地址：</span>东莞市东城区</p>
				</view>
			</view>
			
			<view>
				<uni-fab
					:pattern="pattern"
					:content="content"
					:horizontal="horizontal"
					:vertical="vertical"
					:direction="direction"
					@trigger="trigger"
				></uni-fab>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import uniFab from "@/components/uni-fab/uni-fab.vue";
	import uniRate from "@/components/uni-rate/uni-rate.vue";
	import wPicker from "@/components/w-picker/w-picker.vue";
	import YouScroll from "@/components/you-scroll/index";
	
	export default {
		data() {
			return {
				templateId: "",
				horizontal: "right",
				vertical: "bottom",
				direction: "horizontal",
				pattern: {
					color: "#7A7E83",
					backgroundColor: "#fff",
					selectedColor: "#007AFF",
					buttonColor: "#007AFF"
				},
				content: [{
					iconPath: "/static/add-check.png",
					selectedIconPath: "/static/add-check.png",
					text: "新增检查",
					active: false
				}],

				qualifiedInspectOrderNum: 0,
				mainlyQualifiedInspectOrderNum: 0,
				unqualifiedInspectOrderNum: 0,

				finishRectifyOrderNum: 0,
				todoRectifyOrderNum: 0,
				timeoutRectifyOrderNum: 0,
				checkWarningNum: 0,
				uncheckWarningNum: 0,

				linkList: []
			}
		},
		onLoad(opt) {
			this.getInspectOrderCountInfo();
			this.getRectifyOrderCountInfo();
			this.getWarningCountInfo();
		},
		components: {
			wPicker,
			uniFab,
			YouScroll,
			uniRate
		},
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			onConfirm(e) {
				let inspectOrderInfo = {
					typeId: e.checkValue[0],
					templateId: e.checkValue[1],
					inspectTenantId: "1229619270476890115",
					inspectTenantName: "ys_fj_admin",
					beInspectedPrincipalId: "1269918827483762690",
					beInspectedPrincipalName: "演示供应商",
					sourceType: 0,
					sourceId: ""
				};

				this.$store.commit("saveInspectOrder", inspectOrderInfo);
				
				this.$navigateTo("../inspect/add");
			},
			getInspectOrderCountInfo() {
				API.getInspectOrderCountInfo("1269918827483762690").then(res => {
					if (res.data.code == 200) {
						this.qualifiedInspectOrderNum = res.data.data.qualified;
						this.mainlyQualifiedInspectOrderNum = res.data.data.mainlyQualified;
						this.unqualifiedInspectOrderNum = res.data.data.unqualified;
					}
				})
			},
			getRectifyOrderCountInfo() {
				API.getRectifyOrderCountInfo("1269918827483762690").then(res => {
					if (res.data.code == 200) {
						this.finishRectifyOrderNum = res.data.data.finish;
						this.todoRectifyOrderNum = res.data.data.todo;
						this.timeoutRectifyOrderNum = res.data.data.timeOut;
					}
				})
			},
			getWarningCountInfo() {
				API.getWarningCountInfo("1269918827483762690").then(res => {
					if (res.data.code == 200) {
						this.checkWarningNum = res.data.data.handled;
						this.uncheckWarningNum = res.data.data.pending;
					}
				})
			},
			
			trigger() {
				this.getAllCheckTypes();
			},
			getAllCheckTypes() {
				this.linkList = [];
				API.getAllCheckType().then(res => {
					//只取“日常检查”。后面有需要再改
					res.data.data.map(item => {
						if (item.name.indexOf("日常") > -1) {
							this.linkList.push({
								label: item.name,
								value: item.id,
								children: []
							})
						}
					})
					this.getAllCheckTemplates();
				})
			},
			getAllCheckTemplates() {
				API.getInspectOrderTemplatesByTypeName({
					size: -1
				}).then(res => {
					res.data.data.list.map(item => {
						if (item.suitPrincipalTypes.includes("ST03") || item.suitPrincipalTypes.length === 0) {
							this.linkList[0].children.push({
								label: item.name,
								value: item.id
							})
						}
					});

					if (this.linkList.length === 0 || this.linkList[0].children.length === 0) {
						uni.showToast({
							title: "暂无相关检查模板",
							icon: "none"
						})
					} else {
						this.$refs.linkage.show();
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.cu-list.grid>.cu-item:after {
		// border-bottom: 0 !important;
	}

	.cu-list.grid>.cu-item text {
		display: inline-block !important;
	}

	.wrap {
		.top-wrap {
			border-bottom: 25rpx solid #F7F7FA;

			.num {
				font-size: 36rpx;
				font-weight: 600;
				color: rgba(0, 0, 0, 1);
				line-height: 50rpx;
			}

			.title-wrap {
				padding: 30rpx 45rpx;
				border-bottom: 1rpx solid #F7F7FA;

				.title {
					font-size: 34rpx;
					font-weight: 600;
					color: rgba(34, 34, 34, 1);
					margin-bottom: 15rpx;
				}

				.info {
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					line-height: 42rpx;
				}
			}

			.img-box {
				flex: 1;
			}

			.text-box {
				flex: 3;
			}
		}

		.bottom-wrap {
			.title-2 {
				font-size: 30rpx;
				font-weight: 600;
				color: rgba(34, 34, 34, 1);
			}

			.content-wrap {
				padding: 25rpx 30rpx;
				margin-bottom: 120rpx;
				.info {
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					line-height: 42rpx;
				}
			}
		}

		.cu-list {
			.pic-wrap {
				width: 96rpx;
				height: 96rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
					object-fit: fill;
				}
			}
		}
	}
</style>
