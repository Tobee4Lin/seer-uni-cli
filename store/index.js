import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		accessToken: ""
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
		}
	},
	actions: {
		logout({ commit }, info) {
			commit("logout");
		}
	}
})

export default store;
