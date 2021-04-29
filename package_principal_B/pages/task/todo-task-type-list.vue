<template>
	<view>
		<view class="block-wrap" style="border-bottom: none;">
			<view class="cu-bar bg-white">
				<view class="action title">
					我的待办
				</view>
			</view>
			<view>
				<view class="customer-bg radius" v-for="(item, index) in todoTaskTypeList" :key="index" @click="routeTodoTask(item.id)">
					<view class="customer-text">{{item.name}}</view>
					<view class="num-text">{{item.count}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	export default {
		data() {
			return {
				todoTaskTypeList: []
			};
		},
		created() {
			this.getAllTaskType();
		},
		methods: {
			getAllTaskType() {
				return new Promise((resolve, reject) => {
					API.getAllTaskType({
						assignee: "ys_fj_admin_li",
						executeOrganizationId: "1229619270476890115"
					}).then(res => {
						if (res.data.code == 200) {
							this.todoTaskTypeList = res.data.data.filter(i => i.name.indexOf("视频") < 0 && i.name.indexOf("日常") < 0);
							resolve();
						}
					})
				})
			},
			
			routeTodoTask(tid) {
				this.$navigateTo("./todo-task-list", {
					typeId: tid
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.block-wrap {
		.customer-bg {
			background: linear-gradient(to left, #6075ed, #008dd3);
			width: 30%;
			// width: 320rpx;
			height: 180rpx;
			margin-left: 20rpx;
			margin-bottom: 20rpx;
			display: inline-block;
		}

		.customer-text {
			height: 50%;
			text-align: center;
			color: #FFFFFF;
			font-size: 30rpx;
			line-height: 42rpx;
			padding-top: 35rpx;
		}

		.num-text {
			text-align: center;
			color: #FFFFFF;
			font-size: 40rpx;
			line-height: 56rpx;
			height: 50%;
			padding-top: 17rpx;
		}

		.title {
			font-size: 32rpx;
			font-weight: 600;
			line-height: 48rpx;
		}
	}
</style>
