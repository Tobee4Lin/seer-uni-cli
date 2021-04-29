<template>
	<view>
		<InspectDetailComp 
			:inspectOrder="inspectOrder"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import InspectDetailComp from "@/components/common/inspect_comp/detail.vue";
	
	export default {
		data() {
			return {
				inspectOrder: null
			};
		},
		components: {
			InspectDetailComp
		},
		onLoad(opt) {
			this.getInspectDetail(opt.id);
		},
		methods: {
			getInspectDetail(id) {
				API.getInspectDetail(id).then(async res => {
					this.inspectOrder = res.data.data;
				});
			}
		}
	}
</script>
