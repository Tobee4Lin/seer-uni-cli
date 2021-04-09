<template>
	<view>
		<check-form-comp :checkItems="checkItems" :inspectOrderInfo="inspectOrderInfo" source="task" @navigateToAddSign="navigateToAddSign" />
	</view>
</template>

<script>
	import API from "@/api/index.js"
	import CheckFormComp from "@/components/check-form-comp/index.vue"
	export default {
		data() {
			return {
				tid: "",
				title: "",
				beInspectedPrincipalId: "",
				beInspectedPrincipalName: "",
				checkItems: [],
				// taskInspectId: "",
				version: "",
				batchVersion: "",
				inspectOrderInfo: {}
			};
		},
		onLoad(opt) {
			this.tid = opt.id;
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
				API.getTaskDetailById(this.tid).then(res => {
					let _res = res.data.data;

					uni.setNavigationBarTitle({
						title: _res.typeName
					});

					this.inspectOrderInfo.typeId = _res.typeId;
					this.inspectOrderInfo.typeName = _res.typeName;
					// this.inspectOrderInfo.title = this.title;
					// this.inspectOrderInfo.inspectTenantId = this.$store.state.canteenInfo.tenantId;
					// this.inspectOrderInfo.inspectTenantName = this.$store.state.canteenInfo.tenantName;
					// this.inspectOrderInfo.taskInspectId = this.taskInspectId;
					this.inspectOrderInfo.taskOrderId = this.tid;
					// this.inspectOrderInfo.version = this.version;
					// this.inspectOrderInfo.taskBatchVersion = this.batchVersion;
					// this.inspectOrderInfo.beInspectedPrincipalId = this.beInspectedPrincipalId;
					// this.inspectOrderInfo.beInspectedPrincipalName = this.beInspectedPrincipalName;

					_res.inspectSubjects.map(item => {
						item.items.map(i => {
							i.result = 2;
							i.description = "";
						})
					})
					this.checkItems = _res.inspectSubjects;
				})
			}
		}
	}
</script>
