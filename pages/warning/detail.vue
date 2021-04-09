<template>
	<view>
		<WarningDetailComp 
			:warningOrder="warningOrder"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import WarningDetailComp from "@/components/common/warning_comp/detail.vue";
	
	export default {
		data() {
			return {
				warningOrder: null
			};
		},
		components: {
			WarningDetailComp
		},
		onLoad(opt) {
			this.getWarningDetail(opt.id);
		},
		methods: {
			getWarningDetail(id) {
				API.getWarningDetail(id).then(async res => {
					this.warningOrder = res.data.data;
				});
			}
		}
	}
</script>
