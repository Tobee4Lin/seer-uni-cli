import request from "@/utils/request.js";

let defaultHeader = {
	Authorization: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzZWVyX2d1ZXN0X3N0IiwicHJpbmNpcGFsLWlkIjoie1wiaXNvbGF0aW9uU3dpdGNoXCI6ZmFsc2UsXCJwcmluY2lwYWxJZFwiOlwiMTMwMjk1MDQ3MTA0NDAzODY1N1wiLFwicHJpbmNpcGFsVHlwZVwiOlwiMDIwMzAxXCIsXCJzdHJlZXRJZFwiOlwiNjUzMjAxMDAyXCIsXCJ0ZW5hbnRJZFwiOlwiMTIyOTYxOTI3MDQ3Njg5MDExNVwifSIsImV4cCI6MTYxODAxNDcxNCwiaWF0IjoxNjE3OTI4MzE0fQ.HBY1UGUPJX7Bk6d5fRa0HarabEXomeTslCOyyNgRlh31gq87M7zhcVPK7OEjMvnJfQiXYiVWxJzibdOj6rUbdw",
	"platform-code": "canteen",
};

const METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE"
};

const API = {
	login: (data, header) => {
		return request("isp-cloud-system/users/login", data, METHODS.POST, header);
	},
	setToken: (token) => {
		defaultHeader.Authorization = token;
	},
	//获取字典内容
	getDict: (data = {}) => {
		return request(`isp-cloud-system/dict/details/${data}`, data, METHODS.GET, defaultHeader);
	},
	
	//根据条件获取消息列表
	getNotifies: (data = {}) => {
		return request("isp-cloud-substation/messages/list", data, METHODS.POST, defaultHeader);
	},
	//设置消息已读
	setNotifyRead: (data = {}) => {
		return request("isp-cloud-substation/messages/mark/read", data, METHODS.PUT, defaultHeader);
	},
	//设置消息未读
	setNotifyUnread: (data = {}) => {
		return request("isp-cloud-substation/messages/mark/unread", data, METHODS.PUT, defaultHeader);
	},
	
	//获取整改单
	getRectifyOrder: (data = {}) => {
		return request("isp-cloud-inspection-center/rectifyOrders/list", data, METHODS.POST, defaultHeader);
	},
	//根据检查单号获取整改单详情
	getRectifyOrderDetail: data => {
		return request(`isp-cloud-inspection-center/rectifyOrders/detail/${data}`, {}, METHODS.GET, defaultHeader);
	},
	//整改单整改
	addRectifyOrders: data => {
		return request("isp-cloud-inspection-center/rectifyOrders/rectify", data, METHODS.PUT, defaultHeader);
	},
	
	//获取所有检查单列表
	getInspectList: data => {
		return request("isp-cloud-inspection-center/inspectOrders/self/list", data, METHODS.POST, defaultHeader);
	},
	//根据检查单号获取检查单详情
	getInspectDetail: data => {
		return request(`isp-cloud-inspection-center/inspectOrders/detail/${data}`, {}, METHODS.GET, defaultHeader);
	},
	
	//获取预警记录
	getWarningList: (data = {}) => {
		return request("isp-cloud-event-hubs/events/self/list", data, METHODS.POST, defaultHeader);
	},
	getWarningDetail: data => {
		return request(`isp-cloud-event-hubs/events/details/${data}`, {}, METHODS.GET, defaultHeader);
	},
	
	//获取任务列表
	getTaskList: (data = {}) => {
		return request("isp-cloud-task-center/taskOrder/list", data, METHODS.POST, defaultHeader);
	},
	
	//根据任务编号获取对应任务详情
	getTaskDetailById: (data) => {
		return request(`isp-cloud-task-center/taskOrder/detail/${data}`, {}, METHODS.GET, defaultHeader);
	},
	//执行任务
	executeTask: data => {
		return request("isp-cloud-task-center/taskOrder/execute", data, METHODS.PUT, defaultHeader);
	},
	
	
	//获取主体对应的检查类型
	getAllCheckTypeByPrincipal: (data) => {
		return request(`isp-cloud-stms/checkTaskTypes/suitability/${data}`, {}, METHODS.GET, defaultHeader);
	},
	//获取检查模板列表
	getInspectOrderTemplates: (data) => {
		return request("isp-cloud-stms/inspectTemplates/list", data, METHODS.POST, defaultHeader);
	},
	//获取检查模板详情
	getInspectOrderTemplateDetail: (data) => {
		return request(`isp-cloud-stms/inspectTemplates/detail/${data}`, {}, METHODS.GET, defaultHeader);
	},
	
	
	getInfo: data => {
		return request(`https://api.github.com/repos/facebook/react/issues?per_page=${data.per_page}&page=${data.page}`, {}, METHODS.GET, defaultHeader);
	},
}

export default API;