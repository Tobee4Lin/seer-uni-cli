<template>
	<view class="wrap">
		<view class="cu-modal bottom-modal" :class="modalCard=='modalCard'?'show':''" @tap="hideCardModal">
			<view class="cu-dialog" @tap.stop="" style="position: relative;margin-bottom: 85rpx;">
				<!-- <scroll-view class="page padding" :scroll-y=true :style="{'height':swiperHeight}"> -->
				<view class="cu-bar solid-bottom" style="background-color: #EFEFF4;
					position: absolute;
					top: 0;
					height: 100rpx;
					width: 100%;
					z-index: 1005;">
					<view class="content" style="padding-right: 80rpx;left: 50%;text-align: right;">
						<text class="cuIcon-list text-gray"></text>
						<text style="margin-left: 15rpx;color: #6D7278;">{{subjectIndex + 1}}/{{checkItems.length}}</text>
					</view>
				</view>
				<scroll-view class="page" :scroll-y="true" style="position: relative;z-index: 1000;">
					<view class="grid col-2" style="margin-top: 100rpx;max-height: 600rpx;overflow: scroll;height: auto;padding-bottom: 15rpx;">
						<view class="margin-tb-sm text-center" v-for="(item, index) in checkItems" :key="index">
							<button class="cu-btn round text-white bg-blue" style="font-weight: 500;font-size: 30rpx;width: 90%;height: 74rpx;"
							 @click="appointedItem(index)">
								{{index + 1}}、{{item.name}}
							</button>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<form>
			<swiper duration="100" :current="subjectIndex" class="swiper-box form-content" @change="SwiperChange" :style="{'height':swiperHeight}">
				<swiper-item class="outer" v-for="(item1, index1) in checkItems" :key="index1">
					<view class="item">
						<view class="title" style="display: flex;">
							<view style="width: 40rpx;">
								<text class='cuIcon-tagfill' style="margin-right: 10rpx;color: #0091FF;"></text>
							</view>
							<view style="flex: 1;word-wrap: break-word; word-break: normal;">
								{{item1.name}}
							</view>
						</view>
						<view v-for="(item, index) in item1.items" :key="index" class="block-wrap">
							<text class="sub-title content">
								{{item.number === 0 ? index+1 : item.number}}、{{item.content}}
							</text>

							<view style="text-align: right;padding: 20rpx 0;">
								<radio-group @change="getSelectValue($event.detail.value, item)">
									<view>
										<label>
											<radio class="radio-style" :value="2"></radio>
											<view class="radio-text-style">合格</view>
										</label>
										<label>
											<radio class="radio-style red" :value="1"></radio>
											<view class="radio-text-style">不合格</view>
										</label>
										<label>
											<radio class="radio-style grey" :checked="item.lastUnsuiteds" :value="0"></radio>
											<view class="radio-text-style">不适用</view>
										</label>
										<label>
											<radio class="radio-style yellow" :value="3"></radio>
											<view class="radio-text-style">有待完善</view>
										</label>
									</view>
								</radio-group>
							</view>

							<QSRadio :itemArray="dealItemArray()" @change="getSelectValue($event, item)" style="display: none;"></QSRadio>
							<view class="not-completed-info" v-if="item.result==1">
								<view class="cu-form-group">
									<view class="">整改要求</view>
									<picker @change="itemRectifyTypeChange($event, index1, index, item)" :range="rectifyTypeName">
										<view class="picker">
											{{rectifyTypeName[item.rectifyTypeIndex] || rectifyTypeName[0]}}
										</view>
									</picker>
								</view>

								<block>
									<QSTextarea v-if="showDescription" value="" textareaWidth=110 placeholder="输入整改描述" v-model="item.description" :cursor_spacing="TEXTAREA_CURSOR_SPACING"></QSTextarea>
									<view class="pic-info">
										<p class="sub-title">现场照片</p>
										<!-- 需要去插件目录下config目录中pics.js中配置上传图片url -->
										<QSInfinitePics :ref="'picRef_'+index1+'_'+index" variableName="infinitePics" title="上传图片" :max="MAX_PIC_UPLOAD_NUM"></QSInfinitePics>
									</view>
								</block>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</form>
		<view class="btn-group">
			<view class="bg2">
				<button v-if="subjectIndex !== 0" @click="MoveSubject(-1)" class="btn" type="default">
					<text class='cuIcon-back' style="color: #888888;"></text>
				</button>
				<button v-else class="btn" type="default" @click="backLast">
					<text class='cuIcon-back' style="color: #888888;"></text>
				</button>

				<view class="btn center" data-target="modalCard" @click="showCardModal">
					<text class='cuIcon-list' style="margin-right: 10rpx;color: #888888;"></text>
					{{subjectIndex + 1}}/{{checkItems.length}}
				</view>

				<button v-if="subjectIndex !== checkItems.length-1" @click="MoveSubject(1)" class="btn btn-v" type="primary">
					<text class='cuIcon-right' style="color: #F8F8F8;"></text>
				</button>
				<button v-else class="btn btn-v" type="primary" @click="submit">
					<text v-if="subjectIndex!==checkItems.length-1" class='cuIcon-right' style="color: #F8F8F8;"></text>
					<text v-else>提交</text>
				</button>
			</view>
		</view>

	</view>
