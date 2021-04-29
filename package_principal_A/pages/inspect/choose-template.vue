<template>
	<view>
		<InspectChooseTemplateComp
			:checkTypes="checkTypes"
			:checkTypeIds="checkTypeIds"
			:checkTemplates="checkTemplates"
			:checkTemplateIds="checkTemplateIds"
			:sourceId="sourceId" 
			:sourceType="sourceType" 
			@getAllCheckTemplates="getAllCheckTemplates"
			@dealAddInspectOrder="dealAddInspectOrder"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import InspectChooseTemplateComp from "@/components/common/inspect_comp/choose-template.vue";
	
	export default {
		data() {
			return {
				checkTypes: [],
				checkTypeIds: [],
				checkTemplates: [],
				checkTemplateIds: [],
				currentPrincipalType: "020301",
				
				sourceId: "",
				sourceType: ""
			};
		},
		components: {
			InspectChooseTemplateComp
		},
		onLoad(opt) {
			if(opt.sourceId && opt.sourceType) {
				this.sourceId = opt.sourceId;
				this.sourceType = opt.sourceType;
			}
			this.getAllCheckTypeByPrincipal();
		},
		methods: {
			getAllCheckTypeByPrincipal() {
				API.getAllCheckTypeByPrincipal(this.currentPrincipalType).then(res => {
					res.data.data.map(item => {
						if ((item.suitablePrincipalTypes && item.suitablePrincipalTypes.includes(this.currentPrincipalType)) || !item
							.suitablePrincipalTypes) {
							this.checkTypes.push(item.name);
							this.checkTypeIds.push(item.id);
						}
					});
					this.getAllCheckTemplates();
				})
			},
			getAllCheckTemplates() {
				this.checkTemplates = [];
				this.checkTemplateIds = [];
				API.getInspectOrderTemplates({
					size: -1
				}).then(res => {
					res.data.data.list.map(item => {
						if (item.suitPrincipalTypes.includes(this.currentPrincipalType) || item.suitPrincipalTypes.length === 0) {
							this.checkTemplates.push(item.name);
							this.checkTemplateIds.push(item.id);
						}
					});
				})
			},
			
			dealAddInspectOrder() {
				this.$navigateTo("./execute-page");
			}
		}
	}
</script>
