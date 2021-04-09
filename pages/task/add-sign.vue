<template>
	<view>
		<TaskAddSignComp 
			:rectify="rectify" 
			:inspectOrder="inspectOrder" 
			@routeToSign="routeToSign" 
			:sign1="sign1" 
			:sign2="sign2" 
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import TaskAddSignComp from "@/components/common/task_comp/add-sign.vue";
	import {
		downloadFile
	} from "@/utils/index.js";

	export default {
		data() {
			return {
				rectify: false,
				inspectOrder: null,
				sign1: "",
				sign2: ""
			};
		},
		components: {
			TaskAddSignComp
		},
		onShow() {
			this.sign1 = uni.getStorageSync("sign1") || "";
			this.sign2 = uni.getStorageSync("sign2") || "";
		},
		onLoad(opt) {
			if (opt.hasImmediateRectification == 'true') {
				this.rectify = true;
			}
			this.showInspectDetail();
		},
		onUnload() {
			uni.getStorageSync("sign1") && uni.removeStorageSync("sign1");
			uni.getStorageSync("sign2") && uni.removeStorageSync("sign2");
		},
		methods: {
			async showInspectDetail() {
				//获取任务单对应的相关检查单
				this.inspectOrder = this.$store.state.inspectInfo.inspectOrder;
				let _r = this.inspectOrder.subjects;
				for (let ite of _r) {
					for (let item of ite.items) {
						if (item.fileInfos) {
							for (let picItem of item.fileInfos) {
								await downloadFile(picItem, this, true);
							}
						}
					}
				}
			},

			routeToSign(payload) {
				this.$navigateTo("./sign-page", { type: payload });
			}
		}
	}
</script>
