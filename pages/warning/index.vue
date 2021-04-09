<template>
	<view>
		<WarningComp
			:warningOrders="warningOrders" 
			@getWarningList="getWarningList"
			@confirm="confirm"
			@showOrderDetail="showOrderDetail"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import WarningComp from "@/components/common/warning_comp/index.vue";
	import { getItem } from "@/utils/storage.js";
	
	export default {
		data() {
			return {
				warningOrders: [],
				warningPage: 1,
				warningTotalElements: 1,
				orderParams: [{
					"fieldName": "occurredTime",
					"order": "desc"
				}],
				searchParams: []
			};
		},
		components: {
			WarningComp
		},
		async onReachBottom() {
			if (this.warningOrders.length < this.warningTotalElements) {
				this.warningPage++;
				await this.getWarningList();
			}
		},
		async onShow() {
			this.warningPage = 1;
			await this.getWarningList(1);
		},
		methods: {
			async confirm(payload) {
				this.searchParams = payload;
				await this.getWarningList(1);
			},
			getWarningList(page) {
				let filterData = {};
				if (this.searchParams.length == 0) {
					filterData = {
						orderParams: this.orderParams,
						searchParams: [
							{
								"fieldName": "principalId",
								"operate": "eq",
								"value": getItem("principal_id")
							}
						],
						page: page ? page : this.warningPage
					};
				} else {
					filterData = {
						orderParams: this.orderParams,
						searchParams: this.searchParams,
						page: page ? page : this.warningPage
					};
				}
				return new Promise((resolve, reject) => {
					API.getWarningList(filterData).then(res => {
						if (res.data.code == 200) {
							this.warningTotalElements = res.data.data.totalElements; //总条数
							if (page) {
								this.warningOrders = [];
								this.warningOrders = res.data.data.list;
							} else {
								this.warningOrders = this.warningOrders.concat(res.data.data.list);
							}
							resolve();
						}
					})
				})
			},
			
			showOrderDetail(id) {
				uni.navigateTo({
					url: `./detail?id=${id}`
				});
			},
		}
	}
</script>

<style lang="less">

</style>
