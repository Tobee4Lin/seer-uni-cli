import {
	DOWMLOAD_URL
} from "@/config/index.js";

/* 
 * 图片下载
 * params: picItem | 图片所在的对象
 * params: context | 所在的上下文
 * params: needShow | 图片是否需要连环展示，默认为否。并强制使用picArr作为连环展示数组
 */
export async function downloadFile(picItem, context, needShow = false) {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: `${DOWMLOAD_URL}/${picItem.id || picItem.fileId}`,
			// header: {
			// 	"Authorization": uni.getStorageSync("token"),
			// 	"platform-code": uni.getStorageSync("platformCode")
			// },
			success: res => {
				context.$set(picItem, "downloadUrl", res.tempFilePath);
				needShow && context.picArr.push(res.tempFilePath);
				resolve();
			}
		})
	})
}
