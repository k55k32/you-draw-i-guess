import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'

require('weui') // 加载微信样式
require('./assets/animate.css') // 加载动画样式

Vue.use(VueRouter)

const router = new VueRouter({ routes })

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
