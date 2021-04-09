<template>
	<view>
		<view class="cu-form-group">
			<view class="title">检查类型</view>
			<picker @change="checkTypeChange" :value="checkTypeIndex" :range="checkTypes">
				<view class="picker">
					{{checkTypes[checkTypeIndex] || ""}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">检查模板</view>
			<jPicker style="width: 70%;line-height: 90rpx;text-align: right;" sureColor="#0091FF" class="picker cont" @sure="checkTemplateChange"
			 :val="checkTemplateIndex" :options="checkTemplates" />
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">被检查方</view>
			<input disabled="true" name="input" style="padding-right: 0;" :value="inspectTenantName"></input>
		</view> -->

		<view class="margin-tb-sm lg text-center fix-btn">
			<button class="cu-btn radius bg-blue lg shadow" @click="addInspectOrder">新增检查单</button>
		</view>

	</view>
</template>

<script>
	import API from "@/api/index.js";
	import jPicker from "@/components/J-Picker/jPicker.vue";
	export default {
		props: {
			checkTypes: {
				type: Array,
				default () {
					return [];
				}
			},
			checkTypeIds: {
				type: Array,
				default () {
					return [];
				}
			},
			checkTemplates: {
				type: Array,
				default () {
					return [];
				}
			},
			checkTemplateIds: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				checkType: "",
				checkTypeId: "",
				checkTypeIndex: 0,
				
				checkTemplate: "",
				checkTemplateId: "",
				checkTemplateIndex: 0
			};
		},
		components: {
			jPicker
		},
		methods: {
			checkTypeChange(e) {
				this.checkType = this.checkTypes[e.detail.value];
				this.checkTypeId = this.checkTypeIds[e.detail.value];
				this.checkTypeIndex = e.detail.value;
				this.$emit("getAllCheckTemplates");
			},
			checkTemplateChange(e) {
				this.checkTemplate = this.checkTemplates[e.pickerVal];
				this.checkTemplateId = this.checkTemplateIds[e.pickerVal];
				this.checkTemplateIndex = e.pickerVal;
			},
			addInspectOrder() {
				if (!this.checkTemplateId) {
					this.$showToast("检查模板不存在，请重新选择");
					return;
				}
				let inspectOrderInfo = {
					typeId: this.checkTypeId || this.checkTypeIds[0],
					typeName: this.checkType || this.checkTypes[0],
					templateId: this.checkTemplateId
				};
				this.$store.commit("saveInspectOrder", inspectOrderInfo);
				
				this.$emit("dealAddInspectOrder", "./execute-page");
			}
		}
	}
</script>

<style lang="less" scoped>
	.fix-btn {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
	}
</style>
