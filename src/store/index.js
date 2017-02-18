import Vue from 'vue'
import Vuex from 'vuex'
import LS from '../utils/LocalStorage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    register (state, user) {
      state.user = user
    }
  },
  actions: {
    login ({commit, state}, user = LS.get('user')) {
      if (!user) {
        user = {
          name: '玩家-' + new Date().getTime()
        }
      }
      commit('register', user)
    }
  }
})
