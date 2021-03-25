const navigateTo = (url, data) => {
	url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
	uni.navigateTo({
		url
	});
}

const param = data => {
	let url = '';
	for (var k in data) {
		let value = data[k] !== undefined ? data[k] : '';
		url += '&' + k + '=' + encodeURIComponent(value);
	}
	return url ? url.substring(1) : '';
}

export {
	navigateTo
}
