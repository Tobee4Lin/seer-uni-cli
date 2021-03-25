<template>
	<view>
		<QSInfinitePics ref="picRef" variableName="infinitePics" title="上传图片" :max="MAX_PIC_UPLOAD_NUM"></QSInfinitePics>
		
		<u-button type="primary" @click="upload">上传</u-button>
	</view>
</template>

<script>
	import {
		MAX_PIC_UPLOAD_NUM
	} from "@/constants/index.js";
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
					this.fileIds = []; //后端需要的字段
					res[0].map(item => {
						this.fileIds.push(JSON.parse(item.upLoadResult[1].data).data[0].id);
					})
					if(this.fileIds.length > 0) {
						this.$showToast("上传成功", "success");
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">

</style>
