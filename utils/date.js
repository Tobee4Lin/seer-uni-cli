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
