import Vue from 'vue'
import Vuex from 'vuex'
import LS from '../utils/LocalStorage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SAVE_USER (state, user) {
      state.user = user
      LS.put('user', user)
    }
  },
  actions: {
    login ({commit, state}, user) {
      commit('SAVE_USER', user)
    },
    'change-user' ({commit, state}, userInfo) {
      let user = state.user
      commit('SAVE_USER', {...user, ...userInfo})
    }
  },
  getters: {
    user: state => {
      return state.user || LS.get('user') || {}
    }
  }
})
