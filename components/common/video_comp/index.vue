<template>
	<view>
		<w-picker mode="dateTime" :startYear="sYear" :endYear="cYear" :current="true" @confirm="playbackStartTimeChange"
		 @cancel="closePlaybackStartTimePicker" ref="playbackStartTimePicker" themeColor="#0091FF"></w-picker>
		<w-picker mode="dateTime" :startYear="sYear" :endYear="cYear" :current="true" @confirm="playbackEndTimeChange"
		 @cancel="closePlaybackEndTimePicker" ref="playbackEndTimePicker" themeColor="#0091FF"></w-picker>

		<view class="wrap" v-if="cStatus">
			<view class="cu-bar bg-white">
				<view class="action" style="margin-left: 0 !important;">
					<text class="cuIcon-title text-blue"></text> {{curName}}
				</view>
				<!-- <view class="action" style="margin-right: 0 !important;">
					<button class="cu-btn round bg-blue shadow" style="height: 64rpx !important;" @click="showPlaybackStartTimePicker">查看回放</button>
				</view> -->
			</view>
			<view class="info">
				<video id="video" :src="url" :controls="true" :show-progress="!isLive" ref="videoRef" autoplay></video>
			</view>
			<view class="grid col-2">
				<!-- <view v-for="(item, index) in cameraList" class="padding-xs" :key="index" v-if="item.visible"> -->
				<view v-for="(item, index) in cameraList" class="padding-xs" :key="index">
					<button v-if="item.online == 1" style="font-size: 28rpx;" class="cu-btn bg-blue lg block" @click="getVideoUrl(item.indexCode, item.cn)">
						{{item.cn}}
					</button>
					<button v-else style="font-size: 28rpx;" class="cu-btn block bg-blue lg" disabled type="">
						{{item.cn}}(已离线)
					</button>
				</view>
			</view>
		</view>
		<view v-else style="padding: 20rpx;font-size: 30rpx;text-align: center;">
			<image src="/static/common/empty.png" style="width: 160rpx;height: 120rpx;" mode="aspectFill"></image>
			<view class="text-gray">
				暂无摄像头
			</view>
		</view>
	</view>
</template>

