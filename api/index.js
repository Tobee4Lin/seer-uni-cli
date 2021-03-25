import request from "@/utils/request.js";

let header = {}

const METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE"
};

const API = {
	getInfo: data => {
		return request(`https://api.github.com/repos/facebook/react/issues?per_page=${data.per_page}&page=${data.page}`, {}, METHODS.GET, header);
	},
}

export default API;