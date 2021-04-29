export default {
	data() {
		return {
			picArr: [],
		}
	},
	methods: {
		imgShow(e) {
			let src = e.currentTarget.dataset.src;
			uni.previewImage({
				current: src,
				urls: this.picArr
			});
		}
	}
}
