<template>
	<view>
		<PreviewOrderDetailComp :inspectOrder="inspectOrder" @imgShow="imgShow"/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import PreviewOrderDetailComp from "@/components/common/inspect_comp/preview-order-detail.vue";
	import {
		downloadFile
	} from "@/utils/index.js";
	
	export default {
		data() {
			return {
				id: "",
				inspectOrder: null,
				picArr: []
			}
		},
		components: {
			PreviewOrderDetailComp
		},
		onLoad(opt) {
			this.id = opt.id;
			this.getInspectDetail();
		},
		methods: {
			getInspectDetail() {
				API.getInspectDetail(this.id).then(async res => {
					this.inspectOrder = res.data.data;
					let _r = this.inspectOrder.subjects;
					for (let ite of _r) {
						let num = 0;
						let toBeImprovedNum = 0;
						for (let item of ite.items) {
							if (item.result == 1) {
								//不合格
								num++;
							} else if (item.result == 3) {
								//有待完善
								toBeImprovedNum++;
							}
							if (item.fileInfos) {
								for (let picItem of item.fileInfos) {
									await downloadFile(picItem, this, true);
								}
							}
						}
						ite.unqualifiedNum = num;
						ite.toBeImprovedNum = toBeImprovedNum;
						ite.hasUnqualified = ite.unqualifiedNum > 0;
						ite.hasToBeImproved = (ite.toBeImprovedNum > 0);
					}
					this.inspectOrder.beInspectSign && await downloadFile(this.inspectOrder.beInspectSign, this);
					this.inspectOrder.inspectSign && await downloadFile(this.inspectOrder.inspectSign, this);
				});
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
