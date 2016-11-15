import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import WebSocketClient from './WebSocketClient'
import 'weui'
import './assets/animate.css'

Vue.use(VueRouter)

const router = new VueRouter({ routes })

WebSocketClient.init({
  path: 'ws://localhost:9001',
  open () {
    console.log('open success')
    this.send('hello')
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
