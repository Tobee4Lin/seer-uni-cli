<template>
	<view>
		<RectifyComp 
			:rectifyOrders="rectifyOrders" 
			@getRectifyOrder="getRectifyOrder"
			@confirm="confirm"
			@showOrderDetail="showOrderDetail"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import RectifyComp from "@/components/common/rectify_comp/index.vue";
	import { getItem } from "@/utils/storage.js";
	
	export default {
		data() {
			return {
				rectifyOrders: [],
				rectifyPage: 1,
				rectifyTotalElements: 1,
				orderParams: [{
					"fieldName": "createDate",
					"order": "desc"
				}],
				searchParams: []
			};
		},
		components: {
			RectifyComp
		},
		async onReachBottom() {
			if (this.rectifyOrders.length < this.rectifyTotalElements) {
				this.rectifyPage++;
				await this.getRectifyOrder();
			}
		},
		async onShow() {
			this.rectifyPage = 1;
			await this.getRectifyOrder(1);
		},
		methods: {
			async confirm(payload) {
				this.searchParams = payload;
				await this.getRectifyOrder(1);
			},
			getRectifyOrder(page) {
				let filterData = {
					orderParams: this.orderParams,
					page: page ? page : this.rectifyPage
				};
				if (this.searchParams.length == 0) {
					filterData["searchParams"] = [{
						"fieldName": "rectify.rectifyPrincipalId",
						"operate": "eq",
						"value": getItem("principal_id")
					}];
				} else {
					filterData["searchParams"] = this.searchParams;
				}
				return new Promise((resolve, reject) => {
					API.getRectifyOrder(filterData).then(res => {
						if (res.data.code == 200) {
							this.rectifyTotalElements = res.data.data.totalElements; //总条数
							if (page) {
								this.rectifyOrders = [];
								this.rectifyOrders = res.data.data.list;
							} else {
								this.rectifyOrders = this.rectifyOrders.concat(res.data.data.list);
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
