<template>
	<view>
		<NoticeComp
			:noticeList="noticeList" 
			:boardcastList="boardcastList" 
			@getNoticesList="getNoticesList"
			@getBoartcastsList="getBoartcastsList"
			@showOrderDetail="showOrderDetail"
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import NoticeComp from "@/components/common/notice_comp/index.vue";
	
	export default {
		data() {
			return {
				noticeList: [],
				noticePage: 1,
				totalNoticeElements: 1,
				orderParams: [{
					"fieldName": "notice.createDate",
					"order": "desc"
				}],
				
				boardcastList: [],
				boardcastPage: 1,
				totalBoardcastElements: 1,
			}
		},
		components: {
			NoticeComp
		},
		async onShow() {
			this.noticePage = 1;
			this.boardcastPage = 1;
			await this.getNoticesList(1);
			await this.getBoartcastsList(1);
		},
		async onReachBottom() {
			if (this.selectChildValue === "notice-list" &&
				this.noticeList.length < this.totalNoticeElements) {
				this.noticePage++;
				await this.getNoticesList();
			}
			if (this.selectChildValue === "boardcast-list" &&
				this.boardcastList.length < this.totalBoardcastElements) {
				this.boardcastPage++;
				await this.getBoartcastsList();
			}
		},
		methods: {
			tabSelect(payload) {
				this.selectChildValue = payload;
			},
			getNoticesList(page) {
				return new Promise((resolve, reject) => {
					API.getAllNotice({
						orderParams: this.orderParams,
						searchParams: [{
							"fieldName": "notice.broadcast",
							"operate": "eq",
							"value": 0
						}, ],
						page: page ? page : this.noticePage
					}).then(res => {
						if (res.data.code == 200) {
							this.totalNoticeElements = res.data.data.totalElements; //总条数
							if (page) {
								this.noticeList = [];
								this.noticeList = res.data.data.list;
							} else {
								this.noticeList = this.noticeList.concat(res.data.data.list);
							}
							this.noticeList.map(item => {
								item.noticeTypeNameArr = item.noticeTypeName.split(",");
							})
							resolve();
						}
					})
				})
			},
			getBoartcastsList(page) {
				return new Promise((resolve, reject) => {
					API.getAllNotice({
						orderParams: this.orderParams,
						searchParams: [{
							"fieldName": "notice.broadcast",
							"operate": "eq",
							"value": 1
						}, ],
						page: page ? page : this.boardcastPage
					}).then(res => {
						if (res.data.code == 200) {
							this.totalBoardcastElements = res.data.data.totalElements; //总条数
							if (page) {
								this.boardcastList = [];
								this.boardcastList = res.data.data.list;
							} else {
								this.boardcastList = this.boardcastList.concat(res.data.data.list);
							}
							this.boardcastList.map(item => {
								item.noticeTypeNameArr = item.noticeTypeName.split(",");
							})
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
