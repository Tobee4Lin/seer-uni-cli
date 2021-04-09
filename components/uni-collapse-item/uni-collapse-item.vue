<template>
	<view :class="{ 'uni-collapse-cell--disabled': disabled,'uni-collapse-cell--notdisabled': !disabled, 'uni-collapse-cell--open': isOpen,'uni-collapse-cell--hide':!isOpen }"
	 class="uni-collapse-cell">
		<view class="uni-collapse-cell__title" @click="onClick">
			<!-- <image v-if="thumb" :src="thumb" class="uni-collapse-cell__title-img" /> -->
			<text v-if="hasUnqualified !== null" class="cuIcon-tagfill" style="margin-right: 10rpx;color: #0091FF;"></text>
			<text class="uni-collapse-cell__title-text custom-text-cut-2" style="flex: 2;">{{ title }}</text>
			
			<!-- 检查单相关 -->
			<block v-if="hasUnqualified !== null">
				<block v-if="hasUnqualified == true">
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #e54d42;">不合格：{{unqualifiedNum}}</text>
				</block>
				<block v-else>
					<block v-if="hasToBeImproved == true">
						<text class="uni-collapse-cell__title-text" style="text-align: center;color: #fbbd08;">有待完善</text>
					</block>
					<text v-else class="uni-collapse-cell__title-text" style="text-align: center;color: #39b54a;">合格</text>
				</block>
			</block>
			
			<!-- 场所设备清洁 -->
			<block v-else-if="hasQualified !== null">
				<block v-if="hasQualified == true">
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #39b54a;">合格</text>
				</block>
				<block v-else>
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #e54d42;">不合格</text>
				</block>
			</block>
			
			<!-- 人员培训 -->
			<block v-else-if="hasAttend !== null">
				<block v-if="hasAttend == true">
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #39b54a;">已参加</text>
				</block>
				<block v-else>
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #e54d42;">未参加</text>
				</block>
			</block>
			
			<!-- 冷柜监控，晨检记录 -->
			<block v-else-if="hasNormal !== null">
				<block v-if="hasNormal == true">
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #39b54a;">正常</text>
				</block>
				<block v-else>
					<text class="uni-collapse-cell__title-text" style="text-align: center;color: #e54d42;">异常</text>
				</block>
			</block>
			
			<!-- #ifdef MP-ALIPAY -->
			<view :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }"
			 class="uni-collapse-cell__title-arrow">
				<uni-icons color="#bbb" size="20" type="arrowdown" />
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<uni-icons :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }"
			 class="uni-collapse-cell__title-arrow" color="#bbb" size="20" type="arrowdown" />
			<!-- #endif -->
		</view>
		<view :class="{'uni-collapse-cell__content--hide':!isOpen}" class="uni-collapse-cell__content">
			<view :class="{ 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__wrapper" :style="{'transform':isOpen?'translateY(0)':'translateY(-50%)','-webkit-transform':isOpen?'translateY(0)':'translateY(-50%)'}">
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniCollapseItem',
		components: {
			uniIcons
		},
		props: {
			title: {
				// 列表标题
				type: String,
				default: ''
			},
			name: {
				// 唯一标识符
				type: [Number, String],
				default: 0
			},
			hasUnqualified: {
				type: Boolean,
				default: null
			},
			hasToBeImproved: {
				type: Boolean,
				default: false
			},
			unqualifiedNum: {
				type: Number,
				default: 0
			},
			hasAttend: {
				type: Boolean,
				default: null
			},
			hasNormal: {
				type: Boolean,
				default: null
			},
			hasQualified: {
				type: Boolean,
				default: null
			},
			disabled: {
				// 是否禁用
				type: Boolean,
				default: false
			},
			showAnimation: {
				// 是否显示动画
				type: Boolean,
				default: false
			},
			open: {
				// 是否展开
				type: Boolean,
				default: false
			},
			thumb: {
				// 缩略图
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isOpen: false
			}
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (String(this.collapse.accordion) === 'true') {
				if (this.isOpen) {
					let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
					if (lastEl) {
						this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
					}
				}
			}
		},
		methods: {
			onClick() {
				if (this.disabled) {
					return
				}
				if (String(this.collapse.accordion) === 'true') {
					this.collapse.childrens.forEach(vm => {
						if (vm === this) {
							return
						}
						vm.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
				this.$emit("change", this.isOpen)
				this.collapse.onChange && this.collapse.onChange()
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';

	.uni-collapse-cell {
		flex-direction: column;
		// border-color: #eee;
		// border-bottom-width: 1px;
		// border-bottom-style: solid;
	}


	.uni-collapse-cell--hover {
		background-color: #FFFFFF;
	}

	.uni-collapse-cell--open {
		background-color: #FFFFFF;
	}

	.uni-collapse-cell--disabled {
		background-color: #FFFFFF;
		// opacity: 0.3;
	}


	.uni-collapse-cell--hide {
		height: 48px;
	}

	.uni-collapse-cell--animation {
		// transition: transform 0.3s ease;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.uni-collapse-cell__title {
		// padding: 12px 12px;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		height: 48px;
		line-height: 24px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-collapse-cell__title:active {
		background-color: #FFFFFF;
	}

	.uni-collapse-cell__title-img {
		height: $uni-img-size-base;
		width: $uni-img-size-base;
		margin-right: 10px;
	}

	.uni-collapse-cell__title-arrow {
		width: 20px;
		height: 20px;
		transform: rotate(0deg);
		transform-origin: center center;

	}

	.uni-collapse-cell__title-arrow-active {
		transform: rotate(180deg);
	}

	.uni-collapse-cell__title-text {
		flex: 1;
		font-size: $uni-font-size-base;
		/* #ifndef APP-NVUE */
		// white-space: nowrap;
		color: inherit;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.custom-text-cut-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.uni-collapse-cell__content {
		overflow: hidden;
	}

	.uni-collapse-cell__wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-collapse-cell__content--hide {
		height: 0px;
		line-height: 0px;
	}
</style>
