import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import WebSocketClient from './WebSocketClient'
import 'weui'
import './assets/animate.css'

Vue.use(VueRouter)

const router = new VueRouter({ routes })

const webSocket = WebSocketClient.init({
  path: 'ws://42.96.203.79:9001',
  open () {
    console.log('open success')
  }
})

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
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    app.$router.replace({ name: 'no-page', params: {message: to.path} })
  }
  next()
})

document.addEventListener('touchmove', e => {
  e.preventDefault()
}, false)

require.ensure([], r => {
  let fastclick = require('fastclick')
  fastclick.attach(document.body)
}, 'fastclick')
