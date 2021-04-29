<template>
	<view>
		<RectifyDetailComp 
			:rectifyOrder="rectifyOrder" 
			@rectifySuccess="rectifySuccess"
			@imgShow="imgShow"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import RectifyDetailComp from "@/components/common/rectify_comp/detail.vue";
	import {
		downloadFile
	} from "@/utils/index.js";
	
	export default {
		data() {
			return {
				rectifyOrder: null,
				picArr: []
			};
		},
		components: {
			RectifyDetailComp
		},
		onLoad(opt) {
			this.getRectifyOrderDetail(opt.id);
		},
		methods: {
			getRectifyOrderDetail(id) {
				API.getRectifyOrderDetail(id).then(async res => {
					this.rectifyOrder = res.data.data;
					let _r = this.rectifyOrder.items;
					for (let item of _r) {
						if (item.oriFileInfos) {
							for (let picItem of item.oriFileInfos) {
								await downloadFile(picItem, this, true);
							}
						}
						if (item.fileInfos) {
							for (let picItem of item.fileInfos) {
								await downloadFile(picItem, this, true);
							}
						}
					}
				});
			},
			rectifySuccess() {
				uni.navigateBack();
			},
			imgShow(payload) {
				uni.previewImage({
					current: payload,
					urls: this.picArr
				});
			}
		}
	}
</script>
