import Vue from 'vue'
import App from '~/App'
import VueRouter from 'vue-router'
import routes from '~/routes'
import store from '~/store'
import WebSocketClient from './WebSocketClient'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '~/assets/less/golbal.less'
import '~/assets/less/components.less'
import Constant from './constant'

Vue.use(VueRouter)
Vue.use(MintUI)

const router = new VueRouter({ routes })

Vue.prototype.isIPhone = () => {
  return window.navigator.userAgent.indexOf('iPhone') > -1
}
Vue.prototype.isAndroid = () => {
  return window.navigator.userAgent.indexOf('Android') > -1
}

Vue.prototype.$const = type => {
  return Constant[type]
}

Vue.prototype.loading = text => {
  Vue.prototype._currentLoading = MintUI.Indicator.open({
    text, spinnerType: 'snake'
  })
}
Vue.prototype.loaded = _ => {
  Vue.nextTick(_ => MintUI.Indicator.close())
}

Vue.prototype.$messageBox = MintUI.MessageBox

Vue.prototype.$message = (message, time = message.length / 4 * 1000) => {
  return MintUI.Toast({
    message: message,
    position: 'bottom',
    duration: time
  })
}
router.beforeEach((to, from, next) => {
  Vue.prototype.loading('连接中...')
  if (!Vue.prototype.$webSocket) {
    const webSocket = WebSocketClient.init({
      path: 'ws://192.168.31.209:9001',
      open () {
        let user = store.getters.user
        webSocket.request(user, 'login').then((user) => {
          store.dispatch('login', user)
          if (user.inGame) {
            router.replace({name: 'begin', params: {id: user.currentRoomId}})
          }
          next()
        })
      }
    })
    Vue.prototype.$webSocket = webSocket
  } else {
    next()
  }
})
router.afterEach(() => {
  Vue.prototype.loaded()
})

Vue.mixin({
  created () {
    const events = this.socketEvents
    if (events) {
      Object.keys(events).forEach(k => {
        this.$webSocket.on(k, events[k].bind(this))
      })
    }
  },
  beforeDestory () {
    const events = this.socketEvents
    if (events) {
      Object.keys(events).forEach(k => {
        this.$webSocket.off(k, events[k].bind(this))
      })
    }
  },
  methods: {
    $execute (name, data) {
      if (typeof this[name] === 'function') {
        this[name](data)
      }
    },
    send (msg, type) {
      // webSocket.send(msg, type)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

document.addEventListener('touchmove', e => {
  e.preventDefault()
}, false)
