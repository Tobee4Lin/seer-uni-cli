<template>
	<view>
		<view class="video-info">
			<VideoComp :cameraIndexCode="cameraIndexCode" :currentPrincipalId="principalId" />
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import VideoComp from "@/components/common/video_comp/index.vue";
	export default {
		data() {
			return {
				cameraIndexCode: "",
				principalId: "1302950471044038657"
			}
		},
		components: {
			VideoComp
		},
		onShow() {
			this.getPrincipalInfo();
		},
		methods: {
			getPrincipalInfo() {
				API.getPrincipalInfo("1300604646909284353").then(res => {
					this.cameraIndexCode = res.data.data.cameraRegionIndexCode;
					// uni.setStorageSync("cameraIndexCode", this.cameraIndexCode);
				});
			}
		}
	}
</script>

<style>

</style>