</template>

<script>
	import API from "@/api/index.js"
	import {
		mapState
	} from "vuex";
	// import QSInput from "@/components/QS-inputs-split/elements/QS-input/index.vue"
	import QSRadio from "@/components/QS-inputs-split/elements/QS-radio/index.vue"
	import QSTextarea from "@/components/QS-inputs-split/elements/QS-textarea/index.vue"
	import QSInfinitePics from "@/components/QS-inputs-split/elements/QS-infinitePics/index.vue"
	import QSApp from "@/components/QS-inputs-split/js/app.js"
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	// import wPicker from "../w-picker/w-picker.vue"
	import {
		format
	} from "@/utils/date.js";
	import {
		MAX_PIC_UPLOAD_NUM,
		TEXTAREA_CURSOR_SPACING
	} from "@/constants/index.js"

	export default {
		props: {
			checkItems: [Object, Array],
			inspectOrderInfo: Object,
			source: {
				type: String,
				default: "inspect"
			},
			checkFrom: String
		},
		watch: {
			checkItems(nV, oV) {
				if (nV.length > 0) {
					this.checkItems.map(i => {
						i.items.map(i1 => {
							this.inspectItemsLength++;
						})
					})
					this.calcSwiperHeight();
				}
			}
		},
		components: {
			// QSInput,
			QSRadio,
			QSTextarea,
			QSInfinitePics,
			uniIcons,
			// wPicker
		},
		data() {
			return {
				MAX_PIC_UPLOAD_NUM,
				TEXTAREA_CURSOR_SPACING,
				showDescription: true,
				beginTime: "",
				subjectIndex: 0,
				statusBarHeight: 0,
				swiperHeight: "",

				cYear: "",
				sYear: "",

				rectifyTypeName: [],
				rectifyTypeCode: [],

				modalCard: null,
				
				inspectItemsLength: 0,
				checkedCount: 0
			};
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		created() {
			this.getAllRectifyType();
			this.generateCurrentDate();
			this.calcSwiperHeight();
			this.getStatusBarHeight();
			this.beginTime = format(new Date(), "yyyy-MM-dd hh:mm:ss");
		},

		methods: {
			backLast() {
				uni.showModal({
					title: '提示',
					content: '确定离开吗，当前所填信息将不会被保存',
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack();
						} else if (res.cancel) {
							return;
						}
					}
				});
				return;
			},
			submit() {
				let _arr = JSON.parse(JSON.stringify(this.checkItems));
				_arr.map(item => {
					item.items.map((item1, index) => {
						item1.fileInfos = [];
					})
				})
				
				let promiseArr = [];
				let dealArr = JSON.parse(JSON.stringify(_arr));
				for (let key in this.$refs) {
					promiseArr.push(this.$refs[key][0].getUpLoadPromiseArray());
				}
				this.addInspectOrder(dealArr, promiseArr, this.inspectOrderInfo);
				// if(this.checkedCount < this.inspectItemsLength) {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: `当前检查仍有${this.inspectItemsLength - this.checkedCount}项检查项未完成，请继续完成检查`,
				// 		showCancel: false
				// 	});
				// 	return;
				// } else {
				// 	let _arr = JSON.parse(JSON.stringify(this.checkItems));
				// 	_arr.map(item => {
				// 		item.items.map((item1, index) => {
				// 			item1.fileInfos = [];
				// 		})
				// 	})
					
				// 	let promiseArr = [];
				// 	let dealArr = JSON.parse(JSON.stringify(_arr));
				// 	for (let key in this.$refs) {
				// 		promiseArr.push(this.$refs[key][0].getUpLoadPromiseArray());
				// 	}
				// 	this.addInspectOrder(dealArr, promiseArr, this.inspectOrderInfo);
				// }
			},
			getAllRectifyType() {
				API.getDict("RECTIFY_TYPE").then(res => {
					res.data.data.items.map(item => {
						this.rectifyTypeName.push(item.name);
						this.rectifyTypeCode.push(item.code);
					})
				})
			},
			itemRectifyTypeChange(e, index0, index1, item) {
				let _v = e.detail.value;
				item.rectifyTypeName = this.rectifyTypeName[_v];
				item.rectifyTypeCode = _v;
				item.originRectifyTypeName = this.rectifyTypeName[_v];
				item.originRectifyTypeCode = _v;
				this.$set(item, "rectifyTypeIndex", _v);
			},
			generateCurrentDate() {
				let date = new Date();
				this.cYear = date.getFullYear();
				this.sYear = this.cYear * 1 - 1;
			},
			calcSwiperHeight() {
				if (this.checkItems.length > 0) {
					let _max = 0;
					let that = this;
					this.checkItems.map(item => {
						if (item.items.length > _max) {
							_max = item.items.length;
						}
					})
					that.swiperHeight = (395 * _max) + 250 + 'px';
				}
			},
			getStatusBarHeight() {
				uni.getSystemInfo({
					success: (e) => {
						// #ifdef MP-WEIXIN
						let custom = wx.getMenuButtonBoundingClientRect();
						this.statusBarHeight = custom.bottom + custom.top - e.statusBarHeight;
						// #endif
					}
				})
			},
			dealItemArray() {
				let _arr = [{
						name: "合格",
						value: 2,
						selectColor: "green"
					},
					{
						name: "不合格",
						value: 1,
						selectColor: "red"
					},
					{
						name: "不适用",
						value: 0,
						selectColor: "grey"
					},
					{
						name: "有待完善",
						value: 3,
						selectColor: "yellow"
					}
				];
				return _arr;
			},
			getSelectValue(opt, item) {
				this.$set(item, "result", opt);
				//不合格
				if (opt == 1) {
					item.rectifyTypeName = item.originRectifyTypeName ? item.originRectifyTypeName : "现场立即整改";
					item.rectifyTypeCode = item.originRectifyTypeCode ? item.originRectifyTypeCode : "0";
				} else {
					item.rectifyTypeName = "";
					item.rectifyTypeCode = "";
				}
				
				if (!item.hasSelected) {
					this.$set(item, "hasSelected", true);
					this.checkedCount++;
				}
			},
			addInspectOrder(dealArr, promiseArr, inspectOrderInfo) {
				Promise.all(promiseArr).then(res => {
					let tempArr = [];
					dealArr.map((item_1, index_1) => {
						item_1.items.map((item_2, index_2) => {
							if (item_2.result == 1) {
								tempArr.push([index_1, index_2]);
							}
						})
					})
					for (let i = 0; i < res.length; i++) {
						for (let j = 0; j < tempArr.length; j++) {
							let _d = dealArr[tempArr[j][0]].items[tempArr[j][1]];
							if (_d && _d.result == 1 && (_d.rectifyTypeCode == '1' || _d.rectifyTypeCode == '0')) {
								_d.fileInfos.push(res[i]);
								res.splice(i, 1);
							}
						}
					}

					dealArr.map(item => {
						item.items.map(item_1 => {
							let dealInfo = [];
							if (item_1.fileInfos && item_1.fileInfos.length > 0) {
								item_1.fileInfos[0].map(item_2 => {
									let info = JSON.parse(item_2.upLoadResult[1].data);
									dealInfo.push(info.data[0]);
								})
								item_1.fileInfos = dealInfo;
								let _fileIds = [];
								item_1.fileInfos.map(i => {
									_fileIds.push(i.id);
								})
								item_1.fileIds = _fileIds;
							}
						})
					})

					//默认合格的情况
					let _result = 2;
					dealArr.map(item => {
						let arr = item.items;
						for (let i = arr.length - 1; i >= 0; i--) {
							if (arr[i].result == 0) {
								//对不适用的项进行剔除
								item.items.splice(i, 1);
							} else if (arr[i].result == 1) {
								//不合格
								_result = 1;
								break;
							}
						}
					})

					let currentDate = format(new Date(), "yyyy-MM-dd hh:mm:ss");
					let inspectInfoData = {};
					let inspectInfo = {};
					if (this.source === "task") {
						inspectInfoData = {
							beInspectedPrincipalId: inspectOrderInfo.beInspectedPrincipalId,
							beInspectedPrincipalName: inspectOrderInfo.beInspectedPrincipalName,
							inspectTenantId: inspectOrderInfo.inspectTenantId,
							inspectTenantName: inspectOrderInfo.inspectTenantName,

							// inspectTypeId: inspectOrderInfo.inspectTypeId,
							// inspectPrincipalId: inspectOrderInfo.inspectPrincipalId,

							// sourceType: inspectOrderInfo.sourceType,
							subjects: dealArr,
							title: inspectOrderInfo.title,
							typeId: inspectOrderInfo.typeId,
							typeName: inspectOrderInfo.typeName,
							beginTime: this.beginTime,
							endTime: currentDate,
							description: inspectOrderInfo.title,
							// location: this.locationInfo.inspectLocation,
							// latitude: this.locationInfo.latitude,
							// longitude: this.locationInfo.longitude,
							_result
						};

						inspectInfo = {
							inspectOrder: inspectInfoData,
							taskOrderId: inspectOrderInfo.taskOrderId,
							version: inspectOrderInfo.version * 1,
							taskBatchVersion: inspectOrderInfo.taskBatchVersion * 1
						}
					} else {
						inspectInfoData = {
							beInspectedPrincipalId: inspectOrderInfo.beInspectedPrincipalId,
							beInspectedPrincipalName: inspectOrderInfo.beInspectedPrincipalName,
							inspectTenantId: inspectOrderInfo.inspectTenantId,
							inspectTenantName: inspectOrderInfo.inspectTenantName,
							sourceType: inspectOrderInfo.sourceType,
							sourceId: inspectOrderInfo.sourceId || "",
							eventVersion: inspectOrderInfo.eventVersion,
							handleType: inspectOrderInfo.handleType || "",
							subjects: dealArr,
							title: `${currentDate}，${inspectOrderInfo.inspectTenantName}进行现场检查`,
							typeId: inspectOrderInfo.typeId,
							typeName: inspectOrderInfo.typeName,
							beginTime: this.beginTime,
							endTime: currentDate,
							description: `${currentDate}，${inspectOrderInfo.inspectTenantName}进行现场检查`,
							_result
						};

						inspectInfo = Object.assign({}, inspectInfoData);
					}

					let _iidata = inspectInfoData.subjects;
					_iidata.map(item_0 => {
						let unqualifiedNum = 0;
						let toBeImprovedNum = 0;
						item_0.items.map(item_1 => {
							if (item_1.result == 1) {
								//不合格
								unqualifiedNum++;
							} else if(item_1.result == 3) {
								//有待完善
								toBeImprovedNum++;
							}
						})
						item_0.unqualifiedNum = unqualifiedNum;
						item_0.toBeImprovedNum = toBeImprovedNum;
						item_0.hasUnqualified = (item_0.unqualifiedNum > 0);
						item_0.hasToBeImproved = (item_0.toBeImprovedNum > 0);
					})

					for (let i = _iidata.length - 1; i >= 0; i--) {
						if (_iidata[i].items.length === 0) {
							_iidata.splice(i, 1);
						}
					}
					this.$store.commit("saveInspectInfo", inspectInfo);
					for (let i = 0; i < _iidata.length; i++) {
						for (let j = 0; j < _iidata[i].items.length; j++) {
							//立即整改
							if (_iidata[i].items[j].rectifyTypeCode == 1) {
								uni.showModal({
									title: '提示',
									content: '检查单中不合格项中含有整改方式为“限期整改”的项点，是否前往新增整改单',
									showCancel: true,
									cancelText: "暂不",
									success: (res) => {
										if (res.confirm) {
											this.$emit("navigateToAddSign", true);
											return;
										} else if (res.cancel) {
											this.$emit("navigateToAddSign", false);
											return;
										}
										return;
									}
								});
								return;
							}
						}
					}
					// this.hasSubmitModify = false;
					this.$emit("navigateToAddSign", false);
				})
			},
			showCardModal(e) {
				this.modalCard = e.currentTarget.dataset.target;
				this.showDescription = false;
			},
			hideCardModal(e) {
				this.modalCard = null;
				this.showDescription = true;
			},
			back2Top() {
				let that = this;
				this.$nextTick(function() {
					uni.createSelectorQuery().in(that).select('.outer').boundingClientRect(function(e) {
						uni.pageScrollTo({
							scrollTop: e.top - 10 - that.statusBarHeight,
							// scrollTop: that.statusBarHeight,
							duration: 0
						});
					}).exec();
				})
			},
			SwiperChange(e) { //滑动事件
				let index = e.target.current;
				if (index != undefined) {
					this.subjectIndex = index;
				}
			},

			MoveSubject(e) {
				this.back2Top();
				this.showDescription = true;
				if (e === -1 && this.subjectIndex != 0) {
					this.subjectIndex -= 1;
				}
				if (e === 1 && this.subjectIndex < this.checkItems.length - 1) {
					this.subjectIndex += 1;
				}
			},

			appointedItem(index) {
				this.back2Top();
				this.showDescription = true;
				this.modalCard = null;
				this.subjectIndex = index;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../colorui/animation.css";

	.form-content {
		white-space: nowrap; // 滚动必须加的属性
		width: 100%;
		padding: 10px 0;
		margin: 0 auto 40rpx;

		.outer {
			.item {
				width: 100%;

				display: inline-block;
				vertical-align: top;

				.title {
					background: rgba(250, 250, 250, 1);
					box-shadow: 0px -1px 0px 0px rgba(229, 229, 229, 1);
					font-size: 28rpx;
					padding: 20rpx 25rpx;
					// font-family:PingFangSC-Regular,PingFang SC;
					font-weight: 400;
					color: rgba(53, 53, 53, 1);
					line-height: 40rpx;
					margin-bottom: 30rpx;
				}

				.block-wrap {
					padding: 0 25rpx;
					width: 100vw;
					white-space: normal;
					word-break: break-all;
					word-wrap: break-word;

					.content {
						font-size: 30rpx;
						// font-family: PingFangSC-Regular,PingFang SC;
						font-weight: 400;
						color: rgba(34, 34, 34, 1);
						line-height: 48rpx;
					}

					.not-completed-info {
						.pic-info {
							.sub-title {
								display: block; // 让字体换行
								line-height: 40upx;
								color: #999999;
								padding: 0 30rpx;
							}
						}
					}

					.radio-style {
						transform: scale(.8);
						display: inline-block;
					}

					.radio-text-style {
						font-size: 30rpx;
						margin: 5rpx 20rpx 0 5rpx;
						display: inline-block;
						color: #666;
					}
				}
			}
		}
	}

	.btn-group {
		.bg1 {
			width: 100vw;
			z-index: 9998;
			position: fixed;
			bottom: 85rpx;
			display: flex;
			padding: 20rpx 30rpx;
		}

		.bg2 {
			width: 100vw;
			z-index: 10000;
			position: fixed;
			bottom: 0;
			display: flex;

			.btn {
				flex: 1;
			}

			.center {
				background-color: #FFFFFF;
				text-align: center;
				color: #666;
				padding-top: 25rpx;
				border: 1px solid rgba(0, 0, 0, .2);
				line-height: 45rpx;
			}

			.btn-v {
				background-color: #0091FF;
			}

			button {
				border-radius: 0;
			}

			button::after {
				border-radius: 0;
			}
		}
	}
</style>
