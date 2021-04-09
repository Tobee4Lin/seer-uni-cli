<template>
	<view>
		<InspectComp
			:inspectOrders="inspectOrders" 
			@getInspectList="getInspectList"
			@confirm="confirm"
			@showOrderDetail="showOrderDetail"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import InspectComp from "@/components/common/inspect_comp/index.vue";
	import { getItem } from "@/utils/storage.js";
	
	export default {
		data() {
			return {
				inspectOrders: [],
				inspectPage: 1,
				inspectTotalElements: 1,
				orderParams: [{
					"fieldName": "createDate",
					"order": "desc"
				}],
				searchParams: []
			};
		},
		components: {
			InspectComp
		},
		async onReachBottom() {
			if (this.inspectOrders.length < this.inspectTotalElements) {
				this.inspectPage++;
				await this.getInspectList();
			}
		},
		async onShow() {
			this.inspectPage = 1;
			await this.getInspectList(1);
		},
		methods: {
			async confirm(payload) {
				this.searchParams = payload;
				await this.getInspectList(1);
			},
			getInspectList(page) {
				let filterData = {};
				if (this.searchParams.length == 0) {
					filterData = {
						orderParams: this.orderParams,
						searchParams: [
							{
								"fieldName": "beInspectedPrincipalId",
								"operate": "eq",
								"value": getItem("principal_id")
							}
						],
						page: page ? page : this.inspectPage
					};
				} else {
					filterData = {
						orderParams: this.orderParams,
						searchParams: this.searchParams,
						page: page ? page : this.inspectPage
					};
				}
				return new Promise((resolve, reject) => {
					API.getInspectList(filterData).then(res => {
						if (res.data.code == 200) {
							this.inspectTotalElements = res.data.data.totalElements; //总条数
							if (page) {
								this.inspectOrders = [];
								this.inspectOrders = res.data.data.list;
							} else {
								this.inspectOrders = this.inspectOrders.concat(res.data.data.list);
							}
							resolve();
						}
					})
				})
			},
			
			showOrderDetail(id) {
				this.$navigateTo(`./detail?id=${id}`);
			}
		}
	}
</script>

<style lang="less">

</style>