<script>
	import Vue from "vue";
	// import VIDEO_API from "@/api/video.js";
	import API from "@/api/index.js";
	import {
		generateCurrentDate,
		formatDate
	} from "@/utils/date.js";
	import wPicker from '@/components/w-picker/w-picker.vue';

	export default {
		props: ["cameraIndexCode", "currentPrincipalId"],
		components: {
			wPicker
		},
		data() {
			return {
				cameraList: [],
				originCameraList: [],
				cameraName: null,
				url: "",
				videoList: [],
				cStatus: true,
				curName: "",

				curCameraIndexCode: "",
				sYear: "",
				cYear: "",
				playbackStartTime: "",
				playbackEndTime: "",
				isLive: true,
				retryCount: 0,
				
				publicHeader: {
					Authorization: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzZWVyX2d1ZXN0X3NjIiwicHJpbmNpcGFsLWlkIjoie1wiY2l0eUlkXCI6XCI2NTMyXCIsXCJpc29sYXRpb25Td2l0Y2hcIjpmYWxzZSxcInByaW5jaXBhbElkXCI6XCIxMzAwNjA0NjQ2OTA5Mjg0MzUzXCIsXCJwcmluY2lwYWxUeXBlXCI6XCJTVDAyXCIsXCJzdHJlZXRJZFwiOlwiNjUzMjAxMDAyXCIsXCJ0ZW5hbnRJZFwiOlwiMTIyOTYxOTI3MDQ3Njg5MDExNVwifSIsImV4cCI6MTYxODI5NTA0MywiaWF0IjoxNjE4MjA4NjQzfQ.Wd-aVjGu_-114G5XWJPIafHqQFxAqUQPH1itWDrs0xfj_-5NKAWHHKQQDO0gQw-L6pgYm1OEBckS2vlT8gI36g",
					"platform-code": "school"
				}
			};
		},
		created() {
			this.generateCurrentDate();
		},
		destroyed() {
			this.url = null;
		},
		watch: {
			// "currentPrincipalId": {
			// 	handler(nVal, oVal) {
			// 		if (nVal) {
			// 			this.cameraList = this.originCameraList.filter(i => i.principalId == nVal);
			// 			let _item = this.cameraList[0];
			// 			this.getVideoUrl(_item.indexCode, _item.cn);
			// 		}
			// 	}
			// },
			"cameraIndexCode": {
				handler(nVal, oVal) {
					if(nVal) {
						this.getAllCameraBySchool();
					}
				}
			}
		},
		methods: {
			generateCurrentDate() {
				let {
					date,
					month,
					day,
					hour,
					minutes
				} = generateCurrentDate();
				this.cYear = date.getFullYear() + 1;
				this.sYear = date.getFullYear() - 1;
				this.playbackStartTime = `${this.cYear}-${month}-${day} ${hour}:${minutes}`;
				this.playbackEndTime = `${this.cYear}-${month}-${day} ${hour}:${minutes}`;
			},
			playbackStartTimeChange(e) {
				this.playbackStartTime = e.result;
				this.closePlaybackStartTimePicker();
				this.showPlaybackEndTimePicker();
			},
			closePlaybackStartTimePicker() {
				this.$refs.playbackStartTimePicker.hide();
			},
			showPlaybackStartTimePicker() {
				this.$refs.playbackStartTimePicker.show();
			},

			playbackEndTimeChange(e) {
				this.playbackEndTime = e.result;
				this.$refs.playbackEndTimePicker.hide();
				this.getCorrectTime();
			},
			closePlaybackEndTimePicker() {
				this.$refs.playbackEndTimePicker.hide();
				this.showPlaybackStartTimePicker();
			},
			showPlaybackEndTimePicker() {
				this.$refs.playbackEndTimePicker.show();
			},
			compare(property) {
				return function(a, b) {
					let value1 = a[property];
					let value2 = b[property];
					return value1 - value2;
				}
			},
			getAllCameraBySchool() {
				// this.cameraIndexCode = uni.getStorageSync("cameraIndexCode");
				if (!this.cameraIndexCode) {
					this.cStatus = false;
					return;
				}
				let _this = this;
				uni.request({
					header: this.publicHeader,
					// url: `${uni.getStorageSync("videoApiUrl")}/media/manage/camera/online/status`,
					url: `https://video.ygcf.dg.cn/video/api/media/manage/camera/online/status`,
					method: "POST",
					data: {
						pageNo: 1,
						pageSize: 100,
						regionId: _this.cameraIndexCode
					},
					success(res) {
						// _this.cameraList = res.data.data.list;
						_this.originCameraList = res.data.data.list;
						API.getAllCameras({
							"searchParams": [{
								"fieldName": "equipment.principalId",
								"operate": "eq",
								"value": "1300604646909284353"	//此处需使用市场主体的主体编号
							}],
							"size": -1
						}).then(res1 => {
							res1.data.data.list.map(item => {
								_this.originCameraList.map(item1 => {
									if (item.originId == item1.indexCode) {
										item1.principalId = item.principalId;
										item1.visible = item.visible;
										item1.orderNum = item.orderNum;
										item1.cn = item.name;
										// item1.udpStream = item.udpStream;
									}
								})
							});
							
							// _this.cameraList = _this.originCameraList.filter(i => i.principalId == _this.currentPrincipalId);
							_this.cameraList = _this.originCameraList;
							_this.cameraList.sort(_this.compare("orderNum"));
							if (_this.cameraList.length == 0) {
								_this.cStatus = false;
								return;
							}
							let _item = _this.cameraList[0];
							_this.getVideoUrl(_item.indexCode, _item.cn);
						})
					}
				})
			},
			getVideoUrl(cameraIndexCode, cameraName, streamTypeObj = {
				streamType: 1
			}) {
				this.isLive = true;
				this.curName = cameraName;
				this.curCameraIndexCode = cameraIndexCode;

				let _this = this;
				uni.request({
					header: this.publicHeader,
					url: `https://video.ygcf.dg.cn/video/api/media/stream/camera/stream`,
					method: "POST",
					data: {
						cameraIndexCode,
						protocol: "hls",
						// transmode: udpStream ? 0 : 1,
						...streamTypeObj,
						// streamType: 1
					},
					success(res) {
						// let replace_str = uni.getStorageSync("transferHlsStreamUrl");
						let replace_str = "https://video.ygcf.dg.cn/hls";
						uni.showLoading({
							title: "视频加载中...",
							mask: true
						});
						_this.url = res.data.data.url.replace(/http:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{2,5}/,
							replace_str);
						uni.request({
							url: _this.url,
							success(res) {
								if (res.statusCode != 200) {
									if (_this.retryCount >= 2) {
										uni.showToast({
											icon: "none",
											title: "视频加载错误，请重试或切换其他视频源"
										})
									} else {
										_this.getVideoUrl(cameraIndexCode, cameraName, {
											streamType: _this.retryCount % 2
										})
										_this.retryCount++;
									}
								}
								uni.hideLoading();
							},
							fail(err) {
								uni.hideLoading();
							}
						})
					},
					fail() {
						uni.showToast({
							icon: "none",
							title: "视频加载错误，请稍后重试"
						})
					}
				})
			},

			getCorrectTime() {
				console.log(this.playbackStartTime)
				console.log(this.playbackEndTime)
				let g_startTime = formatDate(this.playbackStartTime);
				let g_endTime = formatDate(this.playbackEndTime);
				let currentTime = new Date(); //当前时间

				if (g_startTime > g_endTime) {
					uni.showToast({
						icon: "none",
						title: "开始日期不能大于结束日期"
					})
					return;
				}

				currentTime.setDate(currentTime.getDate() - 16);
				if (g_startTime < currentTime.getTime()) {
					uni.showToast({
						icon: "none",
						title: "只能查询最近十五天内的视频"
					})
					return;
				}

				let UTCDate = new Date(this.playbackStartTime.replace(/-/g, "/"));
				let UTCCurrentDate = new Date(this.playbackEndTime.replace(/-/g, "/"));

				UTCDate.setHours(UTCDate.getHours(), UTCDate.getMinutes() - UTCDate.getTimezoneOffset());
				UTCCurrentDate.setHours(UTCCurrentDate.getHours(), UTCCurrentDate.getMinutes() - UTCCurrentDate.getTimezoneOffset());

				let ISODate = UTCDate.toISOString().slice(0, 20) + "175+08:00";
				let ISOCurrentDate = UTCCurrentDate.toISOString().slice(0, 20) + "175+08:00";

				this.getVideoByTime(ISODate, ISOCurrentDate);
			},

			getVideoByTime(ISODate, ISOCurrentDate) {
				let _this = this;
				uni.request({
					header: this.publicHeader,
					url: `https://video.ygcf.dg.cn/video/api/media/stream/camera/playback/stream`,
					method: "POST",
					data: {
						// beginTime: "2020-07-03T00:00:00.175+08:00",
						// endTime: "2020-07-03T06:00:00.175+08:00",
						beginTime: ISODate,
						endTime: ISOCurrentDate,
						cameraIndexCode: _this.curCameraIndexCode,
						protocol: "hls",
						// streamType: 0,
						// transmode: 1,
						recordLocation: "1" //从设备获取
					},
					success(res) {
						let replace_str = "https://video.ygcf.dg.cn/hls";
						_this.url = res.data.data.url.replace(/http:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{2,5}/,
							replace_str);
						_this.url +=
							`?beginTime=${ISODate.slice(0, 19).replace(/-/g, "").replace(/:/g, "")}&endTime=${ISOCurrentDate.slice(0, 19).replace(/-/g, "").replace(/:/g, "")}`;
						_this.isLive = false;
					}
				})
				// VIDEO_API.getPlaybackStreamURL({
				// 	// beginTime: "2020-07-03T00:00:00.175+08:00",
				// 	// endTime: "2020-07-03T06:00:00.175+08:00",
				// 	beginTime: ISODate,
				// 	endTime: ISOCurrentDate,
				// 	cameraIndexCode: this.curCameraIndexCode,
				// 	protocol: "hls",
				// 	// streamType: 0,
				// 	// transmode: 1,
				// 	recordLocation: "1" //从设备获取
				// }).then(res => {
				// 	// let replace_str = `${VIDEO_SERVER_URL}:${VIDEO_DISPLAY_PORT}`;
				// 	// let replace_str = "http://113.108.126.133:8002";
				// 	let replace_str = "https://video.ygcf.dg.cn/hls";
				// 	this.url = res.data.data.url.replace(/http:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{2,5}/,
				// 		replace_str);
				// 	this.url +=
				// 		`?beginTime=${ISODate.slice(0, 19).replace(/-/g, "").replace(/:/g, "")}&endTime=${ISOCurrentDate.slice(0, 19).replace(/-/g, "").replace(/:/g, "")}`;
				// 	this.isLive = false;
				// })
			}
		}
	}
</script>

<style lang="less" scoped>
	.cu-btn {
		padding: 25rpx 30rpx !important;
		height: 100rpx !important;
	}

	.wrap {
		padding: 0 25rpx 25rpx;

		h1 {
			font-size: 34rpx;
			font-weight: 600;
			color: rgba(0, 0, 7, 1);
			margin-bottom: 25rpx;
		}

		.info {
			width: 100%;
			text-align: center;

			video {
				width: 100%;
			}
		}
	}
</style>
