<template>
	<view>
		<QSInfinitePics ref="picRef" variableName="infinitePics" title="上传图片" :max="MAX_PIC_UPLOAD_NUM"></QSInfinitePics>
	</view>
</template>

<script>
	import { MAX_PIC_UPLOAD_NUM } from "@/constants/index.js";
	export default {
		data() {
			return {
				MAX_PIC_UPLOAD_NUM
			};
		},
		methods: {
			//上传图片逻辑
			upload() {
				let promiseArr = this.$refs.picRef.getUpLoadPromiseArray();
				Promise.all([promiseArr]).then(res => {
					this.fileIds = [];	//后端需要的字段
					res[0].map(item => {
						this.fileIds.push(JSON.parse(item.upLoadResult[1].data).data[0].id);
					})
				})
			}
		}
	}
</script>

<style scoped lang="less">

</style>
