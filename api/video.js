import video_request from "@/utils/video_request.js";
import Vue from "vue";

let defaultHeader = {
	Authorization: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzZWVyX2d1ZXN0X3NjIiwicHJpbmNpcGFsLWlkIjoie1wiY2l0eUlkXCI6XCI2NTMyXCIsXCJpc29sYXRpb25Td2l0Y2hcIjpmYWxzZSxcInByaW5jaXBhbElkXCI6XCIxMzAwNjA0NjQ2OTA5Mjg0MzUzXCIsXCJwcmluY2lwYWxUeXBlXCI6XCJTVDAyXCIsXCJzdHJlZXRJZFwiOlwiNjUzMjAxMDAyXCIsXCJ0ZW5hbnRJZFwiOlwiMTIyOTYxOTI3MDQ3Njg5MDExNVwifSIsImV4cCI6MTYxODI5NTA0MywiaWF0IjoxNjE4MjA4NjQzfQ.Wd-aVjGu_-114G5XWJPIafHqQFxAqUQPH1itWDrs0xfj_-5NKAWHHKQQDO0gQw-L6pgYm1OEBckS2vlT8gI36g",
	"platform-code": "school"
};

const VIDEO_API = {
	//根据学校区域编号查询监控点列表
	getAllCameraBySchool: data => {
		return video_request("media/manage/camera/online/status", data, "POST", defaultHeader);
	},
	
	//获取视频URL
	getCameraStreamURL: data => {
		return video_request("media/stream/camera/stream", data, "POST", defaultHeader);
	},
	
	//通过学校名称获取监控code
	getCameraRegionIndexCodeByName: data => {
		return video_request("resources/region/list/query", data, "POST", defaultHeader);
	},

	//获取回放视频
	getPlaybackStreamURL: data => {
		return video_request("media/stream/camera/playback/stream", data, "POST", defaultHeader);
	}
}

export default VIDEO_API;
