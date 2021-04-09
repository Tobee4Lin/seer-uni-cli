import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		accessToken: "",
		inspectInfo: {},
		inspectOrder: {}
	},
	getters: {
		getAccessToken: state => {
			return state.accessToken;
		}
	},
	mutations: {
		login(state, provider) {
			state.accessToken = provider.access_token;
			uni.setStorageSync('accessToken', provider.access_token);
		},
		logout(state) {
			state.accessToken = "";
			uni.removeStorageSync('accessToken');
		},
		
		//保存检查单组件中的填写内容
		saveInspectInfo(state, payload) {
			state.inspectInfo = payload;
		},
		//保存检查单自身内容
		saveInspectOrder(state, payload) {
			state.inspectOrder = payload;
		},
	},
	actions: {
		logout({ commit }, info) {
			commit("logout");
		}
	}
})

export default store;
