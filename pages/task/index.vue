<template>
	<view>
		<TaskComp
			:taskOrders="taskOrders" 
			@getTaskList="getTaskList"
			@confirm="confirm" 
			@dealDetailPath="dealDetailPath"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import TaskComp from "@/components/common/task_comp/index.vue";
	import { getItem } from "@/utils/storage.js";
	
	export default {
		data() {
			return {
				taskOrders: [],
				taskPage: 1,
				taskTotalElements: 1,
				orderParams: [{
					"fieldName": "task.createDate",
					"order": "desc"
				}],
				searchParams: []
			};
		},
		components: {
			TaskComp
		},
		async onReachBottom() {
			if (this.taskOrders.length < this.taskTotalElements) {
				this.taskPage++;
				await this.getTaskList();
			}
		},
		async onShow() {
			this.taskPage = 1;
			await this.getTaskList(1);
		},
		methods: {
			async confirm(payload) {
				this.searchParams = payload;
				await this.getTaskList(1);
			},
			getTaskList(page) {
				let filterData = {};
				if (this.searchParams.length == 0) {
					filterData = {
						orderParams: this.orderParams,
						searchParams: [{
								"fieldName": "executor.executeOrganizationId",
								"operate": "eq",
								// "value": getItem("principal_id")
								"value": "1302950471044038657"
							},
							{
								"fieldName": "batch.inspect",
								"operate": "eq",
								"value": 1
							}
						],
						page: page ? page : this.taskPage
					};
				} else {
					filterData = {
						orderParams: this.orderParams,
						searchParams: this.searchParams,
						page: page ? page : this.taskPage
					};
				}
				return new Promise((resolve, reject) => {
					API.getTaskList(filterData).then(res => {
						if (res.data.code == 200) {
							this.totalElements = res.data.data.totalElements; //总条数
							if (this.isSearch) {
								this.taskOrders = [];
								this.taskOrders = res.data.data.list;
							} else {
								this.taskOrders = this.taskOrders.concat(res.data.data.list);
							}
							resolve();
						}
					})
				})
			},
			
			dealDetailPath(path) {
				this.$navigateTo(path);
			}
		}
	}
</script>
