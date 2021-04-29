<template>
	<view>
		<w-picker mode="dateTime" :startYear="sYear" :endYear="cYear" :current="true" @confirm="limitTimeChange" @cancel="closeLimitTimePicker"
		 ref="limitTimePicker" themeColor="#0091FF"></w-picker>

		<view class="wrap">
			<view class="content">
				<view class="cu-form-group">
					<view class="title">整改期限</view>
					<input placeholder="整改期限" disabled="disabled" name="input" v-model="limitTime"></input>
					<button class='cu-btn bg-blue radio shadow' @click="showLimitTimePicker">选择</button>
				</view>
				<view class="margin-tb-sm" style="padding-left: 25rpx;">
					<button class="cu-btn bg-blue md shadow" @click="addItems">新增整改项</button>
				</view>

				<view class="cu-bar bg-white solid-bottom margin-top" v-if="rectifyItem.length > 0">
					<view class="action">
						<text class="cuIcon-title radius text-blue"></text> 新增整改项
					</view>
					<view class="action"></view>
				</view>
				<view class="rectify-item-box" v-for="(item, index) in rectifyItem" :key="index">
					<uni-collapse style="width: 100%;">
						<uni-collapse-item title="自定义整改项" show-animation="true" open="true" accordion="true" style="padding: 0 30rpx;">
							<view class="top">
								<p>需整改的项点</p>
								<p style="text-align: right;">
									<text class="lg text-gray cuIcon-close" @click="deleteRectifyItem(index)"></text>
								</p>
							</view>
							<view class="cu-form-group">
								<view class="title">整改内容</view>
								<input placeholder="整改内容" name="input" v-model="item.content"></input>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
				<view class="cu-form-group">
					<view class="title">整改原因</view>
					<textarea :show-confirm-bar="false" :cursor-spacing="TEXTAREA_CURSOR_SPACING" v-model="reason"></textarea>
				</view>
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="addRectify">提交整改单</button>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import wPicker from "@/components/w-picker/w-picker.vue";
	import uniCollapse from "@/components/uni-collapse/uni-collapse.vue";
	import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue";
	import {
		generateCurrentDate,
		formatDate
	} from "@/utils/date.js";
	import {
		TEXTAREA_CURSOR_SPACING
	} from "@/constants/index.js";

	export default {
		data() {
			return {
				TEXTAREA_CURSOR_SPACING,
				cYear: "",
				sYear: "",
				id: "",
				sourceId: "",
				sourceType: "",
				principalId: "",
				handleDescription: "",
				principalName: "",
				tenantId: "",
				eventVersion: "",
				content: "",
				reason: "",
				limitTime: "",
				rectifyItem: []
			};
		},
		components: {
			wPicker,
			uniCollapse,
			uniCollapseItem
		},
		onLoad(opt) {
			this.generateCurrentDate();
			for(let key in opt) {
				this[key] = opt[key];
			}
			// this.sourceId = opt.sourceId;
			// this.sourceType = opt.sourceType;
			// this.principalId = opt.principalId;
			// this.principalName = opt.principalName;
			// this.tenantId = opt.tenantId;
			// this.eventVersion = opt.eventVersion;
			// this.handleDescription = opt.handleDescription;
		},
		methods: {
			addItems() {
				let data = {};
				data.content = "";
				this.rectifyItem.unshift(data);
			},
			deleteRectifyItem(index) {
				this.rectifyItem.splice(index, 1);
			},
			generateCurrentDate() {
				let {
					date
				} = generateCurrentDate();
				let currentYear = date.getFullYear();
				this.cYear = currentYear + 1;
				this.sYear = currentYear - 1;
			},
			limitTimeChange(e) {
				if (formatDate(e.result + ":00") < Date.now()) {
					this.$showToast("整改期限不能小于或等于当前日期");
					this.closeLimitTimePicker();
					return;
				}
				this.limitTime = e.result + ":00";
			},
			closeLimitTimePicker() {
				this.$refs.limitTimePicker.hide();
			},
			showLimitTimePicker() {
				this.$refs.limitTimePicker.show();
			},

			addRectify() {
				if (!this.limitTime) {
					this.$showToast("整改期限不能为空");
					return;
				}
				if (this.rectifyItem.length == 0) {
					this.$showToast("必须填写整改项");
					return;
				}
				for (let i = 0; i < this.rectifyItem.length; i++) {
					if (!this.rectifyItem[i].content) {
						this.$showToast("整改项内容不能为空");
						return;
					}
				}
				if (!this.reason) {
					this.$showToast("整改原因不能为空");
					return;
				}

				let data = {
					items: this.rectifyItem,
					reason: this.reason,
					sourceId: this.sourceId,
					sourceType: this.sourceType,
					rectifyPrincipalId: this.principalId,
					rectifyPrincipalName: this.principalName,
					tenantId: this.tenantId,
					limitTime: this.limitTime,
					eventVersion: this.eventVersion,
					handleDescription: this.handleDescription
				};
				API.addRectify(data).then(res => {
					if (res.data.code == 200) {
						this.showToast("新增整改单成功", "success");
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							});
						}, 1500);
					} else {
						this.$showToast(res.data.message);
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.cu-list.menu>.cu-item .content {
		font-size: 28rpx;
	}

	.cu-list.menu>.cu-item {
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
			}
		}

		.rectify-item-box {
			border: 1px solid #F1F1F1;
			border-radius: 10rpx;

			.top {
				background-color: #FFFFFF;
				padding: 15rpx 30rpx 0;

				p {
					color: #999999;
					display: inline-block;
					vertical-align: top;
					width: 50%;
				}
			}
		}
	}
</style>
