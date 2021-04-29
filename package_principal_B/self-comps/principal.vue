<template>
	<view class="wrap">
		<view class="cu-bar bg-white search fixed">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" @input="debounceSearch()" confirm-type="search" v-model="searchText"></input>
			</view>
			<view class="action">
				<button class="cu-btn shadow-blur round" @click="search">搜索</button>
			</view>
		</view>
		<view class="wrap" style="height: calc(100vh - 100rpx);margin-top: 100rpx;">
			<view v-if="principalList.length === 0" style="padding: 20rpx;font-size: 30rpx;text-align: center;margin: 0 auto;">
				<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
				<view class="text-gray">
					暂无内容
				</view>
			</view>
			<view v-else class="item" v-for="(item, index) in principalList" :key="index" @click="selectPrincipal()">
				<p class="name">{{item.name}}</p>
				<p class="info">
					<text class="cuIcon-location"></text>
					{{item.fullAddress}}
				</p>
			</view>
		</view>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import { debounce } from "@/utils/index.js";
	
	export default {
		data() {
			return {
				principalList: [],
				searchText: ""
			};
		},
		created() {
			this.getAllPrincipal();
		},
		methods: {
			routeTo(url) {
				this.$navigateTo(url);
			},
			debounceSearch: debounce(function() {
				this.search();
			}, 300),
			search() {
				this.principalList = this.originList.filter(item => {
					return item.name.indexOf(this.searchText) > -1;
				});
			},
			getAllPrincipal() {
				let filterData = {
					"searchParams": [
						{
							"fieldName": "tenant_id",
							"operate": "eq",
							"value": "1229619270476890115"
						},
						{
							"fieldName": "type",
							"operate": "eq",
							"value": "ST03"
						}
					],
					size: -1
				}
				
				API.getPrincipals(filterData).then(res => {
					if(res.data.code == 200) {
						this.principalList = res.data.data.list;
						this.originList = JSON.parse(JSON.stringify(this.principalList));
					}
				})
			},
			selectPrincipal() {
				this.$navigateTo("../principal-info/index");
			}
		}
	}
</script>

<style lang="less" scoped>
	.wrap {
		.item {
			border-bottom: 1rpx solid #E5E5E5;
			padding: 25rpx;
			background-color: #fff;
			border-radius: 5rpx;
			.name {
				font-size: 34rpx;
				font-weight: 600;
				color: rgba(0,0,7,1);
				margin-bottom: 25rpx;
			}
			.info {
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
				text {
					margin-right: 5rpx;
				}
			}
		}
	}
</style>
