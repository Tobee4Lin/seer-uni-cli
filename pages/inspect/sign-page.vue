<template>
	<view>
		<view>
			<view class="handCenter">
				<canvas style="height: 100vh;width: 88vw;margin-left: 12vw;" class="handWriting" disable-scroll="true" @touchstart="uploadScaleStart"
				 @touchmove="uploadScaleMove" @touchend="uploadScaleEnd" canvas-id="handWriting">
				</canvas>
				<view class="cu-bar bg-white justify-end customer-btn" style="width: 100vh;">
					<view class="action" style="width: 100%;">
						<button class="cu-btn line-blue text-blue" style="width: 45%;padding: 40rpx;" @click="retDraw">重写</button>
						<button class="cu-btn bg-blue margin-left" style="width: 45%;padding: 40rpx;" @click="saveSign">保存</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Handwriting from "@/libs/signature.js";
	export default {
		data() {
			return {
				handwriting: null,
			};
		},
		onLoad(opt) {
			this.type = opt.type;
			this.handwriting = new Handwriting({
				canvasName: "handWriting"
			});
		},
		methods: {
			retDraw() {
				this.clearCanvas();
				this.handwriting.retDraw();
			},
			uploadScaleStart(event) {
				this.handwriting.uploadScaleStart(event);
			},
			uploadScaleMove(event) {
				this.handwriting.uploadScaleMove(event);
			},
			uploadScaleEnd(event) {
				this.handwriting.uploadScaleEnd(event);
			},
			clearCanvas() {
				this.handwriting = null;
				this.handwriting = new Handwriting({
					canvasName: "handWriting"
				});
			},
			saveSign() {
				this.handwriting.saveCanvas().then(res => {
					uni.setStorageSync(`sign${this.type}`, res);
					uni.navigateBack();
				}).catch(err => {
					console.log(err);
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.customer-btn {
		position: fixed;
		top: 0;
		left: 20rpx;
		transform-origin: 27px;
		transform: rotate(90deg);
		z-index: 10002;
	}
</style>
