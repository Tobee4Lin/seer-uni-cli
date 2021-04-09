<template>
	<view>
		<NotifyComp 
			:readNotifies="readNotifies" :unreadNotifies="unreadNotifies" 
			@getReadNotifies="getReadNotifies"
			@getUnreadNotifies="getUnreadNotifies"
			@setRead="setRead"
			@setUnread="setUnread"
			@tabSelect="tabSelect"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import NotifyComp from "@/components/common/notify_comp/index.vue";
	export default {
		data() {
			return {
				selectChildValue: "read",
				readNotifies: [],
				unreadNotifies: [],
				readPage: 1,
				unreadPage: 1,
				readTotalElements: 1,
				unreadTotalElements: 1
			};
		},
		components: {
			NotifyComp
		},
		onLoad() {
			this.getReadNotifies();
			this.getUnreadNotifies();
		},
		async onReachBottom() {
			if (this.selectChildValue === "read" &&
				this.readNotifies.length < this.readTotalElements) {
				this.readPage++;
				await this.getReadNotifies();
			}
			if (this.selectChildValue === "unread" &&
				this.unreadNotifies.length < this.unreadTotalElements) {
				this.unreadPage++;
				await this.getUnreadNotifies();
			}
		},
		methods: {
			tabSelect(payload) {
				this.selectChildValue = payload;
			},
			getReadNotifies(page) {
				let filterData = {
					orderParams: [{
						"fieldName": "consumer.createDate",
						"order": "desc"
					}],
					searchParams: [
						{
							"fieldName": "consumer.read",
							"operate": "eq",
							"value": 1
						}
					],
					page: page ? page : this.readPage
				};
				return new Promise((resolve, reject) => {
					API.getNotifies(filterData).then(res => {
						if (page) {
							this.readNotifies = [];
							this.readNotifies = res.data.data.list;
						} else {
							this.readTotalElements = res.data.data.totalElements; //总条数
							this.readNotifies = this.readNotifies.concat(res.data.data.list);
						}
						resolve();
					})
				})
			},
			getUnreadNotifies(page) {
				let filterData = {
					orderParams: [{
						"fieldName": "consumer.createDate",
						"order": "desc"
					}],
					searchParams: [
						{
							"fieldName": "consumer.read",
							"operate": "eq",
							"value": 0
						}
					],
					page: page ? page : this.unreadPage
				};
			
				return new Promise((resolve, reject) => {
					API.getNotifies(filterData).then(res => {
						if (page) {
							this.unreadNotifies = [];
							this.unreadNotifies = res.data.data.list;
						} else {
							this.unreadTotalElements = res.data.data.totalElements; //总条数
							this.unreadNotifies = this.unreadNotifies.concat(res.data.data.list);
						}
						resolve();
					})
				})
			},
			setRead(index) {
				//标为已读
				let _n = this.unreadNotifies.splice(index, 1);
				API.setNotifyRead([_n[0].consumerId]).then(res => {
					if (res.data.code == 200) {
						this.readNotifies.unshift(_n[0]);
					} else {
						this.$showToast("标记失败");
					}
				});
			},
			setUnread(index) {
				//标为未读
				let _n = this.readNotifies.splice(index, 1);
				API.setNotifyUnread([_n[0].consumerId]).then(res => {
					if (res.data.data) {
						this.unreadNotifies.unshift(_n[0]);
					} else {
						this.$showToast("标记失败");
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>

</style>
