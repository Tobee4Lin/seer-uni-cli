<template>
	<view>
		<NoticeDetailComp 
			:notice="notice" 
		/>
	</view>
</template>

<script>
	import API from "@/api/index.js";
	import NoticeDetailComp from "@/components/common/notice_comp/detail.vue";
	
	export default {
		data() {
			return {
				id: "",
				notice: null
			};
		},
		components: {
			NoticeDetailComp
		},
		onLoad(opt) {
			this.id = opt.id;
			this.getNoticeDetail();
		},
		methods: {
			getNoticeDetail() {
				API.getNoticeDetail(this.id).then(async res => {
					if (res.data.code == 200) {
						this.notice = res.data.data;
						this.notice.content = decodeURIComponent(this.notice.content).replace(/\<img/gi,
							'<img style="max-width:100%;height:auto" ');
					}
				});
			}
		}
	}
</script>
