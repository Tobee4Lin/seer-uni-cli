<template>
	<view class="wrap">
		<!-- <u-button type="default" @click="routeTo('../demo/list')">列表demo</u-button>
		<u-button type="primary" @click="routeTo('../demo/uploadPic')">上传demo</u-button> -->
		<u-button type="primary" @click="routeTo('../rectify/index')">整改中心</u-button>
		<u-row gutter="16" justify="space-between">
			<u-col span="6">
				<u-button type="primary" @click="routeTo('../inspect/index')">检查中心</u-button>
			</u-col>
			<u-col span="6">
				<u-button type="default" @click="routeTo('../inspect/choose-template')">新增检查单</u-button>
			</u-col>
		</u-row>
		<u-button type="primary" @click="routeTo('../warning/index')">预警中心</u-button>
		<u-button type="primary" @click="routeTo('../task/index')">任务中心</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			}
		}
	}
</script>

<style lang="less" scoped>
	.wrap {
		padding: 30rpx;
		/deep/ button {
			margin-bottom: 14rpx;
		}
	}
</style>
