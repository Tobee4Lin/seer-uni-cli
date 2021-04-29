<template>
	<view>
		<WarningDetailComp 
			:sourceId="id" 
			:tenantId="tenantId" 
			:warningOrder="warningOrder"
			@dealRectify="dealRectify"
			@dealInspect="dealInspect"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import WarningDetailComp from "@/components/common/warning_comp/detail.vue";
	
	export default {
		data() {
			return {
				id: "",
				tenantId: "",
				warningOrder: null
			};
		},
		components: {
			WarningDetailComp
		},
		onLoad(opt) {
			this.id = opt.id;
			this.tenantId = opt.tenantId;
			this.getWarningDetail();
		},
		methods: {
			getWarningDetail() {
				API.getWarningDetail(this.id).then(async res => {
					this.warningOrder = res.data.data;
				});
			},
			dealRectify(payload) {
				this.$navigateTo("../rectify/add", payload);
			},
			dealInspect(payload) {
				this.$navigateTo("../inspect/choose-template", payload);
			}
		}
	}
</script>
