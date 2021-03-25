<template>
	<view class="wrap">
		<u-button type="default" @click="routeTo('list')">列表demo</u-button>
		<u-button type="primary" @click="routeTo('uploadPic')">上传demo</u-button>
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
				this.$navigateTo(`../demo/${url}`);
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
