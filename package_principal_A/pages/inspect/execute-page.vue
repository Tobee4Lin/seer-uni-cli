<template>
	<view>
		<check-form-comp :checkItems="checkItems" :inspectOrderInfo="inspectOrderInfo" @navigateToAddSign="navigateToAddSign" />
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import CheckFormComp from "@/components/check-form-comp/index.vue";
	export default {
		data() {
			return {
				templateId: "",
				checkItems: [],
				inspectOrderInfo: {}
			};
		},
		onLoad(opt) {
			this.inspectOrderInfo = this.$store.state.inspectOrder;
			this.templateId = this.inspectOrderInfo.templateId;
			this.getCheckList();
		},
		components: {
			CheckFormComp
		},
		methods: {
			navigateToAddSign(payload) {
				this.$navigateTo(`./add-sign?hasImmediateRectification=${payload}`);
			},

			getCheckList() {
				API.getInspectOrderTemplateDetail(this.templateId).then(res => {
					let _res = res.data.data;

					_res.subjects.map(item => {
						item.items.map(i => {
							i.result = 2; //默认为合格
							i.description = "";
						})
					})
					this.checkItems = _res.subjects;
				})
			}
		}
	}
</script>
