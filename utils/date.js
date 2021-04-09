export const format = (date, fmt) => {
	let o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

export const generateCurrentDate = () => {
	let date = new Date();
	let year = fillStr(date.getYear());
	let month = fillStr(date.getMonth() + 1);
	let day = fillStr(date.getDate());
	let hour = fillStr(date.getHours());
	let minutes = fillStr(date.getMinutes());

	return {
		date,
		year,
		month,
		day,
		hour,
		minutes
	}
}

const fillStr = (num) => {
	return num >= 10 ? num : `0${num}`;
}

//将 2020-10-10 19:30 类型的时间转为 2020/10/10 19:30，兼容Safari浏览器
export const formatDate = (date) => {
	return date.replace(/-/g, "/");
}

//获取时间戳
const parseDate = (date) => {
	return Date.parse(formatDate(date));
}
