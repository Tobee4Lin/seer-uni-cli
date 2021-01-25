<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback">
			<view class="news_list" v-for="item in dataList" :key="item.id">

			</view>
		</mescroll-body>
	</view>
</template>
<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				dataList: []
			}
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				this.loadData(1);
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				this.loadData(page.num);
			},
			loadData(pageNo) {
				this.$http
					.post('api/articles/v1/articles_list', {
						pageNo: pageNo,
						pageSize: 10
					}, {
						load: false
					}).then(res => {
						uni.stopPullDownRefresh();
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;

						//方法一(推荐): 后台接口有返回列表的总页数 totalPage
						this.mescroll.endByPage(res.data.length, res.pages); //必传参数(当前页的数据个数, 总页数)

						//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
						//this.mescroll.endBySize(res.data.length, res.count); //必传参数(当前页的数据个数, 总数据量)

						//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
						//this.mescroll.endSuccess(res.data.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

						if (pageNo == 1) {
							this.dataList = res.data;
						} else {
							this.dataList = this.dataList.concat(res.data);
						}
					}).catch(() => {
						//联网失败, 结束加载
						this.mescroll.endErr();
					});
			}
		},

	}
</script>

<style scoped lang="less">
	
</style>
