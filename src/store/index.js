import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {},
    // 是否需要重新获取用户信息
    reFreshUserInfo: false,
  },
  mutations: {
    // 更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 更新是否需要重新获取用户信息
    updateReFreshUserInfo(state, flag) {
      state.reFreshUserInfo = flag;
    },
  },
  actions: {
  },
  modules: {
  }
})
