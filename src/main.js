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

const webSocket = WebSocketClient.init({
  path: 'ws://118.190.4.119:9001',
  open () {
    console.log('open success')
  }
})

Vue.prototype.isIPhone = () => {
  return window.navigator.userAgent.indexOf('iPhone') > -1
}
Vue.prototype.isAndroid = () => {
  return window.navigator.userAgent.indexOf('Android') > -1
}

Vue.prototype.$const = type => {
  return Constant[type]
}

Vue.prototype.$messageBox = MintUI.MessageBox

Vue.prototype.$message = (message, time = message.length / 4 * 1000) => {
  return MintUI.Toast({
    message: message,
    position: 'bottom',
    duration: time
  })
}

Vue.mixin({
  data () {
    return {
      receiveMsg: false
    }
  },
  created () {
    if (this.receiveMsg) {
      webSocket.on('message', msg => {
        this.$execute(msg.type, msg)
      })
    }
  },
  methods: {
    $execute (name, data) {
      if (typeof this[name] === 'function') {
        this[name](data)
      }
    },
    login (token) {
      webSocket.setHeader({token})
      this.send(token, 'login')
    },
    send (msg, type) {
      webSocket.send(msg, type)
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
